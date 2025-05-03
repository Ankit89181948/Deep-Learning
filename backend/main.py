from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import librosa
import numpy as np
import io
from transformers import pipeline
from typing import Dict
from pydub import AudioSegment
import logging
import tempfile

# Initialize FastAPI app
app = FastAPI(
    title="Language Identification API",
    description="API for identifying spoken language from audio recordings",
    version="1.0.0"
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response models
class PredictionResult(BaseModel):
    prediction: str
    language_code: str
    confidence: float
    file_type: str
    file_size: int
    duration_seconds: float

class ErrorResponse(BaseModel):
    detail: str

# Load model
try:
    language_identifier = pipeline(
        "audio-classification",
        model="sanchit-gandhi/whisper-medium-fleurs-lang-id"
    )
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

# Extended language mapping
LANGUAGE_MAP = {
    "bn": "Bengali",
    "gu": "Gujarati",
    "hi": "Hindi",
    "kn": "Kannada",
    "ml": "Malayalam",
    "mr": "Marathi",
    "pa": "Punjabi",
    "ta": "Tamil",
    "te": "Telugu",
    "ur": "Urdu"
}
def validate_audio(audio_array: np.ndarray) -> None:
    """Validate audio meets minimum requirements"""
    if len(audio_array) < 16000:  # At least 1 second at 16kHz
        raise ValueError("Audio is too short (minimum 1 second required)")
    if np.max(np.abs(audio_array)) < 0.01:
        raise ValueError("Audio signal is too weak")
    if np.std(audio_array) < 0.01:
        raise ValueError("Audio appears to be silent")

def preprocess_audio(audio_bytes: bytes) -> np.ndarray:
    """Convert any audio to 16kHz mono WAV using pydub (no FFmpeg)."""
    try:
        # First try direct librosa load (works for WAV/MP3)
        with io.BytesIO(audio_bytes) as audio_file:
            audio, _ = librosa.load(audio_file, sr=16000, mono=True)
            return audio
    except Exception as e:
        logger.warning(f"Direct load failed, trying pydub: {str(e)}")
        try:
            # Convert to WAV manually using pydub
            with io.BytesIO(audio_bytes) as audio_file:
                audio = AudioSegment.from_file(audio_file)
                audio = audio.set_frame_rate(16000).set_channels(1)
                wav_io = io.BytesIO()
                audio.export(wav_io, format="wav")  # Force WAV export
                wav_io.seek(0)
                audio_array, _ = librosa.load(wav_io, sr=16000, mono=True)
                return audio_array
        except Exception as e2:
            logger.error(f"Audio processing failed: {str(e2)}")
            raise ValueError("Unsupported audio format (use WAV/MP3)")

def predict_language(audio: np.ndarray) -> Dict[str, str]:
    """Predict language from audio numpy array"""
    try:
        if len(audio) < 16000:
            return {"error": "Audio too short", "success": False}
            
        prediction = language_identifier(audio)
        top_pred = prediction[0]
        
        language_code = top_pred['label']
        language_name = LANGUAGE_MAP.get(language_code, language_code.title())
        
        return {
            "language": language_name,
            "language_code": language_code,
            "confidence": float(top_pred['score']),
            "success": True
        }
    except Exception as e:
        logger.error(f"Prediction failed: {str(e)}")
        return {"error": str(e), "success": False}

@app.post("/predict", response_model=PredictionResult, responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def predict_language_endpoint(file: UploadFile = File(...)):
    """Endpoint to handle audio file upload and language prediction"""
    try:
        logger.info(f"Received file: {file.filename}, type: {file.content_type}")
        
        # Validate file type
        if not file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        contents = await file.read()
        if len(contents) < 1024:  # 1KB minimum
            raise HTTPException(status_code=400, detail="File too small")
        
        # Process audio
        try:
            audio_array = preprocess_audio(contents)
            validate_audio(audio_array)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Audio processing error: {str(e)}")
            raise HTTPException(status_code=400, detail="Failed to process audio file")

        logger.info(f"Audio processed, shape: {audio_array.shape}, duration: {len(audio_array)/16000:.2f}s")
        
        # Predict language
        result = predict_language(audio_array)
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Prediction failed'))

        return {
            "prediction": result['language'],
            "language_code": result['language_code'],
            "confidence": result['confidence'],
            "file_type": file.content_type,
            "file_size": len(contents),
            "duration_seconds": len(audio_array)/16000
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": True,
        "supported_languages": list(LANGUAGE_MAP.values())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)