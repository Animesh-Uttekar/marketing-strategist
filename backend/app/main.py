from fastapi import FastAPI
from app.models.models import SimulationRequest, SimulationResponse
from app.simulator.simulator import run_market_fit_simulation
from app.utils.gpt_utils import get_chatgpt_marketing_insight, get_simulation_params_from_context

# Try to import Hugging Face utilities, but make it optional
try:
    from app.utils.hf_utils import get_hf_marketing_insight, get_hf_simulation_params_from_context
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    print("⚠️  Hugging Face utilities not available (transformers not installed)")

app = FastAPI(title="AI Marketing Agent")

@app.post("/simulate", response_model=SimulationResponse)
def simulate(data: SimulationRequest):

    # Step 1: Extract campaign performance probabilities and ROI threshold based on the inputs.
    # Choose between OpenAI (default) or Hugging Face (GPT-OSS-120B) based on request parameter
    if data.use_hugging_face:
        if not HF_AVAILABLE:
            # Fallback to OpenAI if Hugging Face is not available
            print("⚠️  Hugging Face requested but not available, falling back to OpenAI...")
            ctr, engagement, conversion, roi_threshold = get_simulation_params_from_context(data.company_description, data.advertisement_goal)
        else:
            print("Using Hugging Face GPT-OSS-120B for parameter extraction...")
            ctr, engagement, conversion, roi_threshold = get_hf_simulation_params_from_context(data.company_description, data.advertisement_goal)
    else:
        print("Using OpenAI GPT-3.5-turbo for parameter extraction...")
        ctr, engagement, conversion, roi_threshold = get_simulation_params_from_context(data.company_description, data.advertisement_goal)
    
    print("ROI Threshold", roi_threshold, "CTR: ", ctr, "Engagement: ", engagement, "Conversion: ", conversion)

    # Step 2: Simulate 10,000 impressions using Monte Carlo simulation
    # It models how users progress through the funnel: Impression -> Click -> Land -> Engage -> Convert
    sim_result = run_market_fit_simulation(impressions=10000, ctr=ctr, engagement=engagement, conversion=conversion, roi_threshold=roi_threshold)

    print("Fitness Score", sim_result.roi_fit_score)

    # Step 3: Generate qualitative reasoning/suggestions based on simulation result
    # Use the same model choice as parameter extraction
    if data.use_hugging_face:
        if not HF_AVAILABLE:
            print("⚠️  Hugging Face requested but not available, falling back to OpenAI...")
            ai_reasoning = get_chatgpt_marketing_insight(sim_result, data.company_description, data.advertisement_goal)
        else:
            print("Using Hugging Face GPT-OSS-120B for insights generation...")
            ai_reasoning = get_hf_marketing_insight(sim_result, data.company_description, data.advertisement_goal)
    else:
        print("Using OpenAI GPT-3.5-turbo for insights generation...")
        ai_reasoning = get_chatgpt_marketing_insight(sim_result, data.company_description, data.advertisement_goal)
    print("AI Reasoning: ", ai_reasoning)
    
    response = SimulationResponse(
        user_journey_stats={
            "total_impressions": sim_result.total_impressions,
            "total_clicks": sim_result.total_clicks,
            "total_landings": sim_result.total_landings,
            "total_engagements": sim_result.total_engagements,
            "total_conversions": sim_result.total_conversions
        },
        roi_fit_score=sim_result.roi_fit_score,
        roi_fit_tag=sim_result.roi_fit_tag,
        recommendations=[ai_reasoning]
    )

    return response
