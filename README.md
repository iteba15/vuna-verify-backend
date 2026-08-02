# VunaVerify Backend

Django backend for forest-carbon MRV (monitoring, reporting, verification) in Kenya: it serves gazetted-forest boundaries, project records, and a hybrid GOSIF-based carbon-flux prediction API.

## Overview

VunaVerify estimates carbon flux and the resulting CO2 sequestration and credit value for forest sites from satellite imagery. This backend exposes a REST API (Django + Django REST Framework) that lists monitored projects with their map boundaries and runs a prediction model over an uploaded or remote GeoTIFF to return carbon-flux, annual-tonnes-CO2, and estimated-revenue figures. It is intended for the project team and frontends (the interactive map) building carbon-monitoring tooling for Kenyan forests.

## Features / API

All API routes are mounted under `/api/` (see `verifier/urls.py` and `vuna_backend/urls.py`).

- `GET /api/projects/` — `ProjectListView`. Returns all `Project` records (id, name, latitude, longitude, `tiff_file`, cached flux/CO2/revenue, `geojson_boundary`, `updated_at`) for the interactive map.
- `POST /api/verify/` — `VerifyCreditView`. Accepts a GeoTIFF as `image_file` (upload) or `image_url`, plus optional project metadata. It runs the `VunaVerifier` model and returns the prediction. The request is validated by `VerificationInputSerializer`, which requires either `image_file` or `image_url`.
  - Optional fields: `project_id` (update an existing project), or `project_name` + `latitude` + `longitude` (create a new project on the fly).
  - On success the prediction is cached onto the `Project` and the response is:
    ```json
    {
      "status": "success",
      "carbon_flux": 0.0,
      "annual_tonnes_co2": 0.0,
      "estimated_revenue_usd": 0.0,
      "project_id": 1
    }
    ```
  - The current view requires project details (name, lat, lon) or an existing `project_id` so the result can be saved; a bare file upload with no project target is rejected.
- `GET /api/map/` — `map_view`. Renders the `verifier/map.html` template (interactive map page).
- `GET /admin/` — Django admin.

The prediction pipeline lives in `verifier/services.py` (`VunaVerifier`). It loads the GeoTIFF with rasterio, reads bands 7, 8 and 6, normalizes them (replaces `-9999`/NaN with 0, clips bands 7 and 8 to `[-1, 1]`, divides band 6 by 3000), resizes to 128x128, extracts features with a ResNet-18 backbone (CPU), and predicts carbon flux with the XGBoost model. From the predicted flux it derives annual tonnes of CO2 and an estimated USD value (assuming ~$20 per credit). `image_url` inputs are downloaded to a temp file and cleaned up after prediction.

Note: `vuna_predict_api.py` in the repo root is a standalone, pre-Django version of this same pipeline (a `VunaVerifier` class that loads the model directly and exposes `verify_credit(image_path)`). The Django app uses `verifier/services.py`; `vuna_predict_api.py` is kept as a reference/standalone script.

## Data model

Defined in `verifier/models.py`. There is one main model:

- `Project`
  - `name` (CharField)
  - `latitude`, `longitude` (FloatField) — map pin location
  - `tiff_file` (FileField, `projects/tiffs/`) — the source Sentinel-2/GeoTIFF physics data
  - `cached_flux`, `cached_co2`, `cached_revenue` (FloatField, nullable) — cached prediction results
  - `geojson_boundary` (TextField) — a GeoJSON Polygon string for the project's boundary
  - `created_at`, `updated_at` (timestamps)

`Kenya_Gazetted_Forests.geojson` is a `FeatureCollection` (CRS84) of 388 gazetted Kenyan forests. Each feature carries properties such as `FOREST` (name), `GAZETTED` (status, e.g. "Community"), `area`, `Shape__Area`, `Shape__Length`, plus a `Polygon` geometry. The `import_forests.py` script reads this file, computes a centroid pin from the polygon vertices, and creates/updates `Project` rows with the polygon stored in `geojson_boundary`.

## The model

`vuna_hybrid_gosif_model.json` is the serialized XGBoost regressor at the core of the prediction pipeline. It is a hybrid GOSIF (Global OCO-2-based Solar-Induced Fluorescence) model: a ResNet-18 convolutional backbone extracts features from the multi-band GeoTIFF, and the XGBoost model maps those features to a GOSIF-style carbon-flux value. The economics in `services.py` then convert flux to annual tonnes of CO2 (via a GPP/net/area conversion and the 44/12 carbon-to-CO2 ratio) and to an estimated USD credit value. The model is loaded from `BASE_DIR / 'vuna_hybrid_gosif_model.json'`; keep that file in the repo root.

## Setup

Requires Python 3 and a system that can install PyTorch, rasterio, and XGBoost.

```bash
# 1. Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure the environment
cp .env.example .env      # Windows: copy .env.example .env
#    then set DJANGO_DEBUG=true in .env for local work

# 4. Apply database migrations (creates db.sqlite3, which is not in git)
python manage.py migrate

# 5. (Optional) Populate data
#    Seed a small set of sample projects:
python populate_projects.py
#    Import the 388 gazetted forests with boundaries from the GeoJSON:
python import_forests.py
#    Or generate simple square test boundaries for existing projects:
python populate_boundaries.py

# 6. Run the development server
python manage.py runserver
```

### Configuration

Settings are read from the environment, with `.env` loaded automatically when `python-dotenv` is installed. See [`.env.example`](.env.example).

| Variable | Default | Notes |
|---|---|---|
| `DJANGO_SECRET_KEY` | random per start | Set it anywhere sessions need to survive a restart. |
| `DJANGO_DEBUG` | `false` | Set `true` for local development only. Leaving it off means Django will not serve static files via `runserver`, so admin styling needs `--insecure` locally if you have not set it. |
| `DJANGO_ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated. |

The API is then available at `http://127.0.0.1:8000/api/` and the admin at `http://127.0.0.1:8000/admin/` (create a superuser first with `python manage.py createsuperuser`).

The populate/import scripts call `django.setup()` and must be run from the project root with `DJANGO_SETTINGS_MODULE=vuna_backend.settings` (the default they set), so run them after `migrate`.

## Tech stack

- Django 6 + Django REST Framework — web framework and API
- django-cors-headers — CORS (currently `CORS_ALLOW_ALL_ORIGINS = True` for development)
- SQLite — default database (`db.sqlite3`)
- PyTorch + torchvision — ResNet-18 feature extractor (CPU)
- XGBoost — carbon-flux regressor (`vuna_hybrid_gosif_model.json`)
- rasterio + NumPy — GeoTIFF reading and preprocessing
- requests — fetching remote GeoTIFFs for the `image_url` path
- Flask is listed in `requirements.txt` but the served API is Django; Flask is not used by this backend

## Related

This is the backend for the broader VunaVerify forest-carbon project. The companion model-development notebook is private. The frontend consumes `/api/projects/` for the map and `/api/verify/` for predictions.

## Status

Research / prototype backend. It runs with `DEBUG = True`, a committed development `SECRET_KEY`, open CORS, and SQLite, and the `/api/verify/` flow has rough edges. It is not hardened for production; treat it as a working prototype for the VunaVerify MRV pipeline.

## Author

**Allan Kiplagat Iteba** (GitHub [@iteba15](https://github.com/iteba15)), BSc Astrophysics & Space Science, University of Nairobi.

- LinkedIn: *(link to be added)*
- ResearchGate: *(link to be added)*
