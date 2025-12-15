import os
import json
import time
import random
import math
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI(title="Aurora OSI v3 API")

# --- CORS Configuration ---
# Allow requests from your frontend (localhost + production domains)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://aurora-frontend.onrender.com",
    # Add your specific Render frontend URL if known, e.g.:
    # "https://aurora-frontend-xxxx.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development ease; restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Shared Constants & State ---
JOBS_DIR = "./jobs"
if not os.path.exists(JOBS_DIR):
    os.makedirs(JOBS_DIR, exist_ok=True)

# In-memory job store for simple persistence
job_store: Dict[str, Dict[str, Any]] = {}

# --- Pydantic Models ---
class JobPayload(BaseModel):
    region: Dict[str, Any]
    resource_types: List[str]
    resolution: str
    mode: str

class KeyPayload(BaseModel):
    key_content: str

# --- Utility Functions ---
def generate_mock_voxels(lat: float, lon: float):
    """Generates a 3D grid of voxels based on lat/lon seed."""
    voxels = []
    # Simple deterministic seed based on coords
    seed = int(abs(lat * lon * 10000))
    random.seed(seed)
    
    for z in range(4): # Depth layers
        for y in range(4):
            for x in range(4):
                lithology = "Sediment"
                if z == 1: lithology = "Cap Rock"
                elif z == 2: lithology = "Reservoir"
                elif z == 3: lithology = "Basement"
                
                # Create a "sweet spot" in the middle
                is_target = (x in [1,2] and y in [1,2] and z == 2)
                prob = random.uniform(0.7, 0.95) if is_target else random.uniform(0.05, 0.3)
                
                voxels.append({
                    "id": f"v-{x}-{y}-{z}",
                    "x": x, "y": y, "z": z,
                    "lithology": lithology,
                    "density": 2.0 + (z * 0.2) + random.uniform(-0.1, 0.1),
                    "mineralProb": prob,
                    "uncertainty": random.uniform(0.05, 0.2)
                })
    return voxels

# --- Endpoints ---

@app.get("/system/health")
async def health_check():
    """Health check for connectivity validation."""
    return {"status": "ONLINE", "system": "Aurora OSI v3", "timestamp": time.time()}

@app.get("/system/status")
async def system_status():
    """Returns the initialization status of subsystems."""
    return {
        "gee_initialized": True, # Mocking GEE as active
        "quantum_bridge": "STANDBY",
        "gpu_nodes": 4,
        "active_jobs": len(job_store)
    }

@app.post("/system/upload_key")
async def upload_key(file: UploadFile = File(...)):
    """Mock endpoint to validate service account upload."""
    content = await file.read()
    try:
        data = json.loads(content)
        if "private_key" in data:
            return {"status": "success", "message": "Key validated and stored securely."}
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid key format"})
    except:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid JSON"})

@app.post("/system/upload_key_text")
async def upload_key_text(payload: KeyPayload):
    try:
        data = json.loads(payload.key_content)
        if "private_key" in data:
            return {"status": "success", "message": "Key validated and stored securely."}
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid key format"})
    except:
        return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid JSON"})

# --- Job Management ---

@app.post("/jobs")
async def create_job(payload: JobPayload, background_tasks: BackgroundTasks):
    """Creates a new long-running analysis job."""
    job_id = f"JOB-{int(time.time())}"
    
    # Initialize job state
    job_store[job_id] = {
        "job_id": job_id,
        "status": "RUNNING",
        "progress": 0,
        "current_task": "Initializing Ingestion...",
        "start_time": time.time(),
        "payload": payload.dict()
    }
    
    # Simulate processing in background (simple linear progression)
    background_tasks.add_task(process_job_mock, job_id)
    
    return {"job_id": job_id, "status": "PENDING"}

async def process_job_mock(job_id: str):
    """Simulates a long-running task updating status over time."""
    stages = [
        (10, "Ingesting Sentinel-1/2 Data..."),
        (30, "Atmospheric Correction (USHE)..."),
        (50, "Running Physics Inversion (PCFC)..."),
        (75, "Generating Voxel Models..."),
        (90, "Validating with Quantum Constraints..."),
        (100, "Finalizing Report...")
    ]
    
    for progress, task in stages:
        time.sleep(2) # Wait 2 seconds between stages
        if job_id in job_store:
            job_store[job_id]["progress"] = progress
            job_store[job_id]["current_task"] = task
    
    if job_id in job_store:
        job_store[job_id]["status"] = "COMPLETED"
        job_store[job_id]["current_task"] = "Done"

@app.get("/jobs/{job_id}/status")
async def get_job_status(job_id: str):
    """Polls the status of a specific job."""
    if job_id not in job_store:
        # Fallback for demo: if ID not found, return a completed mock
        return {
            "job_id": job_id,
            "status": "COMPLETED",
            "progress": 100,
            "current_task": "Restored from Archive"
        }
    return job_store[job_id]

