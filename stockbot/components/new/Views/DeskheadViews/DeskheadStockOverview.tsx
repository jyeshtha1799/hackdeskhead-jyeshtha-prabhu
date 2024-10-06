'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { stocksData } from '@/data/stocksData'
import { optionsData } from '@/data/optionsData'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SymbolOverview } from "react-ts-tradingview-widgets"
import { useTrading } from '@/hooks/useTrading'
import { TheoreticalValues } from '@/data/theoreticalValues'

const OptionsTable = ({ data, onSelectExpiration, onSelectOption }) => {
  const expirations = Object.keys(data)
  const strikes = Object.keys(data[expirations[0]]).map(Number).sort((a, b) => a - b)

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 bg-background">Strike</TableHead>
            {expirations.map(exp => (
              <React.Fragment key={exp}>
                <TableHead
                  className="sticky top-0 bg-background text-center cursor-pointer hover:bg-muted/50"
                  colSpan={2}
                  onClick={() => onSelectExpiration(exp)}
                >
                  {exp}
                </TableHead>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            <TableHead className="sticky top-8 bg-background"></TableHead>
            {expirations.map(exp => (
              <React.Fragment key={exp}>
                <TableHead className="sticky top-8 bg-background text-center">Call</TableHead>
                <TableHead className="sticky top-8 bg-background text-center">Put</TableHead>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {strikes.map(strike => (
            <TableRow key={strike}>
              <TableCell>{strike}</TableCell>
              {expirations.map(exp => (
                <React.Fragment key={exp}>
                  <TableCell
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectOption(Number(strike), 'call', exp)}
                  >
                    {data[exp][strike].call.price.toFixed(2)}
                  </TableCell>
                  <TableCell
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectOption(Number(strike), 'put', exp)}
                  >
                    {data[exp][strike].put.price.toFixed(2)}
                  </TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

interface StockDetailProps {
  stock: any;
  onSelectExpiration: (expiration: string) => void;
  onSelectOption: (strike: number, optionType: string, expiration: string) => void;
  navigateBack: () => void;
  theoreticalValues: TheoreticalValues;
  view?: 'JuniorTrader' | 'Default';
}

const DeskheadStockOverview: React.FC<StockDetailProps> = ({ 
  stock, 
  onSelectExpiration, 
  onSelectOption, 
  navigateBack,
  theoreticalValues,
  view = 'Default'
}) => {
  const { isTrading, setIsTrading, addToSpread } = useTrading()

  console.log('DeskheadStockOverview - Received stock:', stock);

  if (!stock) {
    console.log('DeskheadStockOverview - Stock not found');
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Stock Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sorry, we couldn't find the details for this stock.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const options = optionsData[stock.symbol]

  const handleOptionClick = (strike, optionType, expiration) => {
    if (isTrading) {
      addToSpread({
        symbol: stock.symbol,
        type: 'option',
        strike,
        optionType,
        expiration,
        quantity: 1,
        price: options[expiration][strike][optionType].price
      })
    } else {
      onSelectOption(strike, optionType, expiration)
    }
  }

  const handleExpirationClick = (expiration) => {
    onSelectExpiration(expiration);
  }

  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    setShowChart(true);
  }, []);

  const renderContent = () => (
    <>
      <div className={`h-[400px] w-full mb-4 ${view === 'JuniorTrader' ? 'order-last' : ''}`}>
        {showChart && (
          <SymbolOverview
            colorTheme="dark"
            autosize
            chartType="candlesticks"
            downColor="#800080"
            borderDownColor="#800080"
            wickDownColor="#800080"
            symbols={[[stock.symbol, stock.symbol]]}
          />
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Options Chain</h3>
        {options ? (
          <OptionsTable
            data={options}
            onSelectExpiration={handleExpirationClick}
            onSelectOption={handleOptionClick}
          />
        ) : (
          <p>No options data available for this stock.</p>
        )}
      </div>
      <Button onClick={() => setIsTrading(!isTrading)} className="mb-4">
        {isTrading ? 'Cancel Trading' : 'Trade'}
      </Button>
    </>
  )

  console.log('DeskheadStockOverview - Displaying information for stock:', stock.symbol);

  return (
    <div className="relative h-full">
      <Card>
        <CardHeader>
          <CardTitle>{stock.symbol} - {stock.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  )
}

export default DeskheadStockOverview