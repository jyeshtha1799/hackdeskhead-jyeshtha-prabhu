import { useState, useEffect } from 'react';
import { stocksData } from '@/data/stocksData';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    // Load watchlist from localStorage or API
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    } else {
      // Default watchlist
      const defaultWatchlist = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB'];
      setWatchlist(defaultWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(defaultWatchlist));
    }
  }, []);

  const addToWatchlist = (symbol: string) => {
    setWatchlist(prev => {
      const newWatchlist = [...new Set([...prev, symbol])];
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => {
      const newWatchlist = prev.filter(s => s !== symbol);
      localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const watchlistStocks = watchlist.map(symbol => 
    stocksData.find(stock => stock.symbol === symbol)
  ).filter(Boolean);

  return { watchlist, addToWatchlist, removeFromWatchlist, watchlistStocks };
};