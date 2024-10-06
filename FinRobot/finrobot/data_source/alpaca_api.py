import os
import requests

class AlpacaAPI:
    def __init__(self):
        self.api_key = os.getenv("ALPACA_API_KEY")
        self.secret_key = os.getenv("ALPACA_SECRET_KEY")
        self.base_url = "https://data.alpaca.markets/"
        self.headers = {
            "APCA-API-KEY-ID": self.api_key,
            "APCA-API-SECRET-KEY": self.secret_key,
            "accept": "application/json"
        }

    def get_options_chain(self, underlying_symbol: str):
        endpoint = f"/v1beta1/options/snapshots/{underlying_symbol}"
        url = f"{self.base_url}{endpoint}"
        params = {
            "feed": "indicative",
            "limit": 1000
        }
        response = requests.get(url, headers=self.headers, params=params)
        snapshots = {}
        i = 1
        while response.status_code == 200:
            print(f"Page {i}")
            if response.json().get('snapshots'):
                snapshots = {**snapshots, **response.json()['snapshots']}
            if response.json().get('next_page_token'):
                params['page_token'] = response.json()['next_page_token']
            else:
                break
            response = requests.get(url, headers=self.headers, params=params)
            i += 1
        return snapshots
    
    def get_latest_quote(self, underlying_symbols: list[str]):
        endpoint = f"/v2/stocks/quotes/latest"
        url = f"{self.base_url}{endpoint}"
        params = {
            "symbols": ",".join(underlying_symbols),
            "feed": "iex"
        }
        response = requests.get(url, headers=self.headers, params=params)
        if response.status_code == 200:
            return response.json().get('quotes')
        return {}