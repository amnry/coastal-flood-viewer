#!/usr/bin/env python3
"""
Quick test script to verify the backend GEE integration is working
"""

import requests
import json

# Test configuration
BACKEND_URL = "http://localhost:5000"
TEST_LOCATION = {
    "lat": 40.7128,  # New York City
    "lon": -74.0060,
    "year": "2020",
    "month": "06"
}

def test_health():
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health check passed: {data}")
            return True
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Cannot connect to backend: {e}")
        print(f"   Make sure the backend is running on {BACKEND_URL}")
        return False

def test_elevation():
    """Test the elevation endpoint"""
    print("\n🏔️  Testing elevation endpoint...")
    try:
        params = {
            "lat": TEST_LOCATION["lat"],
            "lon": TEST_LOCATION["lon"]
        }
        response = requests.get(f"{BACKEND_URL}/api/elevation", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Elevation data received:")
            print(f"      Location: ({data['lat']}, {data['lon']})")
            print(f"      Elevation: {data['elevation']} {data['unit']}")
            print(f"      Source: {data['source']}")
            
            # Verify it's not mock data (mock data is random 0-10)
            if data.get('source') == 'users/amanaryya1/coastal-dem-files':
                print(f"   ✅ Using real GEE data!")
                return True
            else:
                print(f"   ⚠️  Not using expected GEE source")
                return False
        else:
            print(f"   ❌ Elevation request failed: {response.status_code}")
            print(f"      {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Elevation test failed: {e}")
        return False

def test_sea_level():
    """Test the sea level endpoint"""
    print("\n🌊 Testing sea level endpoint...")
    try:
        params = {
            "lat": TEST_LOCATION["lat"],
            "lon": TEST_LOCATION["lon"],
            "year": TEST_LOCATION["year"],
            "month": TEST_LOCATION["month"]
        }
        response = requests.get(f"{BACKEND_URL}/api/sea-level", params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Sea level data received:")
            print(f"      Location: ({data['lat']}, {data['lon']})")
            print(f"      Year/Month: {data['year']}/{data['month']:02d}")
            print(f"      Sea Level: {data['seaLevel']} {data['unit']}")
            print(f"      Source: {data['source']}")
            return True
        else:
            print(f"   ❌ Sea level request failed: {response.status_code}")
            print(f"      {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Sea level test failed: {e}")
        return False

def test_timeseries():
    """Test the timeseries endpoint"""
    print("\n📈 Testing timeseries endpoint...")
    try:
        params = {
            "lat": TEST_LOCATION["lat"],
            "lon": TEST_LOCATION["lon"],
            "month": TEST_LOCATION["month"]
        }
        response = requests.get(f"{BACKEND_URL}/api/timeseries", params=params, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Time series data received:")
            print(f"      Location: {data['location']}")
            print(f"      Data points: {len(data['data'])}")
            print(f"      Variable: {data['variable']}")
            print(f"      Unit: {data['unit']}")
            print(f"      Sample data (first 3):")
            for point in data['data'][:3]:
                print(f"         {point['date']}: {point['value']} {data['unit']}")
            
            # Verify we have data from 1993-2022 (30 years)
            if len(data['data']) >= 25:
                print(f"   ✅ Time series has {len(data['data'])} data points (expected ~30)")
                return True
            else:
                print(f"   ⚠️  Expected ~30 data points, got {len(data['data'])}")
                return False
        else:
            print(f"   ❌ Time series request failed: {response.status_code}")
            print(f"      {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Time series test failed: {e}")
        return False

def test_point_analytics():
    """Test the point analytics endpoint"""
    print("\n📊 Testing point analytics endpoint...")
    try:
        params = {
            "lat": TEST_LOCATION["lat"],
            "lon": TEST_LOCATION["lon"],
            "year": TEST_LOCATION["year"],
            "month": TEST_LOCATION["month"]
        }
        response = requests.get(f"{BACKEND_URL}/api/point-analytics", params=params, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Point analytics received:")
            print(f"      Location: ({data['lat']}, {data['lon']})")
            print(f"      Elevation: {data['elevation']} m")
            print(f"      Sea Level: {data['seaLevel']} mm")
            print(f"      Time series points: {len(data['timeSeries']['data'])}")
            print(f"      Statistics:")
            print(f"         Mean: {data['stats']['mean']} mm")
            print(f"         Median: {data['stats']['median']} mm")
            print(f"         Min: {data['stats']['min']} mm")
            print(f"         Max: {data['stats']['max']} mm")
            print(f"      Data sources:")
            print(f"         DEM: {data['source']['dem']}")
            print(f"         SLA: {data['source']['sla']}")
            return True
        else:
            print(f"   ❌ Point analytics request failed: {response.status_code}")
            print(f"      {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Point analytics test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("   Coastal Flood Viewer Backend Integration Tests")
    print("=" * 60)
    print()
    
    results = {
        "Health Check": test_health(),
    }
    
    # Only run other tests if health check passes
    if results["Health Check"]:
        results["Elevation"] = test_elevation()
        results["Sea Level"] = test_sea_level()
        results["Time Series"] = test_timeseries()
        results["Point Analytics"] = test_point_analytics()
    
    # Summary
    print("\n" + "=" * 60)
    print("   Test Summary")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status}: {test_name}")
    
    print()
    
    total_tests = len(results)
    passed_tests = sum(results.values())
    
    if passed_tests == total_tests:
        print(f"🎉 All {total_tests} tests passed!")
        print("\n✅ Backend is working correctly with Google Earth Engine!")
        return 0
    else:
        print(f"⚠️  {passed_tests}/{total_tests} tests passed")
        print("\n❌ Some tests failed. Check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())

