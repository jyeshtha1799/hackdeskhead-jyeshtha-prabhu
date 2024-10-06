'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OptionGreeksProps {
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
}

const OptionGreeks: React.FC<OptionGreeksProps> = ({
  delta,
  gamma,
  theta,
  vega,
  rho
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Option Greeks</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Greek</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Delta</TableCell>
              <TableCell>{delta.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gamma</TableCell>
              <TableCell>{gamma.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Theta</TableCell>
              <TableCell>{theta.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vega</TableCell>
              <TableCell>{vega.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rho</TableCell>
              <TableCell>{rho.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default OptionGreeks