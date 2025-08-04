from fastapi import FastAPI
from app.models.models import SimulationRequest, SimulationResponse
from app.simulator.simulator import run_market_fit_simulation
from app.utils.gpt_utils import get_chatgpt_marketing_insight, get_simulation_params_from_context

app = FastAPI(title="AI Marketing Agent")

@app.post("/simulate", response_model=SimulationResponse)
def simulate(data: SimulationRequest):

    # Step 1: Extract campaign performance probabilities and ROI threshold based on the inputs.
    # This currently uses an LLM (GPT-3.5-turbo) to infer realistic ctr, engagement, conversion rates and roi threshold.
    # In future this can be replaced with a RAG setup once we have a domain-specific knowledge base or with static benchmark logic (industry-specific conversion rates)
    ctr, engagement, conversion, roi_threshold = get_simulation_params_from_context(data.company_description, data.advertisement_goal)
    
    print("ROI Threshold", roi_threshold, "CTR: ", ctr, "Engagement: ", engagement, "Conversion: ", conversion)

    # Step 2: Simulate 10,000 impressions using Monte Carlo simulation
    # It models how users progress through the funnel: Impression -> Click -> Land -> Engage -> Convert
    sim_result = run_market_fit_simulation(impressions=10000, ctr=ctr, engagement=engagement, conversion=conversion, roi_threshold=roi_threshold)

    print("Fitness Score", sim_result.roi_fit_score)

    # Step 3: Optionally use LLM to generate qualitative reasoning/suggestions based on simulation result
    gpt_reasoning = get_chatgpt_marketing_insight(sim_result, data.company_description, data.advertisement_goal)
    print("GPT Reasoning: ", gpt_reasoning)
    
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
        recommendations=[gpt_reasoning]
    )

    return response
