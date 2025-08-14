import numpy as np
from app.models.models import SimulationResult

def run_market_fit_simulation(impressions: int, ctr: float, engagement: float, conversion: float, roi_threshold:float) -> SimulationResult:

    # Simulate individual click probabilities per impression using normal distribution
    ctr_array = np.clip(np.random.normal(loc=ctr, scale=0.01, size=impressions), 0, 1)

    # Simulate landing success probability (after click), fixed around 70%
    land_rate = np.clip(np.random.normal(loc=0.7, scale=0.05, size=impressions), 0, 1)

    # Simulate probability of engaging with the landing content
    engage_rate = np.clip(np.random.normal(loc=engagement, scale=0.1, size=impressions), 0, 1)
    
    # Simulate probability of converting (final action: signup/purchase)
    convert_rate = np.clip(np.random.normal(loc=conversion, scale=0.02, size=impressions), 0, 1)

    # Run Bernoulli trial for each impression: 1 = click, 0 = no click
    clicks = np.random.binomial(n=1, p=ctr_array)

    # Only clicked users can proceed to landing stage -> multiply by clicks
    landings = clicks * np.random.binomial(n=1, p=land_rate)

    # Only landed users can engage -> multiply by landings
    engagements = landings * np.random.binomial(n=1, p=engage_rate)

    # Only engaged users can convert -> multiply by engagements
    conversions = engagements * np.random.binomial(n=1, p=convert_rate)

    # Compute the final conversion rate across all impressions
    journey_probability = conversions.sum() / impressions


    return SimulationResult(
    total_impressions=impressions,
    total_clicks=int(clicks.sum()),
    total_landings=int(landings.sum()),
    total_engagements=int(engagements.sum()),
    total_conversions=int(conversions.sum()),
    roi_fit_score=round(journey_probability * 100, 2),
    roi_fit_tag=tag_roi_fit(journey_probability * 100, roi_threshold)
)

def tag_roi_fit(roi_score: float, roi_threshold: float) -> str:
    if roi_score >= roi_threshold:
        return "High market fit"
    else:
        return "Low market fit"