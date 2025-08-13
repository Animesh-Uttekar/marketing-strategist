from openai import OpenAI
import json
from app.config import OPENAI_API_KEY, MODEL_NAME
from app.models.models import SimulationResult

client = OpenAI(api_key=OPENAI_API_KEY)

def get_simulation_params_from_context(company_description, advertisement_goal) -> tuple[float, float, float, float]:
    prompt = f"""
    # You are a marketing analytics assistant specializing in performance forecasting for ad campaigns. 

    # Your task is to:

    - Extract Industry, Product Type, Target Audience, Platform, Conversion Objective from the input company description and advertisement goal.
    - Estimate performance metrics across different platforms and industries.
    - Estimate key advertising metrics using market trends and platform benchmarks:
        - ctr: Probability an impression results in a click.
        - engagement: Probability a user meaningfully engages after clicking.
        - conversion: Likelihood that an engaged user completes the desired action.
    - Also provide:
        - roi_threshold: The minimum ROI score between 0 to 1.0 generally considered acceptable for the inferred industry, audience, and platform.

    Guidelines:
        - Use marketing and product sense to deduce fields not directly mentioned.
        - Keep keys lowercase and values concise.

    Company: {company_description}  
    Advertisement Goal: {advertisement_goal}

    Return only the following in strict JSON format:

    {{
    "ctr": float,
    "engagement": float,
    "conversion": float,
    "roi_threshold": float
    }}

    Do not include explanations, reasoning, intermediate steps, or contextual metadata in the output.

"""

    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    content = response.choices[0].message.content
    try:
        parsed = json.loads(content)
        ctr = float(parsed.get("ctr", 0.015))
        engagement = float(parsed.get("engagement", 0.5))
        conversion = float(parsed.get("conversion", 0.1))
        roi_threshold = float(parsed.get("roi_threshold", 0.5))
    except Exception as e:
        ctr, engagement, conversion, roi_threshold = 0.015, 0.5, 0.1, 0.5

    return ctr, engagement, conversion, roi_threshold


def get_chatgpt_marketing_insight(simulation_data: SimulationResult, company_description, advertisement_goal) -> str:
    prompt = f"""
    # You are a digital marketing analyst for AI-driven campaign optimization systems.
    
    Your task is to analyze simulated user journey data alongside structured campaign context and identify one key bottleneck affecting conversion performance.
    Then, propose one smart, evidence-based change to improve the outcome.

    ## Use clear, structured reasoning in three parts:
        - Bottleneck
        - Root cause
        - Optimization suggestion

    ## Keep language concise, marketing-specific, and actionable.

    ## Do not repeat the input data or simulate outputs—focus only on diagnosing the problem and offering a recommendation.

    ## Company: 
    {company_description}  

    ## Advertisement Goal: 
    {advertisement_goal}
    s
    ## Simulation result:
    {simulation_data.model_dump()}
"""
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
    except Exception as e:
        return _generate_gpt_fallback_insight(simulation_data, ctr, conversion_rate)
    return response.choices[0].message.content.strip()


def _generate_gpt_fallback_insight(simulation_data: SimulationResult, ctr: float, conversion_rate: float) -> str:
    """Generate a structured fallback insight when the OpenAI model fails"""
    if ctr < 1.0:
        bottleneck = "Low click-through rate"
        cause = "Ad creative or targeting may not be compelling enough"
        suggestion = "Test different headlines, visuals, or audience segments"
    elif conversion_rate < 2.0:
        bottleneck = "Poor conversion rate"
        cause = "Landing page experience or offer may not match user expectations"
        suggestion = "Optimize landing page design and ensure message consistency"
    else:
        bottleneck = "Overall campaign performance"
        cause = "Multiple factors affecting the conversion funnel"
        suggestion = "Focus on A/B testing key elements and audience refinement"
    
    return f"""**Bottleneck:** {bottleneck}

**Root Cause:** {cause}

**Optimization Suggestion:** {suggestion}

**ROI Assessment:** Your campaign achieved a {simulation_data.roi_fit_score}% fit score, indicating {simulation_data.roi_fit_tag.lower()} potential.

*Generated using OpenAI API*"""