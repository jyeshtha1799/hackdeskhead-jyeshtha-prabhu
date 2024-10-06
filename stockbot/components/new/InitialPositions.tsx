import { stocksData } from '@/data/stocksData'
import { optionsData } from '@/data/optionsData'

export interface Position {
  id: string
  name: string
  type: 'stock' | 'option'
  symbol: string
  quantity: number
  tradePrice: number
  fv: number
  delta?: number
  gamma?: number
  theta?: number
  vega?: number
  expiry?: string
  strike?: number
  optionType?: 'Call' | 'Put'
}

export interface Folder {
  id: string
  name: string
  items: (Folder | Position)[]
}

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const formatOptionName = (symbol: string, expiry: string, strike: number, optionType: string) => {
  const date = new Date(expiry);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${symbol} ${month}/${day} ${strike}${optionType[0]}`;
}

export const generateInitialPositions = (): Folder[] => {
  const sectors = ['Technology', 'Finance', 'Healthcare'];
  return sectors.map(sector => ({
    id: sector.toLowerCase(),
    name: sector,
    items: stocksData
      .filter(() => Math.random() > 0.5) // Randomly select some stocks
      .map(stock => {
        const stockPosition: Position = {
          id: `${stock.symbol}-stock`,
          name: stock.symbol,
          type: 'stock',
          symbol: stock.symbol,
          quantity: getRandomInt(50, 200),
          tradePrice: stock.price,
          fv: stock.price * 1.02,
          delta: 1,
          gamma: 0,
          theta: 0,
          vega: 0
        };

        const optionPositions: Position[] = Object.entries(optionsData[stock.symbol] || {})
          .filter(() => Math.random() > 0.7) // Randomly select some expirations
          .flatMap(([expiry, strikes]) => 
            Object.entries(strikes)
              .filter(() => Math.random() > 0.8) // Randomly select some strikes
              .flatMap(([strike, optionTypes]) => 
                Object.entries(optionTypes)
                  .filter(() => Math.random() > 0.5) // Randomly select call or put
                  .map(([optionType, optionData]) => ({
                    id: `${stock.symbol}-${expiry}-${strike}-${optionType}`,
                    name: formatOptionName(stock.symbol, expiry, Number(strike), optionType),
                    type: 'option',
                    symbol: stock.symbol,
                    quantity: getRandomInt(1, 10),
                    tradePrice: optionData.price,
                    fv: optionData.price * 1.05,
                    delta: optionData.delta,
                    gamma: optionData.gamma,
                    theta: optionData.theta,
                    vega: optionData.vega,
                    expiry,
                    strike: Number(strike),
                    optionType: optionType as 'Call' | 'Put'
                  }))
              )
          );

        return {
          id: stock.symbol,
          name: stock.symbol,
          items: [stockPosition, ...optionPositions]
        };
      })
  }));
};

export const initialPositions = generateInitialPositions();