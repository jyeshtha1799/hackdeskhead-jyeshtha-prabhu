import { stocksData } from '@/data/stocksData'

export type OptionDetails = {
  price: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  bid: number;
  ask: number;
  lastPrice: number;
  change: number;
  percentChange: number;
}

type OptionType = 'call' | 'put';

export type OptionsData = {
  [symbol: string]: {
    [expiration: string]: {
      [strike: number]: {
        [optionType in OptionType]: OptionDetails;
      };
    };
  };
};

const generateOptionDetails = (): OptionDetails => ({
  price: Number((Math.random() * 10 + 5).toFixed(2)),
  delta: Number((Math.random() * 0.5 + 0.25).toFixed(2)),
  gamma: Number((Math.random() * 0.05).toFixed(3)),
  theta: Number((-Math.random() * 0.5).toFixed(2)),
  vega: Number((Math.random() * 0.5).toFixed(2)),
  volume: Math.floor(Math.random() * 1000) + 100,
  openInterest: Math.floor(Math.random() * 5000) + 1000,
  impliedVolatility: Number((Math.random() * 0.3 + 0.1).toFixed(2)),
  bid: Number((Math.random() * 9 + 5).toFixed(2)),
  ask: Number((Math.random() * 11 + 5).toFixed(2)),
  lastPrice: Number((Math.random() * 10 + 5).toFixed(2)),
  change: Number((Math.random() * 2 - 1).toFixed(2)),
  percentChange: Number((Math.random() * 20 - 10).toFixed(2)),
});

export const optionsData: OptionsData = stocksData.reduce((acc, stock) => {
  acc[stock.symbol] = {
    '2023-07-21': {},
    '2023-08-18': {},
    '2023-09-15': {},
    '2023-10-20': {},
    '2023-11-17': {},
  };

  [0.8, 0.9, 0.95, 1, 1.05, 1.1, 1.2].forEach(multiplier => {
    const strike = Math.round(stock.price * multiplier);
    Object.keys(acc[stock.symbol]).forEach(expiration => {
      acc[stock.symbol][expiration][strike] = {
        call: generateOptionDetails(),
        put: generateOptionDetails(),
      };
    });
  });

  return acc;
}, {} as OptionsData);

// Add this line at the end of the file to check the generated data
console.log('Generated optionsData:', JSON.stringify(optionsData, null, 2));