'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useContext } from 'react'
import { TradingContext } from '@/contexts/TradingContext'
import { useTrading } from '@/hooks/useTrading'

// Import optionsData
import { optionsData } from '@/data/optionsData'

// Define formatNumber function
const formatNumber = (num: number | undefined) => {
  if (num === undefined) return 'N/A'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k'
  return num.toFixed(2)
}

const ExpirationView = ({ symbol, expiration, onSelectOption, role }) => {
  const { isTrading, addToSpread } = useTrading()

  console.log('Symbol:', symbol);
  console.log('Expiration:', expiration);
  console.log('Available symbols:', Object.keys(optionsData));
  console.log('Full optionsData:', optionsData);

  if (!symbol) {
    console.error('Symbol is undefined');
    return <div>No symbol selected. Please select a stock first.</div>;
  }

  if (!optionsData[symbol]) {
    console.error(`No data found for symbol: ${symbol}`);
    console.log('Available symbols in optionsData:', Object.keys(optionsData));
    return <div>No data available for this symbol: {symbol}</div>;
  }

  console.log('Available expirations:', Object.keys(optionsData[symbol]));

  if (!optionsData[symbol][expiration]) {
    console.error(`No data found for expiration: ${expiration}`);
    console.log('Available expirations for this symbol:', Object.keys(optionsData[symbol]));
    return <div>No data available for this expiration date: {expiration}</div>;
  }

  const options = optionsData[symbol][expiration];
  const strikes = Object.keys(options).map(Number).sort((a, b) => a - b);

  const handleSelectOption = (strike, optionType) => {
    console.log('ExpirationView handleSelectOption:', { symbol, expiration, strike: Number(strike), optionType });
    onSelectOption(Number(strike), optionType);
  }

  const handleOptionClick = (strike, optionType, event) => {
    if (isTrading) {
      const quantity = event.type === 'click' ? 1 : -1
      addToSpread({
        symbol,
        type: 'option',
        strike,
        optionType,
        expiration,
        quantity,
        price: options[strike][optionType].price
      })
    } else {
      onSelectOption(strike, optionType)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{symbol} Options - Expiration: {expiration}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 bg-background">Strike</TableHead>
                  <TableHead className="sticky top-0 bg-background">Call Price</TableHead>
                  <TableHead className="sticky top-0 bg-background">Put Price</TableHead>
                  {role === 'Risk Manager' && (
                    <>
                      <TableHead className="sticky top-0 bg-background">Call Delta</TableHead>
                      <TableHead className="sticky top-0 bg-background">Put Delta</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {strikes.map((strike) => (
                  <TableRow key={strike}>
                    <TableCell>{strike}</TableCell>
                    <TableCell 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={(e) => handleOptionClick(strike, 'call', e)}
                      onContextMenu={(e) => { e.preventDefault(); handleOptionClick(strike, 'call', e); }}
                    >
                      ${formatNumber(options[strike].call.price)}
                    </TableCell>
                    <TableCell 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={(e) => handleOptionClick(strike, 'put', e)}
                      onContextMenu={(e) => { e.preventDefault(); handleOptionClick(strike, 'put', e); }}
                    >
                      ${formatNumber(options[strike].put.price)}
                    </TableCell>
                    {role === 'Risk Manager' && (
                      <>
                        <TableCell>{formatNumber(options[strike].call.delta)}</TableCell>
                        <TableCell>{formatNumber(options[strike].put.delta)}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpirationView