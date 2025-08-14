import json
import re
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from app.config import MODEL_NAME, HUGGING_FACE_TOKEN, DEVICE, MAX_LENGTH
from app.models.models import SimulationResult
import torch

_model = None
_tokenizer = None
_generator = None

def _initialize_hf_model():
    """Initialize the Hugging Face model and tokenizer (lazy loading)"""
    global _model, _tokenizer, _generator
    
    if _generator is None:
        print(f"Loading Hugging Face model: {MODEL_NAME}...")
        try:
            _generator = pipeline(
                "text-generation",
                model=MODEL_NAME,
                tokenizer=MODEL_NAME,
                device_map=DEVICE,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                token=HUGGING_FACE_TOKEN if HUGGING_FACE_TOKEN else None,
                trust_remote_code=True,
                max_length=MAX_LENGTH,
                do_sample=True,
                temperature=0.3,
                top_p=0.9,
                pad_token_id=50256
            )
            print(f"Hugging Face model {MODEL_NAME} loaded successfully!")
        except Exception as e:
            print(f"Error loading model {MODEL_NAME}: {e}")
            print("Falling back to GPT-2...")
            _generator = pipeline(
                "text-generation",
                model="gpt2",
                device_map="cpu",
                max_length=256,
                do_sample=True,
                temperature=0.3,
                top_p=0.9
            )
    
    return _generator

def _extract_json_from_response(text: str) -> dict:
    """Extract JSON from model response, handling various formats"""
    json_pattern = r'\{[^{}]*\}'
    matches = re.findall(json_pattern, text)
    
    for match in matches:
        try:
            return json.loads(match)
        except json.JSONDecodeError:
            continue
    
    return {
        "ctr": 0.015,
        "engagement": 0.5,
        "conversion": 0.1,
        "roi_threshold": 0.5
    }

def get_hf_simulation_params_from_context(company_description, advertisement_goal) -> tuple[float, float, float, float]:
    """Extract marketing campaign parameters using Hugging Face model (GPT-OSS-120B)"""
    generator = _initialize_hf_model()
    
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
    
    try:
        response = generator(
            prompt,
            max_length=len(prompt.split()) + 100,
            num_return_sequences=1,
            temperature=0.3,
            do_sample=True,
            pad_token_id=generator.tokenizer.eos_token_id
        )
        
        generated_text = response[0]['generated_text']
        new_content = generated_text[len(prompt):].strip()
        
        parsed = _extract_json_from_response(new_content)
        
        ctr = float(parsed.get("ctr", 0.015))
        engagement = float(parsed.get("engagement", 0.5))
        conversion = float(parsed.get("conversion", 0.1))
        roi_threshold = float(parsed.get("roi_threshold", 0.5))
        
        ctr = max(0.001, min(0.2, ctr))
        engagement = max(0.1, min(1.0, engagement))
        conversion = max(0.01, min(1.0, conversion))
        roi_threshold = max(0.01, min(1.0, roi_threshold))
        
    except Exception as e:
        print(f"Error generating parameters with Hugging Face: {e}")
        ctr, engagement, conversion, roi_threshold = 0.015, 0.5, 0.1, 0.5

    return ctr, engagement, conversion, roi_threshold

def get_hf_marketing_insight(simulation_data: SimulationResult, company_description, advertisement_goal) -> str:
    f"""
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
        response = generator(
            prompt,
            max_length=len(prompt.split()) + 150,
            num_return_sequences=1,
            temperature=0.4,
            do_sample=True,
            pad_token_id=generator.tokenizer.eos_token_id
        )
        
        generated_text = response[0]['generated_text']
        insight = generated_text[len(prompt):].strip()
        
        if len(insight) < 50:
            insight = _generate_hf_fallback_insight(simulation_data, ctr, conversion_rate)
            
        return insight
        
    except Exception as e:
        print(f"Error generating insights with Hugging Face: {e}")
        return _generate_hf_fallback_insight(simulation_data, ctr, conversion_rate)

def _generate_hf_fallback_insight(simulation_data: SimulationResult, ctr: float, conversion_rate: float) -> str:
    """Generate a structured fallback insight when the Hugging Face model fails"""
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

*Generated using Hugging Face GPT-OSS-120B*"""

def get_available_hf_models():
    """Return a list of recommended Hugging Face models for marketing analysis"""
    return [
        "microsoft/DialoGPT-large",
        "google/flan-t5-large", 
        "mistralai/Mistral-7B-Instruct-v0.1",
        "HuggingFaceH4/zephyr-7b-beta",
        "meta-llama/Llama-2-7b-chat-hf",
        "gpt-oss-120b"
    ]

def switch_hf_model(model_name: str):
    """Switch to a different Hugging Face model"""
    global _generator, MODEL_NAME
    _generator = None
    MODEL_NAME = model_name
    print(f"Switched to Hugging Face model: {model_name}")
    return _initialize_hf_model()
