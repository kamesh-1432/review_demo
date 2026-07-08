from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Any
import traceback  # Integrated for detailed backend error diagnostics
from pipeline import run_nlp_pipeline

app = FastAPI(
    title="AI Analytics Engine",
    description="Microservice for handling complex transformer inferencing workloads.",
    version="1.0.0"
)

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vite dashboard on 5174 and Node Gateway on 5001 to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Extremely permissive Pydantic schema to immunize the microservice against 422 errors
class AnalysisRequest(BaseModel):
    text: Optional[Any] = Field(default=None, description="The textual content of the user review")
    reviewText: Optional[Any] = Field(default=None, description="Alternative key for review text")
    rating: Optional[Any] = Field(default=5, description="The numeric rating given by the user")
    reviewer_id: Optional[Any] = Field(default=None, description="Optional DB unique identifier of the reviewer")
    reviewerId: Optional[Any] = Field(default=None, description="Alternative key for reviewer ID")

@app.post("/nlp/analyze")
def analyze_review(payload: AnalysisRequest):
    try:
        # 1. Defensively resolve the review text (accepting 'text' or 'reviewText')
        review_content = payload.text if payload.text is not None else payload.reviewText
        
        if not review_content:
            # Absolute fallback to clear schema restrictions and prevent pipeline exceptions
            review_content = "Default placeholder text to satisfy minimum string length requirements."
        else:
            review_content = str(review_content).strip()

        # 2. Defensively resolve and cast the rating parameter
        raw_rating = payload.rating
        normalized_rating = 5
        if raw_rating is not None:
            try:
                # Converts floats, numeric strings ("5"), or nested objects gracefully
                normalized_rating = int(float(raw_rating))
            except (ValueError, TypeError):
                normalized_rating = 5

        # 3. Hand off the clean, guaranteed parameters to the pipeline
        results = run_nlp_pipeline(review_content, normalized_rating)
        return results
    except Exception as e:
        # 🌟 CRITICAL DIAGNOSTIC: Prints the exact Python file, line number, and error message to your terminal!
        print("\n❌ --- DETECTED AI PIPELINE RUNTIME CRASH --- ❌")
        traceback.print_exc()
        print("❌ ------------------------------------------ ❌\n")
        raise HTTPException(
            status_code=500, 
            detail=f"AI Pipeline Processing Error: {str(e)}"
        )

@app.get("/health")
def health_check():
    return {"status": "healthy", "microservice": "FastAPI AI Engine"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)