'use client'

import React from 'react'
import VolatilityOverTime from '../volatility/VolatilityOverTime'
import VolatilitySmile from '../volatility/VolatilitySmile'
import VolatilityMetrics from '../volatility/VolatilityMetrics'
import OptionGreeks from '../volatility/OptionGreeks'

interface VolatilityDashboardProps {
  components?: Array<'VolatilityOverTime' | 'VolatilitySmile' | 'VolatilityMetrics' | 'OptionGreeks'>
  data?: {
    volOverTime: Array<{ date: string; impliedVol: number; historicalVol: number; vix: number }>
    volSmile: Array<{ strike: number; callIV: number; putIV: number }>
    volMetrics: {
      currentIV: number
      historicalVol: number
      ivPercentile: number
      ivRank: number
      vix: number
    }
    optionGreeks: {
      delta: number
      gamma: number
      theta: number
      vega: number
      rho: number
    }
  }
}

const mockData = {
  volOverTime: [
    { date: '2023-01-01', impliedVol: 0.2, historicalVol: 0.18, vix: 15 },
    { date: '2023-01-02', impliedVol: 0.22, historicalVol: 0.19, vix: 16 },
    { date: '2023-01-03', impliedVol: 0.21, historicalVol: 0.2, vix: 14 },
  ],
  volSmile: [
    { strike: 90, callIV: 0.25, putIV: 0.23 },
    { strike: 100, callIV: 0.2, putIV: 0.2 },
    { strike: 110, callIV: 0.22, putIV: 0.24 },
  ],
  volMetrics: {
    currentIV: 0.2,
    historicalVol: 0.18,
    ivPercentile: 60,
    ivRank: 55,
    vix: 15,
  },
  optionGreeks: {
    delta: 0.5,
    gamma: 0.05,
    theta: -0.01,
    vega: 0.1,
    rho: 0.01,
  },
}

const defaultComponents: VolatilityDashboardProps['components'] = [
  'VolatilityOverTime',
  'VolatilitySmile',
  'VolatilityMetrics',
  'OptionGreeks'
]

const VolatilityDashboard: React.FC<VolatilityDashboardProps> = ({ 
  components = defaultComponents, 
  data = mockData 
}) => {
  const componentMap = {
    VolatilityOverTime: <VolatilityOverTime data={data.volOverTime} />,
    VolatilitySmile: <VolatilitySmile data={data.volSmile} />,
    VolatilityMetrics: <VolatilityMetrics {...data.volMetrics} />,
    OptionGreeks: <OptionGreeks {...data.optionGreeks} />,
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {components.map((component, index) => (
        <React.Fragment key={index}>
          {componentMap[component]}
        </React.Fragment>
      ))}
    </div>
  )
}

export default VolatilityDashboard