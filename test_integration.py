#!/usr/bin/env python3
"""
Test script to verify the integration of DEM and SLA data
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def test_backend_integration():
    """Test the backend integration"""
    try:
        from backend.app import get_dem, get_sla_image_m, get_month_collection
        
        print("Testing DEM integration...")
        dem = get_dem()
        print(f"✅ DEM loaded: {type(dem)}")
        
        print("Testing SLA integration...")
        sla = get_sla_image_m('2020', '01')
        print(f"✅ SLA loaded: {type(sla)}")
        
        print("Testing month collection...")
        col, years = get_month_collection('01')
        print(f"✅ Month collection loaded: {len(years)} years")
        
        print("\n🎉 All backend integrations working!")
        return True
        
    except Exception as e:
        print(f"❌ Backend integration failed: {e}")
        return False

def test_data_paths():
    """Test that data paths exist"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data_pipeline', 'jiayou_sat_data', 'monthly_raw')
    
    if os.path.exists(data_dir):
        files = os.listdir(data_dir)
        nc_files = [f for f in files if f.endswith('.nc')]
        print(f"✅ Found {len(nc_files)} NetCDF files in data directory")
        return True
    else:
        print(f"❌ Data directory not found: {data_dir}")
        return False

if __name__ == "__main__":
    print("🧪 Testing CoastalFloodViewer Integration")
    print("=" * 50)
    
    # Test data paths
    print("\n1. Testing data paths...")
    test_data_paths()
    
    # Test backend integration
    print("\n2. Testing backend integration...")
    test_backend_integration()
    
    print("\n" + "=" * 50)
    print("✅ Integration test completed!")
