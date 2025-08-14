"""Marketing Strategist Backend API Tests"""

import requests
import json
import pytest

BASE_URL = "http://localhost:8000"
SIMULATE_ENDPOINT = f"{BASE_URL}/simulate"

@pytest.fixture
def test_data():
    return {
        "company_description": "A fast-growing SaaS startup that provides project management tools for remote teams. We target small to medium businesses with 10-100 employees.",
        "advertisement_goal": "Increase free trial signups for our project management platform"
    }

def test_server_health():
    """Test if the server is running and accessible"""
    response = requests.get(f"{BASE_URL}/docs")
    assert response.status_code == 200, f"Server not accessible, status: {response.status_code}"
    print("✅ Server is running and accessible")

def test_openai_api(test_data):
    """Test OpenAI integration (default behavior)"""
    print("\n🧪 Testing OpenAI API Integration...")
    
    response = requests.post(
        SIMULATE_ENDPOINT,
        json=test_data,
        headers={"Content-Type": "application/json"},
        timeout=60
    )
    
    assert response.status_code == 200, f"OpenAI API failed with status: {response.status_code}, Response: {response.text}"
    
    result = response.json()
    assert "roi_fit_score" in result, "Response missing roi_fit_score"
    assert "roi_fit_tag" in result, "Response missing roi_fit_tag"
    assert "recommendations" in result, "Response missing recommendations"
    assert len(result["recommendations"]) > 0, "No recommendations generated"
    
    print("✅ OpenAI API test successful!")
    print(f"   ROI Fit Score: {result.get('roi_fit_score', 'N/A')}%")
    print(f"   Market Fit: {result.get('roi_fit_tag', 'N/A')}")
    print(f"   Recommendations: {len(result.get('recommendations', []))} insights generated")

def test_huggingface_api(test_data):
    """Test Hugging Face integration"""
    print("\n🤗 Testing Hugging Face API Integration...")
    
    hf_test_data = test_data.copy()
    hf_test_data["use_hugging_face"] = True
    
    response = requests.post(
        SIMULATE_ENDPOINT,
        json=hf_test_data,
        headers={"Content-Type": "application/json"},
        timeout=60
    )
    
    assert response.status_code == 200, f"Hugging Face API failed with status: {response.status_code}, Response: {response.text}"
    
    result = response.json()
    assert "roi_fit_score" in result, "Response missing roi_fit_score"
    assert "roi_fit_tag" in result, "Response missing roi_fit_tag"
    assert "recommendations" in result, "Response missing recommendations"
    assert len(result["recommendations"]) > 0, "No recommendations generated"
    
    print("✅ Hugging Face API test successful!")
    print(f"   ROI Fit Score: {result.get('roi_fit_score', 'N/A')}%")
    print(f"   Market Fit: {result.get('roi_fit_tag', 'N/A')}")
    print(f"   Recommendations: {len(result.get('recommendations', []))} insights generated")

def test_api_schema():
    """Test API schema and documentation"""
    print("\n📋 Testing API Schema...")
    
    response = requests.get(f"{BASE_URL}/openapi.json")
    assert response.status_code == 200, f"API schema not accessible, status: {response.status_code}"
    
    schema = response.json()
    assert "info" in schema, "Schema missing info section"
    assert "paths" in schema, "Schema missing paths section"
    
    print("✅ API schema accessible")
    print(f"   API Title: {schema.get('info', {}).get('title', 'N/A')}")
    print(f"   Available endpoints: {len(schema.get('paths', {}))}")

if __name__ == "__main__":
    print("🎯 Marketing Strategist Backend API Tests")
    print("=" * 50)
    print("Run with: pytest -s test/test_apis.py -v")
    print("Or: python -m pytest test/test_apis.py -s -v")