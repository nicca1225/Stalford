import os
import json
import shutil
from pathlib import Path

from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="Stalford EduCore API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths relative to backend/
BASE_DIR = Path(__file__).parent
UPLOADS_DIR = BASE_DIR / "uploads"
WORKSHEETS_DIR = BASE_DIR / "worksheets"
OUTPUT_DIR = BASE_DIR / "output"
STATUS_FILE = OUTPUT_DIR / "status.json"
RESULTS_FILE = OUTPUT_DIR / "database_feed.json"
MARKING_SCHEME_PATH = UPLOADS_DIR / "Marking_Scheme.pdf"


def _write_status(status: str, progress: str) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    STATUS_FILE.write_text(json.dumps({"status": status, "progress": progress}))


# ---------------------------------------------------------------------------
# GET /api/health
# ---------------------------------------------------------------------------

@app.get("/api/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# GET /api/results
# ---------------------------------------------------------------------------

@app.get("/api/results")
def get_results():
    if not RESULTS_FILE.exists():
        raise HTTPException(status_code=404, detail={"error": "No results yet"})
    return json.loads(RESULTS_FILE.read_text())


# ---------------------------------------------------------------------------
# GET /api/status
# ---------------------------------------------------------------------------

@app.get("/api/status")
def get_status():
    if not STATUS_FILE.exists():
        return {"status": "idle", "progress": ""}
    return json.loads(STATUS_FILE.read_text())


# ---------------------------------------------------------------------------
# POST /api/grade
# ---------------------------------------------------------------------------

def _grading_task(marking_scheme: str, worksheets_dir: str, output_path: str) -> None:
    from analytics_test import run_grading_pipeline  # lazy import — keeps google-genai off the startup path

    def status_callback(msg: str) -> None:
        _write_status("processing", msg)

    try:
        run_grading_pipeline(
            base_directory=worksheets_dir,
            marking_scheme_path=marking_scheme,
            output_path=output_path,
            status_callback=status_callback,
        )
        _write_status("complete", "Done!")
    except Exception as exc:
        _write_status("error", str(exc))


@app.post("/api/grade")
async def grade(
    background_tasks: BackgroundTasks,
    marking_scheme: UploadFile = File(...),
    worksheets: list[UploadFile] = File(...),
):
    # Clear previous worksheets so old PDFs don't get re-graded
    if WORKSHEETS_DIR.exists():
        for child in WORKSHEETS_DIR.iterdir():
            if child.is_dir():
                shutil.rmtree(child, ignore_errors=True)
            else:
                child.unlink(missing_ok=True)
    WORKSHEETS_DIR.mkdir(parents=True, exist_ok=True)

    # a. Save marking scheme
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    with MARKING_SCHEME_PATH.open("wb") as f:
        shutil.copyfileobj(marking_scheme.file, f)

    # b/c. Parse filenames and save worksheets
    for ws in worksheets:
        filename = Path(ws.filename).stem          # strip .pdf
        parts = filename.split("_", 1)             # split on FIRST underscore only
        if len(parts) != 2:
            raise HTTPException(
                status_code=422,
                detail=f"Filename '{ws.filename}' must follow 'ClassName_StudentName.pdf' format.",
            )
        class_id, student_name = parts[0], parts[1]

        student_dir = WORKSHEETS_DIR / class_id
        student_dir.mkdir(parents=True, exist_ok=True)

        with (student_dir / f"{student_name}.pdf").open("wb") as f:
            shutil.copyfileobj(ws.file, f)

    # d. Write initial status
    _write_status("processing", "Starting...")

    # e. Launch background task
    background_tasks.add_task(
        _grading_task,
        marking_scheme=str(MARKING_SCHEME_PATH),
        worksheets_dir=str(WORKSHEETS_DIR),
        output_path=str(RESULTS_FILE),
    )

    # f. Return immediately
    return {"status": "processing"}
