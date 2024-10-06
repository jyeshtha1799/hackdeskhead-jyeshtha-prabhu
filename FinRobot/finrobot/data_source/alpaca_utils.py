from alpaca_api import AlpacaAPI
from datetime import datetime
from option_models import OptionDetails, OptionGreeks

class AlpacaUtils:
    def __init__(self):
        self.api = AlpacaAPI()

    def parse_options_string(self, option_string: str):
        """
        Parse the options string and return a dictionary with the 
        underlying symbol, option type (call or put), strike price, 
        and expiration date.

        Example:
        Input: "AAPL230714C00200000"
        Output: {
            "underlying_symbol": "AAPL", 
            "option_type": "call", 
            "strike_price": 200, 
            "expiration_date": "230714"
        }
        """
        symbol = ''
        for char in option_string:
            if char.isdigit():
                break
            symbol += char

        expiration_date = option_string[len(symbol):len(symbol)+6]
        expiration_date = datetime.strptime(expiration_date, "%y%m%d")
        option_type = option_string[len(symbol)+6]
        strike_price = float(option_string[len(symbol)+7:])
        strike_price /= 1000

        return {
            "underlying_symbol": symbol,
            "option_type": option_type,
            "strike_price": strike_price,
            "expiration_date": expiration_date.strftime("%Y-%m-%d")
        }

    def get_options_chain(self, underlying_symbol: str):
        data = {}
        options_chain_snapshots = self.api.get_options_chain(underlying_symbol)
        print(len(options_chain_snapshots))
        for option_id in options_chain_snapshots:
            # Parse the option id to get the underlying symbol, option type, strike price, and expiration date
            parsed_option_details = self.parse_options_string(option_id)

            # Get the latest quote and trade for the option
            latest_quote = options_chain_snapshots[option_id].get('latestQuote')
            latest_trade = options_chain_snapshots[option_id].get('latestTrade')
            bid_price = latest_quote['bp'] if latest_quote else None
            ask_price = latest_quote['ap'] if latest_quote else None
            latest_trade_price = latest_trade['p'] if latest_trade else None

            # Create an OptionDetails object
            option_details = OptionDetails(
                underlying_symbol=parsed_option_details['underlying_symbol'],
                option_id=option_id,
                option_type=parsed_option_details['option_type'],
                bid_price=bid_price,
                ask_price=ask_price,
                last_trade_price=latest_trade_price,
                strike_price=parsed_option_details['strike_price'],
                expiration_date=parsed_option_details['expiration_date'],
            )

            # Get the greeks for the option if they exist
            if options_chain_snapshots[option_id].get('greeks'):
                greeks = OptionGreeks(
                    delta=options_chain_snapshots[option_id]['greeks']['delta'],
                    gamma=options_chain_snapshots[option_id]['greeks']['gamma'],
                    rho=options_chain_snapshots[option_id]['greeks']['rho'],
                    theta=options_chain_snapshots[option_id]['greeks']['theta'],
                    vega=options_chain_snapshots[option_id]['greeks']['vega']
                )
                option_details.greeks = greeks
            
            # Get the implied volatility for the option if it exists
            if options_chain_snapshots[option_id].get('impliedVolatility'):
                option_details.implied_volatility = options_chain_snapshots[option_id]['impliedVolatility']
            
            # Add the option details to the data dictionary
            if option_details.expiration_date not in data:
                data[option_details.expiration_date] = {}
            if option_details.strike_price not in data[option_details.expiration_date]:
                data[option_details.expiration_date][option_details.strike_price] = {}
            if option_details.option_type not in data[option_details.expiration_date][option_details.strike_price]:
                data[option_details.expiration_date][option_details.strike_price][option_details.option_type] = None
            
            data[option_details.expiration_date][option_details.strike_price][option_details.option_type] = option_details

        return data
    
    def get_latest_quote(self, underlying_symbols: list[str]):
        latest_quotes = self.api.get_latest_quote(underlying_symbols)
        return latest_quotes