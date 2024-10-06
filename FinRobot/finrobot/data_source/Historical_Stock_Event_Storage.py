import pymongo
from typing import List, Dict, Any
from datetime import datetime
import yfinance as yf

class HistoricalStockEventStorage:
    def __init__(self, connection_string: str = "mongodb://localhost:27017/", db_name: str = "stock_events"):
        self.client = pymongo.MongoClient(connection_string)
        self.db = self.client[db_name]
        self.collection = self.db["historical_events"]
        
        # Create indexes for faster querying
        self.collection.create_index([("ticker", pymongo.ASCENDING)])
        self.collection.create_index([("event_date", pymongo.ASCENDING)])
        self.collection.create_index([("event_type", pymongo.ASCENDING)])

    def populate_historical_events(self, ticker: str, start_date: str, end_date: str):
        stock = yf.Ticker(ticker)
        
        # Fetch historical data
        hist = stock.history(start=start_date, end=end_date)

        # Fetch earnings dates
        earnings_dates = stock.earnings_dates

        # Fetch stock splits
        splits = stock.splits

        # Fetch dividends
        dividends = stock.dividends

        # Add price movements
        for date, row in hist.iterrows():
            price_change = ((row['Close'] - row['Open']) / row['Open']) * 100
            if abs(price_change) > 5:  # Significant price movement
                self.add_event(ticker, date.strftime('%Y-%m-%d'), 'price_movement', {
                    'open': float(row['Open']),
                    'close': float(row['Close']),
                    'high': float(row['High']),
                    'low': float(row['Low']),
                    'volume': int(row['Volume']),
                    'price_change': float(price_change)
                })

        # Add earnings events
        for date, row in earnings_dates.iterrows():
            self.add_event(ticker, date.strftime('%Y-%m-%d'), 'earnings', {
                'reported_eps': float(row['Reported EPS']) if pd.notnull(row['Reported EPS']) else None,
                'estimated_eps': float(row['Estimated EPS']) if pd.notnull(row['Estimated EPS']) else None
            })

        # Add stock splits
        for date, value in splits.items():
            self.add_event(ticker, date.strftime('%Y-%m-%d'), 'stock_split', {
                'split_ratio': float(value)
            })

        # Add dividends
        for date, value in dividends.items():
            self.add_event(ticker, date.strftime('%Y-%m-%d'), 'dividend', {
                'amount': float(value)
            })

    def add_event(self, ticker: str, event_date: str, event_type: str, event_details: Dict[str, Any]):
        event = {
            "ticker": ticker,
            "event_date": datetime.strptime(event_date, "%Y-%m-%d"),
            "event_type": event_type,
            "event_details": event_details
        }
        self.collection.insert_one(event)

    def get_events(self, ticker: str, start_date: str = None, end_date: str = None, event_type: str = None) -> List[Dict[str, Any]]:
        query = {"ticker": ticker}
        
        if start_date or end_date:
            query["event_date"] = {}
            if start_date:
                query["event_date"]["$gte"] = datetime.strptime(start_date, "%Y-%m-%d")
            if end_date:
                query["event_date"]["$lte"] = datetime.strptime(end_date, "%Y-%m-%d")
        
        if event_type:
            query["event_type"] = event_type

        events = list(self.collection.find(query))
        
        # Convert ObjectId to string for JSON serialization
        for event in events:
            event['_id'] = str(event['_id'])
            event['event_date'] = event['event_date'].strftime('%Y-%m-%d')

        return events

    def close(self):
        self.client.close()


    def get_yearly_patterns(self, ticker: str, event_type: str) -> Dict[int, List[Dict[str, Any]]]:
        """
        Retrieve historical patterns of a specific event type on a yearly basis.
        Returns a dictionary where keys are years, and values are lists of events.
        """
        cursor = self.conn.cursor()
        query = "SELECT * FROM historical_stock_events WHERE ticker = ? AND event_type = ?"
        cursor.execute(query, (ticker, event_type))
        rows = cursor.fetchall()

        # Group events by year
        yearly_patterns = {}
        for row in rows:
            event_date = datetime.strptime(row[2], '%Y-%m-%d')
            year = event_date.year
            event_details = json.loads(row[4])

            if year not in yearly_patterns:
                yearly_patterns[year] = []
            yearly_patterns[year].append({
                'id': row[0],
                'date': event_date,
                'event_type': row[3],
                'event_details': event_details
            })
        return yearly_patterns

    def predict_next_event(self, ticker: str, event_type: str) -> Dict[str, Any]:
        """
        Predict the impact of the next recurring event based on historical patterns.
        """
        yearly_patterns = self.get_yearly_patterns(ticker, event_type)
        
        # Example: Average price change calculation
        price_changes = []
        for year, events in yearly_patterns.items():
            for event in events:
                if 'price_change' in event['event_details']:
                    price_changes.append(event['event_details']['price_change'])

        if not price_changes:
            return {"message": "Not enough data to predict."}

        # Predict future price change (simple average here, use advanced models for better results)
        predicted_change = sum(price_changes) / len(price_changes)
        return {"predicted_price_change": predicted_change, "historical_changes": price_changes}

# Usage example:
# storage = HistoricalStockEventStorage()
# storage.populate_historical_events('AAPL', '2020-01-01', '2023-12-31')
# events = storage.get_events('AAPL', start_date='2023-01-01', event_type='earnings')
# storage.close()