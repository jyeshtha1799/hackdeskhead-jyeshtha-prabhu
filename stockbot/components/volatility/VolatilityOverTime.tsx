'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface VolatilityOverTimeProps {
  data: Array<{
    date: string
    impliedVol: number
    historicalVol: number
    vix: number
  }>
}

const VolatilityOverTime: React.FC<VolatilityOverTimeProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatility Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="impliedVol" stroke="#8884d8" name="Implied Volatility" />
            <Line type="monotone" dataKey="historicalVol" stroke="#82ca9d" name="Historical Volatility" />
            <Line type="monotone" dataKey="vix" stroke="#ffc658" name="VIX" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default VolatilityOverTime