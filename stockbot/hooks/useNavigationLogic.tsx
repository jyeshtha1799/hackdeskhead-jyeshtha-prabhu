import { useState, useCallback, useMemo } from 'react';
import { stocksData } from '@/data/stocksData';
import { optionsData } from '@/data/optionsData';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
}

interface Option {
  strike: number;
  optionType: 'call' | 'put';
  price: number;
  impliedVolatility: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

interface OptionsChain {
  [expiration: string]: {
    [strike: number]: {
      call: Option;
      put: Option;
    };
  };
}

export const useNavigationLogic = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedExpiration, setSelectedExpiration] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ strike: number; optionType: 'call' | 'put' } | null>(null);

  const currentStock = useMemo(() => 
    selectedStock ? stocksData.find(s => s.symbol === selectedStock) : null
  , [selectedStock]);

  const currentOptions = useMemo(() => 
    selectedStock ? optionsData[selectedStock] : null
  , [selectedStock]);

  const currentExpirationOptions = useMemo(() => 
    currentOptions && selectedExpiration ? currentOptions[selectedExpiration] : null
  , [currentOptions, selectedExpiration]);

  const currentOptionDetails = useMemo(() => {
    if (currentExpirationOptions && selectedOption) {
      return currentExpirationOptions[selectedOption.strike][selectedOption.optionType];
    }
    return null;
  }, [currentExpirationOptions, selectedOption]);

  const handleSelectInstrument = useCallback((item: { type: 'stock' | 'option'; symbol: string; expiry?: string; strike?: number; optionType?: 'call' | 'put' }) => {
    console.log('useNavigationLogic - Selected instrument:', item);
    console.log('useNavigationLogic - Parameter name:', 'item');
    if (item.type === 'stock') {
      setSelectedStock(item.symbol);
      console.log('useNavigationLogic - Updated selectedStock:', item.symbol);
      setSelectedExpiration(null);
      setSelectedOption(null);
    } else if (item.type === 'option') {
      setSelectedStock(item.symbol);
      setSelectedExpiration(item.expiry || null);
      setSelectedOption(item.strike && item.optionType ? { strike: item.strike, optionType: item.optionType } : null);
    }
  }, []);

  const handleSelectExpiration = useCallback((expiration: string) => {
    setSelectedExpiration(expiration);
    setSelectedOption(null);
  }, []);

  const handleSelectOption = useCallback((strike: number, optionType: 'call' | 'put', expiration: string) => {
    console.log('useNavigationLogic - handleSelectOption:', { strike, optionType, expiration });
    setSelectedStock(selectedStock); // Ensure the stock remains selected
    setSelectedExpiration(expiration);
    setSelectedOption({ strike, optionType });
  }, [selectedStock]);

  const navigateBack = useCallback(() => {
    if (selectedOption) {
      setSelectedOption(null);
    } else if (selectedExpiration) {
      setSelectedExpiration(null);
    } else if (selectedStock) {
      setSelectedStock(null);
    }
  }, [selectedOption, selectedExpiration, selectedStock]);

  const getCurrentView = useCallback(() => {
    console.log('getCurrentView - selectedStock:', selectedStock);
    console.log('getCurrentView - selectedExpiration:', selectedExpiration);
    console.log('getCurrentView - selectedOption:', selectedOption);

    if (!selectedStock) return 'MarketOverview';
    if (!selectedExpiration) return 'StockOverview';
    if (!selectedOption) return 'ExpirationOverview';
    return 'SingleOptionOverview';
  }, [selectedStock, selectedExpiration, selectedOption]);

  return {
    selectedStock,
    setSelectedStock,
    selectedExpiration,
    setSelectedExpiration,
    selectedOption,
    setSelectedOption,
    currentStock,
    currentOptions,
    currentExpirationOptions,
    currentOptionDetails,
    handleSelectInstrument,
    handleSelectExpiration,
    handleSelectOption,
    navigateBack,
    getCurrentView,
  };
};