// RiskManagerMarketOverview.tsx
'use client'

import React from 'react'
import StockTable from '@/components/new/StockTable'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useNavigationLogic } from '@/hooks/useNavigationLogic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskManagerMarketOverviewProps {
  watchlistStocks: any[];
  onSelectInstrument: (instrument: { symbol: string; name: string; type: 'stock' }) => void;
  accountValue?: number;
  pnlPercentage?: number;
}

const RiskManagerMarketOverview: React.FC<RiskManagerMarketOverviewProps> = ({ 
  watchlistStocks,
  onSelectInstrument,
  accountValue = 0,
  pnlPercentage = 0
}) => {
  const handleStockSelection = (stock: { symbol: string; name: string; type: 'stock' }) => {
    console.log('RiskManagerMarketOverview - Selected stock:', stock);
    console.log('RiskManagerMarketOverview - Parameter name:', 'stock');
    onSelectInstrument(stock);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Risk Manager Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Account Value</p>
              <p className="text-2xl">${accountValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">P&L</p>
              <p className={`text-2xl ${pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </p>
            </div>
            {/* Add more risk metrics here */}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
        <StockTable stocks={watchlistStocks} onSelectStock={handleStockSelection} />
      </div>
    </div>
  )
}

export default RiskManagerMarketOverview
