# Aurora OSI - Render Deployment

This folder contains a self-contained deployment package for Aurora OSI v3.

## Services

1.  **aurora-api (Backend)**
    *   **Type**: Docker (FastAPI)
    *   **Port**: 10000
    *   **Function**: Handles data processing, simulation logic, and API requests.

2.  **aurora-frontend (Frontend)**
    *   **Type**: Static Site (React + Vite)
    *   **Build**: `npm run build` -> `/dist`
    *   **Function**: User interface.

## How to Deploy on Render

1.  Log in to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Blueprint**.
3.  Connect your repository.
4.  Render will detect `aurora-render/render.yaml`.
5.  Click **Apply**.

## Environment Variables

The `render.yaml` automatically configures the following:

*   **Frontend**: `VITE_API_URL` is automatically populated with the URL of the `aurora-api` service.
*   **Backend**: `PORT` is set to `10000`.

## Verification

After deployment, check the backend health:

```bash
curl https://<your-api-url>.onrender.com/system/health
# Expected Output: {"status":"ONLINE","system":"Aurora OSI v3"}
```

## Local Development (in this folder)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 10000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
