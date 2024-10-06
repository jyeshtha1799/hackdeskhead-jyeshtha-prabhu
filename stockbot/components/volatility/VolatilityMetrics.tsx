'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface VolatilityMetricsProps {
  currentIV: number
  historicalVol: number
  ivPercentile: number
  ivRank: number
  vix: number
}

const VolatilityMetrics: React.FC<VolatilityMetricsProps> = ({
  currentIV,
  historicalVol,
  ivPercentile,
  ivRank,
  vix
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatility Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Current IV</TableCell>
              <TableCell>{currentIV.toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>30-Day HV</TableCell>
              <TableCell>{historicalVol.toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IV Percentile</TableCell>
              <TableCell>{ivPercentile}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IV Rank</TableCell>
              <TableCell>{ivRank}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>VIX</TableCell>
              <TableCell>{vix.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default VolatilityMetrics