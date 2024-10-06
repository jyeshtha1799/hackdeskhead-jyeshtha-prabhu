import { stocksData } from './stocksData';
import { optionsData } from './optionsData';

export interface TheoreticalValues {
    cleanStrikeVolatilities: Array<{ strike: number; volatility: number }>;
    eventVolatilities: Array<{ date: string; volatility: number }>;
    forwardRates: Array<{ date: string; rate: number }>;
    futureDividends: Array<{ date: string; dividend: number }>;
  }
  
  export interface StockTheoreticalValues {
    [symbol: string]: TheoreticalValues;
  }
  
  export const theoreticalValues: StockTheoreticalValues = stocksData.reduce((acc, stock) => {
    const optionExpirations = Object.keys(optionsData[stock.symbol]).slice(0, 3);
    const strikes = Object.keys(optionsData[stock.symbol][optionExpirations[0]]).map(Number);

    acc[stock.symbol] = {
      cleanStrikeVolatilities: strikes.map(strike => ({
        strike,
        volatility: Number((Math.random() * 10 + 20).toFixed(2)),
      })),
      eventVolatilities: optionExpirations.map(date => ({
        date,
        volatility: Number((Math.random() * 15 + 25).toFixed(2)),
      })),
      forwardRates: optionExpirations.map(date => ({
        date,
        rate: Number((Math.random() * 0.5 + 1).toFixed(2)),
      })),
      futureDividends: optionExpirations.map(date => ({
        date,
        dividend: Number((Math.random() * 2).toFixed(2)),
      })),
    };

    return acc;
  }, {} as StockTheoreticalValues);

  // Add this line at the end of the file to check the generated data
  console.log('Generated theoreticalValues:', JSON.stringify(theoreticalValues, null, 2));