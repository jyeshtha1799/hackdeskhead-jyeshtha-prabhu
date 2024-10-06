from dataclasses import dataclass
from typing import Optional

@dataclass
class OptionGreeks:
    delta: float
    gamma: float
    rho: float
    theta: float
    vega: float

@dataclass
class OptionDetails:
    underlying_symbol: str
    option_id: Optional[str] = None
    option_type: Optional[str] = None
    bid_price: Optional[float] = None
    ask_price: Optional[float] = None
    last_trade_price: Optional[float] = None
    strike_price: Optional[float] = None
    expiration_date: Optional[str] = None  # YYYY-MM-DD
    greeks: Optional[OptionGreeks] = None
    implied_volatility: Optional[float] = None