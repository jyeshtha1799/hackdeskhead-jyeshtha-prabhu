import pandas as pd
from typing import List, Dict
from datetime import datetime, timedelta
from .finnhub_utils import FinnHubUtils
from .yfinance_utils import YFinanceUtils
from .reddit_utils import RedditUtils

class ContextualStockAnalysis:
    def __init__(self, ticker: str):
        self.ticker = ticker
        self.context_profile = {
            'news_sentiment': [],
            'past_events': [],
            'price_sensitivity': {}
        }

    def update_news_sentiment(self, days: int = 30):
        end_date = datetime.now().strftime('%Y-%m-%d')
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        # Fetch news from FinnHub
        news = FinnHubUtils.get_company_news(self.ticker, start_date, end_date)
        
        # Fetch Reddit posts
        reddit_posts = RedditUtils.get_reddit_posts(f"{self.ticker} OR {YFinanceUtils.get_stock_info(self.ticker)['longName']}", start_date, end_date)
        
        # Combine news and Reddit posts
        all_content = pd.concat([news, reddit_posts])
        
        # TODO: Implement sentiment analysis on all_content
        # For now, we'll use a dummy sentiment score
        sentiment_score = len(all_content) / 100  # Dummy calculation
        
        self.context_profile['news_sentiment'].append({
            'date': end_date,
            'score': sentiment_score
        })

    def record_event(self, event_type: str, event_date: str, price_change: float):
        self.context_profile['past_events'].append({
            'type': event_type,
            'date': event_date,
            'price_change': price_change
        })

    def analyze_price_sensitivity(self, event_type: str):
        relevant_events = [event for event in self.context_profile['past_events'] if event['type'] == event_type]
        if relevant_events:
            avg_price_change = sum(event['price_change'] for event in relevant_events) / len(relevant_events)
            self.context_profile['price_sensitivity'][event_type] = avg_price_change

    def get_stock_context(self) -> Dict:
        return self.context_profile

    def set_price_alert(self, event_type: str, threshold: float):
        if event_type in self.context_profile['price_sensitivity']:
            expected_change = self.context_profile['price_sensitivity'][event_type]
            if abs(expected_change) > threshold:
                return f"Alert set for {event_type}. Expected price change: {expected_change:.2f}%"
        return f"No alert set for {event_type}. Insufficient data."

    def run_analysis(self):
        self.update_news_sentiment()
        for event_type in set(event['type'] for event in self.context_profile['past_events']):
            self.analyze_price_sensitivity(event_type)

# Usage example:
# analyzer = ContextualStockAnalysis('AAPL')
# analyzer.record_event('CEO Change', '2023-06-01', -2.5)
# analyzer.record_event('Product Launch', '2023-07-15', 3.2)
# analyzer.run_analysis()
# context = analyzer.get_stock_context()
# alert = analyzer.set_price_alert('CEO Change', 2.0)