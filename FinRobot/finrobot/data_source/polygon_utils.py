import os
import requests
from datetime import datetime, time, timedelta
import pytz
import logging
from typing import List, Dict
from polygon_api import Polygon
from ..utils import decorate_all_methods

from functools import wraps

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('[%(asctime)s] %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


def init_polygon_api(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        global polygon_api_key
        global api
        if os.environ.get("POLYGON_API_KEY") is None:
            print("Please set the environment variable POLYGON_API_KEY to use the POLYGON API.")
            return None
        else:
            polygon_api_key = os.environ["POLYGON_API_KEY"]
            api = Polygon(token=polygon_api_key)
            print("POLYGON api key found successfully.")
            return func(*args, **kwargs)

    return wrapper

@decorate_all_methods(init_polygon_api)
class PolygonUtils:
    """A utility class to interact with the Polygon.io API for various financial data retrieval and analysis."""

    def get_current_price(self, stock_ticker: str) -> float:
        """
        Get the current price of a stock.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            float: The current price of the stock.
        """
        logger.info(f"Fetching current price for {stock_ticker}")
        last_trade_data = api.get_last_trade(stock_ticker=stock_ticker)
        current_price = last_trade_data['results']['p']
        logger.info(f"Current price for {stock_ticker}: {current_price}")
        return current_price
    
    def get_trading_volume(self, stock_ticker: str) -> int:
        """
        Get the trading volume for a stock.

        If queried before market open, returns the previous day's trading volume.
        If queried during market hours, returns the current day's trading volume so far.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            int: The trading volume for the stock.
        """
        logger.info(f"Fetching trading volume for {stock_ticker}")
        # Set timezone to Eastern Time (ET) for US market
        et_tz = pytz.timezone('America/New_York')
        now = datetime.now(et_tz)
        
        # Define market hours
        market_open = time(9, 30)
        market_close = time(16, 0)

        market_open_time = now.replace(hour=market_open.hour, minute=market_open.minute, second=0, microsecond=0)

        # If current time is before market open, get previous day's trading volume
        if now.time() < market_open_time.time():
            yesterdays_open_close_data = api.get_previous_open_close(stock_ticker=stock_ticker)
            assert yesterdays_open_close_data['resultsCount'] == 1, "Unexpected results count for previous open/close data."
            trading_volume = yesterdays_open_close_data['results'][0]['v']
            logger.info(f"Trading volume for {stock_ticker} (yesterday): {trading_volume}")
            return trading_volume

        # If current time is during or after market hours
        end_time = min(now, now.replace(hour=market_close.hour, minute=market_close.minute, second=0, microsecond=0))
        
        # Convert to millisecond timestamps
        start_timestamp_ms = int(market_open_time.timestamp() * 1000)
        end_timestamp_ms = int(end_time.timestamp() * 1000)

        aggregate_data = api.get_aggregates_bars(
            stock_ticker,
            1,
            "day",
            start_timestamp_ms=start_timestamp_ms,
            end_timestamp_ms=end_timestamp_ms
        )
        assert aggregate_data['resultsCount'] == 1, "Unexpected results count for aggregate bars data."
        trading_volume = aggregate_data['results'][0]['v']
        logger.info(f"Trading volume for {stock_ticker} (today so far): {trading_volume}")
        return trading_volume

    def get_market_open_price(self, stock_ticker: str) -> float:
        """
        Get the market open price for a stock.

        If queried before market open, returns the previous day's open price.
        If queried during market hours, returns the current day's open price.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            float: The market open price for the stock.
        """
        logger.info(f"Fetching market open price for {stock_ticker}")
        # Set timezone to Eastern Time (ET) for US market
        et_tz = pytz.timezone('America/New_York')
        now = datetime.now(et_tz)
        
        # Define market hours
        market_open = time(9, 30)
        market_close = time(16, 0)

        market_open_time = now.replace(hour=market_open.hour, minute=market_open.minute, second=0, microsecond=0)

        # If current time is before market open, return previous day's open price
        if now.time() < market_open_time.time():
            yesterdays_open_close_data = api.get_previous_open_close(stock_ticker=stock_ticker)
            assert yesterdays_open_close_data['resultsCount'] == 1, "Unexpected results count for previous open/close data."
            market_open_price = yesterdays_open_close_data['results'][0]['o']
            logger.info(f"Market open price for {stock_ticker} (yesterday): {market_open_price}")
            return market_open_price

        # If current time is during or after market hours
        end_time = min(now, now.replace(hour=market_close.hour, minute=market_close.minute, second=0, microsecond=0))
        
        # Convert to millisecond timestamps
        start_timestamp_ms = int(market_open_time.timestamp() * 1000)
        end_timestamp_ms = int(end_time.timestamp() * 1000)

        aggregate_data = api.get_aggregates_bars(
            stock_ticker,
            1,
            "day",
            start_timestamp_ms=start_timestamp_ms,
            end_timestamp_ms=end_timestamp_ms
        )
        assert aggregate_data['resultsCount'] == 1, "Unexpected results count for aggregate bars data."
        market_open_price = aggregate_data['results'][0]['o']
        logger.info(f"Market open price for {stock_ticker} (today): {market_open_price}")
        return market_open_price

    def get_52_week_high_low(self, stock_ticker: str) -> Dict[str, float]:
        """
        Get the 52-week high and low prices for a stock.

        This function retrieves the highest high and lowest low prices
        for the given stock over the past 52 weeks.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            dict: A dictionary containing the following keys:
                - fifty_two_week_high (float): The highest price in the last 52 weeks.
                - fifty_two_week_low (float): The lowest price in the last 52 weeks.
        """
        logger.info(f"Fetching 52-week high and low for {stock_ticker}")
        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(weeks=52)  # 52 weeks

        # Convert to millisecond timestamps
        end_timestamp_ms = int(end_date.timestamp() * 1000)
        start_timestamp_ms = int(start_date.timestamp() * 1000)

        # Fetch aggregate data for the past year
        aggregate_data = api.get_aggregates_bars(
            stock_ticker, 
            1, 
            "day", 
            start_timestamp_ms=start_timestamp_ms, 
            end_timestamp_ms=end_timestamp_ms
        )

        if aggregate_data['resultsCount'] == 0:
            error_msg = f"No data available for {stock_ticker} in the past 52 weeks"
            logger.error(error_msg)
            raise ValueError(error_msg)

        # Initialize high and low with the first day's data
        fifty_two_week_high = aggregate_data['results'][0]['h']
        fifty_two_week_low = aggregate_data['results'][0]['l']

        # Iterate through all days to find the highest high and lowest low
        for day in aggregate_data['results']:
            fifty_two_week_high = max(fifty_two_week_high, day['h'])
            fifty_two_week_low = min(fifty_two_week_low, day['l'])

        logger.info(f"52-week high for {stock_ticker}: {fifty_two_week_high}")
        logger.info(f"52-week low for {stock_ticker}: {fifty_two_week_low}")
        return {
            "fifty_two_week_high": fifty_two_week_high,
            "fifty_two_week_low": fifty_two_week_low
        }

    def get_market_data(self, stock_ticker: str) -> Dict[str, float]:
        """
        Get comprehensive market data for a stock.

        This function retrieves the current price, trading volume, market open price,
        calculates the price change percentage, and gets the 52-week high/low for the given stock.

        Args:
            stock_ticker (str): The stock symbol to query.

        Returns:
            dict: A dictionary containing the following keys:
                - current_price (float): The current price of the stock.
                - trading_volume (int): The trading volume for the stock.
                - current_market_open (float): The market open price for the stock.
                - price_change_percentage (float): The percentage change in price since market open.
                - fifty_two_week_high (float): The highest price in the last 52 weeks.
                - fifty_two_week_low (float): The lowest price in the last 52 weeks.
        """
        logger.info(f"Fetching comprehensive market data for {stock_ticker}")
        current_price = self.get_current_price(stock_ticker=stock_ticker)
        todays_trading_volume = self.get_trading_volume(stock_ticker=stock_ticker)
        todays_market_open_price = self.get_market_open_price(stock_ticker=stock_ticker)
        price_change_percentage = ((current_price - todays_market_open_price) / todays_market_open_price) * 100
        fifty_two_week_data = self.get_52_week_high_low(stock_ticker=stock_ticker)

        market_data = {
            "current_price": current_price,
            "trading_volume": todays_trading_volume,
            "current_market_open": todays_market_open_price,
            "price_change_percentage": price_change_percentage,
            "fifty_two_week_high": fifty_two_week_data["fifty_two_week_high"],
            "fifty_two_week_low": fifty_two_week_data["fifty_two_week_low"],
        }

        logger.info(f"Market data for {stock_ticker}: {market_data}")
        return market_data

    def get_options_metrics(self, stock_ticker: str) -> Dict[str, List[Dict[str, str]]]:
        return {}

    def compare_option_prices(self, stock_ticker: str) -> Dict[str, List[Dict[str, str]]]:
        return {}


if __name__ == "__main__":
    # Example usage
    polygon_api_key = os.getenv('POLYGON_API_KEY', 'DESKHEAD_POLYGON_API_KEY')
    stock_symbol = "AAPL"

    polygon_utils = PolygonUtils(token=polygon_api_key)

    # Fetch current market data
    try:
        market_data = polygon_utils.get_market_data(stock_symbol)
        print(f"Market Data for {stock_symbol}: {market_data}")
    except Exception as e:
        logger.error(f"Failed to fetch market data: {e}")