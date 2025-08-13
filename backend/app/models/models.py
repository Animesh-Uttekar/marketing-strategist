from pydantic import BaseModel
from typing import List, Dict, Optional

class SimulationRequest(BaseModel):
    company_description: str
    advertisement_goal: str
    use_hugging_face: Optional[bool] = False  # Default to OpenAI, set True for Hugging Face

class SimulationResult(BaseModel):
    total_impressions: int
    total_clicks: int
    total_landings: int
    total_engagements: int
    total_conversions: int
    roi_fit_score: float
    roi_fit_tag: str

class SimulationResponse(BaseModel):
    user_journey_stats: Dict[str, int]
    roi_fit_score: float
    roi_fit_tag: str
    recommendations: List[str]