@app.get("/jobs/{job_id}/artifacts/results.json")
async def get_job_results(job_id: str):
    """Returns the final output of the job."""
    # Return mock results
    return {
        "results": [
            {
                "element": "Lithium", 
                "resourceType": "Battery Metal", 
                "status": "Confirmed", 
                "probability": 0.88,
                "specifications": { "grade": 1.2, "depth": 350, "tonnage": 45.2 }
            }
        ],
        "drillTargets": [
            {"id": "DT-01", "lat": -23.5, "lon": -68.0, "depth": 400, "priority": "High", "description": "Primary Brine Reservoir"}
        ]
    }

# --- Module Specific Endpoints ---

@app.get("/gee/schedule")
async def get_satellite_schedule(lat: float, lon: float):
    """Mocks satellite pass schedules."""
    return {
        "schedule": [
            {"satellite": "Sentinel-1A", "sensor_type": "SAR (C-Band)", "time_to_acquisition": "2h 15m", "tasking_status": "Available"},
            {"satellite": "Landsat 9", "sensor_type": "Multispectral", "time_to_acquisition": "14h 30m", "tasking_status": "Scheduled"},
            {"satellite": "WorldView-3", "sensor_type": "Hyperspectral", "time_to_acquisition": "1d 4h", "tasking_status": "Premium Only"}
        ]
    }

@app.get("/twin/voxels")
async def get_digital_twin_voxels(lat: float, lon: float):
    """Returns voxel data for the Digital Twin 3D view."""
    return {"voxels": generate_mock_voxels(lat, lon)}

@app.get("/tmal/analysis")
async def get_temporal_analysis(lat: float, lon: float):
    """Mocks time-series deformation data."""
    data_points = []
    trend = "Stable"
    velocity = 0.0
    
    # Determine trend based on simple coordinate hash
    coord_sum = lat + lon
    if int(coord_sum) % 3 == 0:
        trend = "Subsidence"
        velocity = -12.5
    elif int(coord_sum) % 3 == 1:
        trend = "Uplift"
        velocity = 4.2
        
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_def = 0
    
    for m in months:
        change = (velocity / 12) + random.uniform(-1, 1)
        current_def += change
        data_points.append({
            "date": m,
            "deformation": current_def,
            "thermalInertia": 800 + random.uniform(-50, 50),
            "coherence": 0.95 - (abs(current_def) * 0.01)
        })
        
    return {
        "trend": trend,
        "velocity_mm_yr": velocity,
        "depth_resolution": 75,
        "data": data_points
    }

@app.get("/pcfc/inversion")
async def get_physics_inversion(lat: float, lon: float, depth: float):
    """Mocks physics inversion residuals."""
    return {
        "structure": "Anticline (Inferred)",
        "residuals": {
            "mass_conservation": random.uniform(0.001, 0.005),
            "momentum_balance": random.uniform(0.002, 0.04)
        }
    }

@app.get("/pcfc/tomography")
async def get_tomography_slice(lat: float, lon: float):
    """Returns a 2D array representing a vertical slice of density."""
    rows = 50
    cols = 50
    grid = []
    
    # Generate a synthetic anticline
    center_x = cols // 2
    
    for y in range(rows):
        row = []
        for x in range(cols):
            # Anticline shape function
            structure_y = (rows // 2) + 10 * math.cos((x - center_x) * 0.15)
            
            val = 2.4 # Default density
            if y > structure_y:
                val = 2.7 # Basement
            elif y > structure_y - 5:
                val = 2.3 # Reservoir
            elif y < 5:
                val = 2.1 # Surface
                
            # Add noise
            val += random.uniform(-0.05, 0.05)
            row.append(val)
        grid.append(row)
        
    return {
        "slice": grid,
        "structure": "Anticline (Inferred)",
        "residuals": {"mass_conservation": 0.0015}
    }

@app.get("/seismic/slice")
async def get_seismic_slice(lat: float, lon: float, index: int, axis: str):
    """Returns a 2D array for seismic visualization."""
    size = 100
    grid = []
    uncertainty = []
    
    random.seed(index + int(lat))
    
    for y in range(size):
        row = []
        u_row = []
        for x in range(size):
            # Create wavy seismic lines
            wave = math.sin(y * 0.2 + x * 0.05) * math.cos(x * 0.1)
            val = wave + random.uniform(-0.2, 0.2)
            
            # Clip to -1, 1
            val = max(-1, min(1, val))
            row.append(val)
            u_row.append(random.uniform(0, 0.2))
        grid.append(row)
        uncertainty.append(u_row)
        
    return {
        "width": size,
        "height": size,
        "data": grid,
        "uncertainty": uncertainty,
        "horizons": [{"depth": [30 + math.sin(i*0.1)*5 for i in range(100)], "label": "Top Reservoir", "confidence": 0.9}],
        "faults": [],
        "axis": axis,
        "index": index
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
