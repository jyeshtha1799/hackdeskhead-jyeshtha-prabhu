'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { optionsData, OptionDetails } from '@/data/optionsData'
import { useTrading } from '@/hooks/useTrading'

const ResearcherSingleOptionOverview = ({ symbol, expiration, strike, optionType, theoreticalValues, role }: {
  symbol: string;
  expiration: string;
  strike: number;
  optionType: 'call' | 'put';
  theoreticalValues: any; // Placeholder for theoretical data
  role: string; // Add this line
}) => {
  const { isTrading, addToSpread } = useTrading()

  console.log('SingleOptionView props:', { symbol, expiration, strike, optionType });

  if (!symbol || !expiration || typeof strike !== 'number' || !optionType) {
    console.error('Missing or invalid required props:', { symbol, expiration, strike, optionType });
    return <div>Error: Missing or invalid required option data</div>;
  }

  if (!optionsData[symbol]) {
    console.error(`No data found for symbol: ${symbol}`);
    return <div>No data available for this symbol: {symbol}</div>;
  }

  console.log('Available expirations for symbol:', Object.keys(optionsData[symbol]));

  if (!optionsData[symbol][expiration]) {
    console.error(`No data found for expiration: ${expiration}`);
    return <div>No data available for this expiration date: {expiration}</div>;
  }

  console.log('Available strikes for expiration:', Object.keys(optionsData[symbol][expiration]));

  if (!optionsData[symbol][expiration][strike]) {
    console.error(`No data found for strike: ${strike}`);
    return <div>No data available for this strike price: {strike}</div>;
  }

  const option = optionsData[symbol][expiration][strike][optionType];

  if (!option) {
    console.error(`Option not found:`, { symbol, expiration, strike, optionType });
    return <div>Option not found for {symbol} {optionType} {strike} - Expiration: {expiration}</div>;
  }

  const handleTrade = (event) => {
    if (isTrading) {
      const quantity = event.type === 'click' ? 1 : -1
      addToSpread({
        symbol,
        type: 'option',
        strike,
        optionType,
        expiration,
        quantity,
        price: option.price
      })
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} {optionType} {strike} - Expiration: {expiration}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Price</p>
              <p>Price: ${option?.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-semibold">Volume</p>
              <p>{option.volume}</p>
            </div>
            <div>
              <p className="font-semibold">Open Interest</p>
              <p>{option.openInterest}</p>
            </div>
            {role !== 'Junior Trader' && (
              <>
                <div>
                  <p className="font-semibold">Delta</p>
                  <p>{option.delta.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Gamma</p>
                  <p>{option.gamma.toFixed(3)}</p>
                </div>
                <div>
                  <p className="font-semibold">Theta</p>
                  <p>{option.theta.toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-semibold">Vega</p>
                  <p>{option.vega.toFixed(2)}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {isTrading && (
        <div className="mt-4">
          <Button onClick={handleTrade} onContextMenu={handleTrade}>
            {isTrading ? 'Add to Spread' : 'Trade'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default ResearcherSingleOptionOverview