'use client'

import React from 'react'
import CleanStrikeVolatilities from '../volatility/CleanStrikeVolatilities'
import EventVolatilities from '../volatility/EventVolatilities'
import ForwardRates from '../volatility/ForwardRates'
import FutureDividends from '../volatility/FutureDividends'
import StockTable from '@/components/new/StockTable'
import StockDetail from '@/components/new/StockDetail'
import ExpirationView from '@/components/new/ExpirationView'
import SingleOptionView from '@/components/new/SingleOptionView'
import VolatilityDashboard from '@/components/new/VolatilityDashboard'
import { TheoreticalValues, StockTheoreticalValues } from '@/data/theoreticalValues'

interface JuniorTraderViewProps {
  selectedStock: string
  selectedExpiration: string
  selectedOption: {
    strike: number
    optionType: string
  }
  stocksData: Array<{ symbol: string; data: any }>
  handleSelectInstrument: (symbol: string) => void
  handleSelectExpiration: (symbol: string, expiration: string) => void
  handleSelectOption: (symbol: string, strike: number, optionType: string, expiration: string) => void
  navigateBack: () => void
  theoreticalValues: StockTheoreticalValues
}

const JuniorTraderView: React.FC<JuniorTraderViewProps> = ({
  selectedStock,
  selectedExpiration,
  selectedOption,
  stocksData,
  handleSelectInstrument,
  handleSelectExpiration,
  handleSelectOption,
  navigateBack,
  theoreticalValues
}) => {
  const renderContent = () => {
    if (selectedStock && selectedExpiration && selectedOption) {
      return (
        <>
          <SingleOptionView
            symbol={selectedStock}
            expiration={selectedExpiration}
            strike={selectedOption.strike}
            optionType={selectedOption.optionType}
            role="Junior Trader"
          />
          <VolatilityDashboard
            symbol={selectedStock}
            expiration={selectedExpiration}
            strike={selectedOption.strike}
            optionType={selectedOption.optionType}
          />
        </>
      )
    } else if (selectedStock && selectedExpiration) {
      return (
        <ExpirationView
          symbol={selectedStock}
          expiration={selectedExpiration}
          onSelectOption={(strike, optionType) => handleSelectOption(selectedStock, strike, optionType, selectedExpiration)}
          role="Junior Trader"
        />
      )
    } else if (selectedStock) {
      const stockTheoreticalData = theoreticalValues[selectedStock] || {} as TheoreticalValues;
      return (
        <div>
          <button onClick={navigateBack} className="mb-4 text-blue-500 hover:underline">
            &larr; Back to Market Overview
          </button>
          <h2 className="text-2xl font-bold mb-4">{selectedStock}</h2>
          <div className="grid grid-cols-2 gap-4">
            <CleanStrikeVolatilities data={stockTheoreticalData.cleanStrikeVolatilities || []} />
            <ForwardRates data={stockTheoreticalData.forwardRates || []} />
            <EventVolatilities data={stockTheoreticalData.eventVolatilities || []} />
            <FutureDividends data={stockTheoreticalData.futureDividends || []} />
          </div>
          <StockDetail
            stock={stocksData.find(s => s.symbol === selectedStock)}
            onSelectExpiration={handleSelectExpiration}
            onSelectOption={(strike, optionType, expiration) => handleSelectOption(selectedStock, strike, optionType, expiration)}
            navigateBack={navigateBack}
            theoreticalValues={stockTheoreticalData}
            view="JuniorTrader"
          />
        </div>
      )
    } else {
      return (
        <>
          <h2 className="text-2xl font-bold mb-4">Market Overview (Junior Trader View)</h2>
          <StockTable stocks={stocksData} onSelectStock={handleSelectInstrument} />
        </>
      )
    }
  }

  return (
    <div className="junior-trader-view">
      {renderContent()}
    </div>
  )
}

export default JuniorTraderView