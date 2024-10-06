'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StockTable from '@/components/new/StockTable'
import ReactMarkdown from 'react-markdown'
import { useNavigationLogic } from '@/hooks/useNavigationLogic'
import { useWatchlist } from '@/hooks/useWatchlist'

interface ResearcherMarketOverviewProps {
  onSelectInstrument: (instrument: { symbol: string; name: string; type: 'stock' }) => void;
}

const ResearcherMarketOverview: React.FC<ResearcherMarketOverviewProps> = ({ 
  onSelectInstrument
}) => {
  const [companyForResearch, setCompanyForResearch] = useState('')
  const [researchAnalysis, setResearchAnalysis] = useState('')
  const { watchlistStocks } = useWatchlist()

  const handleStockSelection = (stock: { symbol: string; name: string; type: 'stock' }) => {
    console.log('ResearcherMarketOverview - Selected stock:', stock);
    console.log('ResearcherMarketOverview - Parameter name:', 'stock');
    onSelectInstrument(stock);
  };

  const handleResearchAnalysis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/research-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: companyForResearch }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const { analysis } = data;
        setResearchAnalysis(analysis);
      } else {
        console.error('Error fetching research analysis');
        setResearchAnalysis('Error fetching research analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setResearchAnalysis('An error occurred');
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Research Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter company name"
              value={companyForResearch}
              onChange={(e) => setCompanyForResearch(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 mr-2"
            />
            <Button onClick={handleResearchAnalysis}>
              Get Research Analysis
            </Button>
          </div>
          {researchAnalysis && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Research Analysis</h3>
              <div className="bg-gray-100 rounded-md p-4">
                <ReactMarkdown>{researchAnalysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {watchlistStocks && watchlistStocks.length > 0 ? (
            <StockTable stocks={watchlistStocks} onSelectStock={handleStockSelection} />
          ) : (
            <p>No stocks available in watchlist</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ResearcherMarketOverview