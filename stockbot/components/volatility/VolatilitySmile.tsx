'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface VolatilitySmileProps {
  data: Array<{
    strike: number
    callIV: number
    putIV: number
  }>
}

const VolatilitySmile: React.FC<VolatilitySmileProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatility Smile</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="strike" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="callIV" stroke="#8884d8" name="Call IV" />
            <Line type="monotone" dataKey="putIV" stroke="#82ca9d" name="Put IV" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default VolatilitySmile