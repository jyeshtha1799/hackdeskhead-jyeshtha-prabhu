'use client'

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface StockTableProps {
  stocks: Stock[];
  onSelectStock: (stock: { symbol: string; name: string; type: 'stock' }) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, onSelectStock }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Symbol</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Change</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {stocks.map((stock) => (
        <TableRow 
          key={stock.symbol} 
          className="cursor-pointer hover:bg-muted/50" 
          onClick={() => onSelectStock({ symbol: stock.symbol, name: stock.name, type: 'stock' })}
        >
          <TableCell>{stock.symbol}</TableCell>
          <TableCell>{stock.name}</TableCell>
          <TableCell>${stock.price.toFixed(2)}</TableCell>
          <TableCell className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>
            {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export default StockTable