// DeskheadMarketOverview.tsx
'use client'

import React from 'react'
import StockTable from '@/components/new/StockTable'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useNavigationLogic } from '@/hooks/useNavigationLogic';

interface DeskheadMarketOverviewProps {
  watchlistStocks: any[];
  onSelectInstrument: (instrument: { symbol: string; name: string; type: 'stock' }) => void;
}

const DeskheadMarketOverview: React.FC<DeskheadMarketOverviewProps> = ({ 
  watchlistStocks,
  onSelectInstrument
}) => {
  const handleStockSelection = (stock: { symbol: string; name: string; type: 'stock' }) => {
    console.log('DeskheadMarketOverview - Selected stock:', stock);
    console.log('DeskheadMarketOverview - Parameter name:', 'stock');
    onSelectInstrument(stock);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
      <StockTable stocks={watchlistStocks} onSelectStock={handleStockSelection} />
    </div>
  )
}

export default DeskheadMarketOverview
