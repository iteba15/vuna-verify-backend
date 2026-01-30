import torch
import torch.nn as nn
from torchvision import models, transforms
import xgboost as xgb
import rasterio
import numpy as np
import os

class VunaVerifier:
    def __init__(self, model_path='vuna_hybrid_gosif_model.json'):
        # 1. Load the XGBoost Brain
        self.xgb_model = xgb.XGBRegressor()
        self.xgb_model.load_model(model_path)
        
        # 2. Load the ResNet Eyes (CPU mode for servers)
        self.device = torch.device("cpu")
        resnet = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
        resnet.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.feature_extractor = nn.Sequential(*list(resnet.children())[:-1]).to(self.device)
        self.feature_extractor.eval()
        
        # 3. Setup Image Resizer
        self.resizer = transforms.Resize((128, 128))

    def verify_credit(self, image_path):
        """
        Input: Path to a Sentinel-2 TIF image.
        Output: Dictionary with Carbon Flux, Tonnes, and Dollar Value.
        """
        try:
            # Check if file exists
            if not os.path.exists(image_path):
                return {"status": "error", "message": "File not found"}

            # A. Read Physics Bands (7, 8, 6)
            with rasterio.open(image_path) as src:
                img = src.read([7, 8, 6])
            
            # B. Preprocess (Normalize)
            img[img == -9999] = 0.0
            img = np.nan_to_num(img, nan=0.0)
            img[0] = np.clip(img[0], -1, 1)
            img[1] = np.clip(img[1], -1, 1)
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