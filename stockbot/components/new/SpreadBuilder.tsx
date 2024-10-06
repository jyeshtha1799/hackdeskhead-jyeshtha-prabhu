import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Plus, Minus } from 'lucide-react'
import { GreekDisplay } from './GreekDisplay'

interface SpreadBuilderProps {
  onCancel: () => void
  onViewSpread: (spread: any[]) => void
  onExecuteOrder: (spread: any[], orderType: string, limitPrice: string) => void
  spread: any[]
  addToSpread: (instrument: any) => void
}

const SpreadBuilder: React.FC<SpreadBuilderProps> = (props) => {
  console.log('SpreadBuilder rendered with props:', props);
  const { onCancel, onViewSpread, onExecuteOrder, spread, addToSpread } = props;
  
  const [isBuyMode, setIsBuyMode] = useState(true)
  const [orderType, setOrderType] = useState('market')
  const [limitPrice, setLimitPrice] = useState('')

  const calculateNetGreeks = () => {
    return spread.reduce((acc, item) => ({
      delta: acc.delta + (item.delta || 0) * item.quantity,
      gamma: acc.gamma + (item.gamma || 0) * item.quantity,
      theta: acc.theta + (item.theta || 0) * item.quantity,
      vega: acc.vega + (item.vega || 0) * item.quantity,
      fv: acc.fv + (item.fv || 0) * item.quantity,
    }), { delta: 0, gamma: 0, theta: 0, vega: 0, fv: 0 })
  }

  const calculateNetTheoreticalValue = () => {
    return spread.reduce((acc, item) => acc + (item.fv || 0) * item.quantity, 0)
  }

  const netGreeks = calculateNetGreeks()
  const netTheoreticalValue = calculateNetTheoreticalValue()

  const handleQuantityChange = (index, change) => {
    const updatedSpread = [...spread];
    updatedSpread[index].quantity += change;
    if (updatedSpread[index].quantity === 0) {
      updatedSpread.splice(index, 1);
    }
    addToSpread(updatedSpread);
  };

  return (
    <div className="space-y-2 text-xs">
      <h3 className="text-sm font-semibold">Spread Builder</h3>
      <div className="flex items-center space-x-2 mb-2">
        <Toggle pressed={isBuyMode} onPressedChange={setIsBuyMode}>
          {isBuyMode ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </Toggle>
        <span>{isBuyMode ? 'Buy' : 'Sell'} Mode</span>
      </div>
      <div className="space-y-1">
        {spread.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{item.symbol} {item.type === 'option' ? `${item.optionType} ${item.strike} ${item.expiry}` : ''}</span>
            <div>
              <Button size="sm" onClick={() => handleQuantityChange(index, -1)}>-</Button>
              <span className="mx-1">{item.quantity}</span>
              <Button size="sm" onClick={() => handleQuantityChange(index, 1)}>+</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <p>Net Greeks:</p>
        <GreekDisplay greeks={netGreeks} />
        <p>Net Theoretical Value: ${netTheoreticalValue.toFixed(2)}</p>
      </div>
      <div className="space-y-1">
        <Select value={orderType} onValueChange={setOrderType}>
          <SelectTrigger>
            <SelectValue placeholder="Select order type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market Order</SelectItem>
            <SelectItem value="limit">Limit Order</SelectItem>
          </SelectContent>
        </Select>
        {orderType === 'limit' && (
          <Input
            type="number"
            placeholder="Limit Price"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
          />
        )}
      </div>
      <div className="flex space-x-1">
        <Button size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={() => onViewSpread(spread)}>View Spread</Button>
        <Button size="sm" onClick={() => onExecuteOrder(spread, orderType, limitPrice)}>Execute Order</Button>
      </div>
    </div>
  )
}

export default SpreadBuilder