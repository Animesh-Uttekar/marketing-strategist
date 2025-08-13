# AI-Powered Marketing Campaign Simulator

This project is an AI-enhanced marketing analytics tool that simulates user journeys for digital ad campaigns, evaluates market fit, and provides strategic insights to optimize conversions.

Built using **OpenAI’s GPT models**, **FastAPI**, and **NumPy**, the system helps marketers and founders understand **click-through behavior**, **engagement patterns**, and **conversion bottlenecks** based on product and campaign context.

---

## Features

### AI-Driven Parameter Estimation
Automatically extract key simulation parameters from your:
- **Company description**
- **Advertisement goal**

Parameters generated:
- `ctr`: Click-through rate
- `engagement`: Engagement rate post-click
- `conversion`: Final conversion rate
- `roi_threshold`: Minimum ROI score expected for your vertical

Powered by OpenAI via:
```python
get_simulation_params_from_context(company_description, advertisement_goal)
```

---

### Monte Carlo Simulation Engine

Simulates thousands of user journeys across a funnel:
1. **Impressions**
2. **Clicks**
3. **Landing page success**
4. **Engagement**
5. **Conversion**

Includes randomness using realistic Gaussian noise for:
- Click-through probability
- Engagement levels
- Conversion likelihood

Implemented in:
```python
run_market_fit_simulation(impressions, ctr, engagement, conversion, roi_threshold)
```

Returns a structured object of type `SimulationResult`:
```json
{
  "total_impressions": 10000,
  "total_clicks": 620,
  "total_landings": 430,
  "total_engagements": 250,
  "total_conversions": 41,
  "roi_fit_score": 0.41,
  "roi_fit_tag": "Low market fit"
}
```

---

## What is Monte Carlo Simulation?

Monte Carlo simulation is a computational technique that uses **random sampling and probability distributions** to estimate the outcome of uncertain processes.

In this project, it's used to model **realistic ad performance outcomes** at each stage of a digital marketing funnel:
- Not every user clicks -> click-through is random
- Not every click results in engagement -> landing success and content quality vary
- Not every engaged user converts -> influenced by product appeal, urgency, UX

Each simulation run:
- Generates thousands of virtual users (impressions)
- Samples from normal distributions around expected rates (CTR, engagement, conversion)
- Propagates results stage by stage like a funnel
- Gives an estimate of ROI fitness using actual behavior paths

This gives a **probabilistic, nuanced view of campaign performance** far better than static metrics.

### Insight Generator (LLM-Based)

After simulating performance, the system:
- Diagnoses one **key bottleneck**
- Explains the **root cause**
- Recommends a **smart optimization**

Using:
```python
get_chatgpt_marketing_insight(simulation_data, company_description, advertisement_goal)
```

The insight is returned in a concise, actionable format using GPT's reasoning abilities.


---

## Requirements

- Python 3.10+
- `openai`
- `numpy`
- `pydantic`

Install dependencies:

```bash
pip install -r requirements.txt
```

Set up `.env` with:

```
OPENAI_API_KEY=sk-xxx
MODEL_NAME=gpt-4-1106-preview  # or gpt-5 if available
```

---

## Example Usage

```python
from app.core.simulator import run_market_fit_simulation
from app.core.llm_utils import get_simulation_params_from_context, get_chatgpt_marketing_insight

company = "A startup offering AI-powered virtual fitness coaching for remote workers."
goal = "Promote a 7-day free trial for premium coaching using Instagram and YouTube."

# Step 1: Estimate metrics
ctr, engagement, conversion, roi_threshold = get_simulation_params_from_context(company, goal)

# Step 2: Run simulation
result = run_market_fit_simulation(impressions=10000, ctr=ctr, engagement=engagement, conversion=conversion, roi_threshold=roi_threshold)

# Step 3: Get insight
insight = get_chatgpt_marketing_insight(result, company, goal)

print(result)
print(insight)
```

---

## Sample Output

```python
SimulationResult(
    total_impressions=10000,
    total_clicks=540,
    total_landings=372,
    total_engagements=265,
    total_conversions=44,
    roi_fit_score=0.44,
    roi_fit_tag='Low market fit'
)

Insight:
- Bottleneck: Engagement-to-conversion drop
- Root cause: Trial offer lacks urgency or value signal for remote workers
- Optimization suggestion: Add time-limited incentive (e.g. "Join by Friday & get bonus AI trainer session")
```

---

## Notes

- LLM output is probabilistic - use `temperature=0.3` for controlled variance.
- You can switch to `gpt-5` or `gpt-4-turbo` by updating `MODEL_NAME`.
