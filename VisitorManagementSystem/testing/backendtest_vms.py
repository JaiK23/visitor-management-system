import requests
import json
from datetime import datetime, timedelta

# Update this URL to your Netlify or Localhost address
'''Frontend deploy URL'''
#BASE_URL = "https://vms102363.netlify.app/api" 
'''Backend deploy URL'''
BASE_URL = "https://visitor-management-system-2lhf.onrender.com/api";

def test_full_visitor_lifecycle():
    print("--- Starting System Testing ---")
    
    # 1. TEST REGISTRATION (Appendix D)
    visitor_data = {
        "name": "Javed Test",
        "phone": "9876543210",
        "email": "javed@example.com",
        "aadharNumber": "998877665544",
        "purpose": "Maintenance",
        "hostName": "Dr. Priyanka Maan",
        "hostPhone": "1234567890"
    }
    
    reg_res = requests.post(f"{BASE_URL}/visitors/register", json=visitor_data)
    assert reg_res.status_code == 201
    qr_data = reg_res.json()['visitor']['qrCode']
    print(f"PASS: Registration successful for {visitor_data['name']}")

    # 2. TEST CHECK-IN (Appendix E)
    checkin_res = requests.post(f"{BASE_URL}/checkin", json={"qrCode": qr_data})
    assert checkin_res.status_code == 200
    assert checkin_res.json()['visitor']['isInside'] is True
    print("PASS: Check-In verified (isInside = True)")

    # 3. TEST CHECK-OUT WITH RETURN TIME (Appendix F)
    # Setting return time to 2 hours from now
    return_time = (datetime.now() + timedelta(hours=2)).isoformat()
    
    checkout_res = requests.post(f"{BASE_URL}/checkout", json={
        "qrCode": qr_data,
        "expectedReturnTime": return_time
    })
    
    assert checkout_res.status_code == 200
    assert checkout_res.json()['visitor']['isInside'] is False
    assert checkout_res.json()['visitor']['hasReturnConsent'] is True
    print("PASS: Check-Out verified with Return Consent")

    # 4. TEST STATS UPDATE (Appendix G)
    stats_res = requests.get(f"{BASE_URL}/stats")
    assert stats_res.status_code == 200
    print("PASS: Dashboard stats retrieved successfully")
    print("--- All Tests Passed ---")

if __name__ == "__main__":
    try:
        test_full_visitor_lifecycle()
    except Exception as e:
        print(f"FAIL: Test error - {e}")