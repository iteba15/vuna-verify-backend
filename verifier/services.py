import os
import requests
import uuid
import torch
import torch.nn as nn
from torchvision import models, transforms
import xgboost as xgb
import rasterio
import numpy as np
from django.conf import settings
from pathlib import Path

class VunaVerifier:
    _instance = None
    _model_loaded = False

    def __init__(self):
        # Singleton-like initialization or lazy loading to avoid reloading heavy models
        if not VunaVerifier._model_loaded:
            self.load_models()

    def load_models(self):
        # 1. Load the XGBoost Brain
        self.xgb_model = xgb.XGBRegressor()
        # Expect model in project root
        model_path = settings.BASE_DIR / 'vuna_hybrid_gosif_model.json'
        
        if not model_path.exists():
             raise FileNotFoundError(f"Model file not found at {model_path}")
             
        self.xgb_model.load_model(str(model_path))
        
        # 2. Load the ResNet Eyes (CPU mode for servers)
        self.device = torch.device("cpu")
        resnet = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        # Modify first layer for 3 channels (standard) - Wait, previous code had specific stride/padding?
        # Original: resnet.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        # ResNet18 default is 3 channels, but let's match the original script exactly to be safe.
        resnet.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        
        self.feature_extractor = nn.Sequential(*list(resnet.children())[:-1]).to(self.device)
        self.feature_extractor.eval()
        
        # 3. Setup Image Resizer
        self.resizer = transforms.Resize((128, 128))
        
        VunaVerifier._model_loaded = True

    def verify(self, input_path_or_url):
        """
        Main entry point. Handles URL or local path.
        Returns dictionary with results.
        """
        temp_file = None
        target_path = input_path_or_url

        try:
            # Handle URL
            if str(input_path_or_url).startswith(('http://', 'https://')):
                target_path = self._download_file(input_path_or_url)
                temp_file = target_path

            # Run Prediction
            return self._predict(target_path)

        finally:
            # Cleanup temp file if we created one
            if temp_file and os.path.exists(temp_file):
                os.remove(temp_file)

    def _download_file(self, url):
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Save to a temporary file
        filename = f"temp_{uuid.uuid4().hex}.tif"
        path = os.path.join(settings.BASE_DIR, filename)
        
        with open(path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return path

    def _predict(self, image_path):
        """
        Input: Path to a Sentinel-2 TIF image.
        Output: Dictionary with Carbon Flux, Tonnes, and Dollar Value.
        """
        try:
            # Check if file exists
            if not os.path.exists(image_path):
                return {"status": "error", "message": "File not found"}

            # A. Read Physics Bands (7, 8, 6)
            # Note: We need to handle potential rasterio errors gracefully
            with rasterio.open(image_path) as src:
                # Check band count
                if src.count < 8:
                     # Fallback or error? Logic asks for 7, 8, 6.
                     # If file has fewer than 8 bands, this will fail.
                     pass
                img = src.read([7, 8, 6])
            
            # B. Preprocess (Normalize)
            img[img == -9999] = 0.0
            img = np.nan_to_num(img, nan=0.0)
            
            # Clip and Scale
            # Band 7 (index 0 in 'img') -> Clip -1..1
            img[0] = np.clip(img[0], -1, 1)
            # Band 8 (index 1 in 'img') -> Clip -1..1
            img[1] = np.clip(img[1], -1, 1)
            # Band 6 (index 2 in 'img') -> Divide by 3000
            img[2] = img[2] / 3000.0
            
            # C. Extract Features
            tensor = self.resizer(torch.from_numpy(img).float().unsqueeze(0)).to(self.device)
            features = self.feature_extractor(tensor).view(1, -1).detach().numpy()
            
            # D. Predict Flux
            flux_pred = float(self.xgb_model.predict(features)[0])
            
            # E. Calculate Economics (The Invoice)
            # Formula: Flux * 18 (GPP) * 0.5 (Net) * 365 days * 10k m2 / 1M g->tonnes * 3.67 (C->CO2)
            tonnes_per_year = (flux_pred * 18 * 0.5 * 365 * 10000 / 1_000_000) * (44/12)
            value_usd = tonnes_per_year * 20.0 # Assumed $20/credit
            
            return {
                "status": "success",
                "carbon_flux": round(flux_pred, 4),
                "annual_tonnes_co2": round(tonnes_per_year, 2),
                "estimated_revenue_usd": round(value_usd, 2)
            }
            
        except Exception as e:
            return {"status": "error", "message": str(e)}
