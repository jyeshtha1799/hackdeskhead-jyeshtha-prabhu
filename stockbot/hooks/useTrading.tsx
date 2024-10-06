import { useState, useCallback } from 'react'

export const useTrading = () => {
  const [isTrading, setIsTradingState] = useState(false)
  const [spread, setSpread] = useState([])

  const setIsTrading = useCallback((value) => {
    setIsTradingState(value)
  }, [])

  const addToSpread = useCallback((leg) => {
    setSpread((prevSpread) => [...prevSpread, leg])
  }, [])

  const removeFromSpread = useCallback((index) => {
    setSpread((prevSpread) => prevSpread.filter((_, i) => i !== index))
  }, [])

  const executeOrder = useCallback((spread) => {
    // Implement order execution logic here
    console.log('Executing order:', spread)
    setSpread([])
    setIsTrading(false)
  }, [])

  return {
    isTrading,
    setIsTrading,
    spread,
    addToSpread,
    removeFromSpread,
    executeOrder,
  }
}