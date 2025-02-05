'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTrading } from '@/hooks/useTrading'

const SpreadView = ({ onBack }) => {
  const { spread, removeFromSpread, executeOrder } = useTrading()

  const handleRemoveLeg = (index) => {
    removeFromSpread(index)
  }

  const handleExecuteOrder = () => {
    executeOrder(spread)
    onBack()
  }

  return (
    <div>
      <Button onClick={onBack} variant="ghost" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Trading
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Spread View</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Strike</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spread.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.symbol}</TableCell>
                  <TableCell>{item.type === 'stock' ? 'Stock' : `${item.optionType} Option`}</TableCell>
                  <TableCell>{item.strike || 'N/A'}</TableCell>
                  <TableCell>{item.expiry || 'N/A'}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveLeg(index)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button onClick={handleExecuteOrder}>Execute Order</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SpreadView