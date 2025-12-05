import requests
import sys

BASE_URL = "http://127.0.0.1:5000"

def test_api():
    # 1. Login
    print("Testing Login...")
    login_payload = {"hmc": "37100655", "password": "admin123#"}
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        response.raise_for_status()
        data = response.json()
        token = data['access_token']
        print("Login Successful. Token received.")
    except Exception as e:
        print(f"Login Failed: {e}")
        print(response.text)
        sys.exit(1)

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Demand
    print("\nTesting Create Demand...")
    demand_payload = {
        "titulo": "Teste Refactor Service",
        "problema": "Verificando se o service layer funciona",
        "processo": "TI",
        "equipamento": "Servidor",
        "gut": 5
    }
    try:
        response = requests.post(f"{BASE_URL}/demands", json=demand_payload, headers=headers)
        response.raise_for_status()
        demand = response.json()
        print(f"Demand Created: ID {demand.get('id')}")
    except Exception as e:
        print(f"Create Demand Failed: {e}")
        print(response.text)
        sys.exit(1)

    # 3. List Demands
    print("\nTesting List Demands (Pagination)...")
    try:
        response = requests.get(f"{BASE_URL}/demands?page=1&per_page=5", headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Verify new pagination structure
        if 'demands' in data and 'total' in data and 'pages' in data:
            print(f"List Demands Successful. Total: {data['total']}")
            print(f"Items returned: {len(data['demands'])}")
        else:
            print("List Demands Failed: Unexpected response structure")
            print(data)
            sys.exit(1)
            
    except Exception as e:
        print(f"List Demands Failed: {e}")
        print(response.text)
        sys.exit(1)

if __name__ == "__main__":
    test_api()
