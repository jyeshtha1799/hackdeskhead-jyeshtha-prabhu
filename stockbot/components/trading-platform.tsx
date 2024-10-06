'use client'

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import DeskChat from '@/components/new/DeskChat';
import AgentChat from '@/components/new/AgentChat';
import LoginDialog from '@/components/new/LoginDialog';
import SignUpDialog from '@/components/new/SignUpDialog';
import AlertComponent from '@/components/new/AlertComponent';
import PositionsManager from '@/components/new/PositionsManager';
import { stocksData } from '@/data/stocksData';
import { theoreticalValues } from '@/data/theoreticalValues';
import { useTrading } from '@/hooks/useTrading';
import ToolsPanel from '@/components/new/ToolsPanel';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useNavigationLogic } from '@/hooks/useNavigationLogic';

import DeskheadMarketOverview from '@/components/new/Views/DeskheadViews/DeskheadMarketOverview';
import DeskheadStockOverview from '@/components/new/Views/DeskheadViews/DeskheadStockOverview';
import DeskheadExpirationOverview from '@/components/new/Views/DeskheadViews/DeskheadExpirationOverview';
import DeskheadSingleOptionOverview from '@/components/new/Views/DeskheadViews/DeskheadSingleOptionOverview';

import JuniorTraderMarketOverview from '@/components/new/Views/JuniorTraderViews/JuniorTraderMarketOverview';
import JuniorTraderStockOverview from '@/components/new/Views/JuniorTraderViews/JuniorTraderStockOverview';
import JuniorTraderExpirationOverview from '@/components/new/Views/JuniorTraderViews/JuniorTraderExpirationOverview';
import JuniorTraderSingleOptionOverview from '@/components/new/Views/JuniorTraderViews/JuniorTraderSingleOptionOverview';

import RiskManagerMarketOverview from '@/components/new/Views/RiskManagerViews/RiskManagerMarketOverview';
import RiskManagerStockOverview from '@/components/new/Views/RiskManagerViews/RiskManagerStockOverview';
import RiskManagerExpirationOverview from '@/components/new/Views/RiskManagerViews/RiskManagerExpirationOverview';
import RiskManagerSingleOptionOverview from '@/components/new/Views/RiskManagerViews/RiskManagerSingleOptionOverview';

import ResearcherMarketOverview from '@/components/new/Views/ResearcherViews/ResearcherMarketOverview';
import ResearcherStockOverview from '@/components/new/Views/ResearcherViews/ResearcherStockOverview';
import ResearcherExpirationOverview from '@/components/new/Views/ResearcherViews/ResearcherExpirationOverview';
import ResearcherSingleOptionOverview from '@/components/new/Views/ResearcherViews/ResearcherSingleOptionOverview';

export default function TradingPlatform() {
  const {
    isTrading,
    setIsTrading,
    spread,
    addToSpread,
    removeFromSpread,
    executeOrder,
  } = useTrading();

  const devMode = true;
  const [viewingSpread, setViewingSpread] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Deskhead');
  const [deskChatMessages, setDeskChatMessages] = useState([
    { sender: 'Junior Trader', content: "Hey team, I'm seeing some unusual activity in AAPL options. Anyone else noticing this?" },
    { sender: 'Risk Manager', content: "Thanks for the heads up. Can you provide more details on what you're seeing?" },
    { sender: 'Researcher', content: "I've been analyzing AAPL's recent earnings report. There might be some correlation." },
    { sender: 'Junior Trader', content: 'The implied volatility for near-term options has spiked in the last hour.' },
    { sender: 'Risk Manager', content: "Interesting. Let's keep a close eye on this. Junior Trader, can you prepare a quick report on the IV changes?" },
    { sender: 'Researcher', content: "I'll look into any recent news or events that might be causing this. Will update the team shortly." },
  ]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [agentChats, setAgentChats] = useState({
    'Junior Trader': [],
    'Risk Manager': [],
    'Researcher': [],
  });

  const juniorTraderResponses = {
    'anything going on with AAPL?':
      "Vol is off the highs but downside skew has been bid up 2 points, volume is up 20% compared to the last 10 Friday's. Market makers have some pin risk at 225 where they're likely short around 20k calls. Since you own some of these calls, it's worth considering selling.",
    'what are the odds we finish in the money?':
      "Around 70%. It's slightly elevated due to the effects of potential gamma-hedging, but I'd just think of this as just an opportunity to sell for more than this option is statistically worth. For context, the best bid implies 24% vol while nearby options imply only 20% vol.",
    'wait how much vol did i buy it for':
      "You bought this contract when volatility was only 20%, so you've won on pretty much every aspect of this trade. If you want to sell, you can post an offer tied to a 23% vol level—there's a good chance someone will take that trade.",
  };

  const [isDeskChatCollapsed, setIsDeskChatCollapsed] = useState(false);
  const [isAgentChatCollapsed, setIsAgentChatCollapsed] = useState(false);
  const [unreadDeskChatCount, setUnreadDeskChatCount] = useState(0);
  const [unreadAgentChatCount, setUnreadAgentChatCount] = useState(0);
  const [isToolsPanelCollapsed, setIsToolsPanelCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [companyForRiskAnalysis, setCompanyForRiskAnalysis] = useState('');
  const [riskAnalysis, setRiskAnalysis] = useState('');
  const [researchAnalysis, setResearchAnalysis] = useState('');
  const [companyForResearch, setCompanyForResearch] = useState('');

  const [positions, setPositions] = useState([]);
  const [accountValue, setAccountValue] = useState(1000000); // Example initial value
  const [pnlPercentage, setPnlPercentage] = useState(0);
  const { watchlistStocks, addToWatchlist, removeFromWatchlist } = useWatchlist();

  // Import navigation logic from the hook
  const {
    selectedStock,
    setSelectedStock,
    selectedExpiration,
    setSelectedExpiration,
    selectedOption,
    setSelectedOption,
    currentStock,
    currentOptions,
    currentExpirationOptions,
    currentOptionDetails,
    handleSelectInstrument,
    handleSelectExpiration,
    handleSelectOption,
    navigateBack,
    getCurrentView,
  } = useNavigationLogic();

  // New state for last visited layers per role
  const [lastVisited, setLastVisited] = useState({
    Deskhead: { selectedStock: null, selectedExpiration: null, selectedOption: null },
    'Junior Trader': { selectedStock: null, selectedExpiration: null, selectedOption: null },
    'Risk Manager': { selectedStock: null, selectedExpiration: null, selectedOption: null },
    Researcher: { selectedStock: null, selectedExpiration: null, selectedOption: null },
  });

  // Update lastVisited when selectedStock, selectedExpiration, selectedOption change
  useEffect(() => {
    setLastVisited((prev) => ({
      ...prev,
      [selectedRole]: {
        selectedStock,
        selectedExpiration,
        selectedOption,
      },
    }));
  }, [selectedStock, selectedExpiration, selectedOption, selectedRole]);

  // Removed the useEffect that resets selectedStock, selectedExpiration, and selectedOption on role change
  // This ensures that the depth and associated props are preserved when switching roles

  // Wrap handleSelect functions to include authentication and trading logic
  const handleSelectInstrumentWithTrading = (item) => {
    if (!hasAccount && !devMode) {
      setShowLoginDialog(true);
      return;
    }
    if (isTrading) {
      addToSpread({ ...item, fv: Math.random() * 10 + 5 });
    } else {
      handleSelectInstrument(item);
    }
  };

  const handleSelectExpirationWithCheck = (expiration) => {
    if (!hasAccount && !devMode) {
      setShowLoginDialog(true);
      return;
    }
    handleSelectExpiration(expiration);
  };

  const handleSelectOptionWithCheck = (symbol, expiration, strike, optionType) => {
    if (!hasAccount && !devMode) {
      setShowLoginDialog(true);
      return;
    }
    handleSelectOption(symbol, expiration, strike, optionType);
  };

  const handleDeskChatMessage = (message) => {
    setDeskChatMessages([...deskChatMessages, { sender: 'User', content: message }]);
    if (isDeskChatCollapsed) {
      setUnreadDeskChatCount((prevCount) => prevCount + 1);
    }
    // Simulated response
    setTimeout(() => {
      setDeskChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'AI Assistant', content: 'This is a simulated response to your message.' },
      ]);
      if (isDeskChatCollapsed) {
        setUnreadDeskChatCount((prevCount) => prevCount + 1);
      }
    }, 1000);
  };

  const handleSendAgentMessage = (agent, content) => {
    setAgentChats((prevChats) => ({
      ...prevChats,
      [agent]: [...prevChats[agent], { sender: 'User', content }],
    }));

    if (agent === 'Junior Trader' && juniorTraderResponses[content]) {
      setTimeout(() => {
        setAgentChats((prevChats) => ({
          ...prevChats,
          [agent]: [...prevChats[agent], { sender: agent, content: juniorTraderResponses[content] }],
        }));
      }, 1000);
    } else {
      // Fallback for other agents or unrecognized messages
      setTimeout(() => {
        setAgentChats((prevChats) => ({
          ...prevChats,
          [agent]: [
            ...prevChats[agent],
            { sender: agent, content: `This is a simulated response from ${agent}.` },
          ],
        }));
      }, 1000);
    }
  };

  const handleDeskChatMessageClick = (message) => {
    setSelectedAgent(message.sender);
  };

  const handleLogin = (credentials) => {
    // Mock login process
    console.log('Login attempt with:', credentials);
    setIsAuthenticated(true);
    setHasAccount(true);
    setShowLoginDialog(false);
    setAlerts([...alerts, { type: 'success', message: 'Successfully logged in!' }]);
  };

  const handleSignUp = (userData) => {
    // Mock sign up process
    console.log('Sign up attempt with:', userData);
    setIsAuthenticated(true);
    setHasAccount(true);
    setShowSignUpDialog(false);
    setAlerts([...alerts, { type: 'success', message: 'Account created successfully!' }]);
  };

  const handleExecuteOrder = (spread, orderType, limitPrice) => {
    const newPositions = [...positions];
    spread.forEach((item) => {
      const folderIndex = newPositions.findIndex((folder) =>
        folder.items.some((subFolder) => subFolder.name === item.symbol)
      );
      if (folderIndex !== -1) {
        const subFolderIndex = newPositions[folderIndex].items.findIndex(
          (subFolder) => subFolder.name === item.symbol
        );
        if (subFolderIndex !== -1) {
          const itemIndex = newPositions[folderIndex].items[subFolderIndex].items.findIndex(
            (position) =>
              position.type === item.type &&
              position.strike === item.strike &&
              position.expiry === item.expiry &&
              position.optionType === item.optionType
          );
          if (itemIndex !== -1) {
            newPositions[folderIndex].items[subFolderIndex].items[itemIndex].quantity += item.quantity;
          } else {
            newPositions[folderIndex].items[subFolderIndex].items.push({
              id: `${item.symbol}${Date.now()}`,
              ...item,
            });
          }
        }
      }
    });
    setPositions(newPositions);
    setAlerts([...alerts, { type: 'success', message: 'Order executed successfully' }]);
    setIsTrading(false);
    setViewingSpread(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHasAccount(false);
    setAlerts([...alerts, { type: 'info', message: 'Logged out successfully' }]);
    // Optional: Clear user-specific data
    setSelectedStock(null);
    setSelectedExpiration(null);
    setSelectedOption(null);
    setViewingSpread(false);
    setIsTrading(false);
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
  };

  const handleStartRiskAnalysis = async (company) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/start-risk-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: company, session_id: '1d' }),
      });

      if (response.ok) {
        const data = await response.json();
        setRiskAnalysis(data);
        console.log('Risk analysis:', data);
        setAgentChats(prevChats => ({
          ...prevChats,
          [selectedAgent]: [...prevChats[selectedAgent], { sender: 'System', content: data.conversation_history[0] }]
        }));
      } else {
        console.error('Error starting risk analysis');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFollowUpQuestion = async (question) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/follow-up-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: '1d', question }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('data', (data.conversation_history[-2]))
        console.log('data hisr', (data.conversation_history))

        setAgentChats(prevChats => ({
          ...prevChats,
          [selectedAgent]: [...prevChats[selectedAgent], { sender: 'System', content: data.conversation_history[data.conversation_history.length - 1]}]
        }));
      } else {
        console.error('Error with follow-up question');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRiskAnalysis = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/risk-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company: companyForRiskAnalysis }),
      });

      if (response.ok) {
        const data = await response.json();
        const { analysis } = data;
        setRiskAnalysis(analysis);
        console.log('Risk analysis:', analysis);
      } else {
        console.error('Error fetching risk analysis');
        setRiskAnalysis('Error fetching risk analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setRiskAnalysis('An error occurred');
    }
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
        console.log('Research analysis:', analysis);
      } else {
        console.error('Error fetching research analysis');
        setResearchAnalysis('Error fetching research analysis');
      }
    } catch (error) {
      console.error('Error:', error);
      setResearchAnalysis('An error occurred');
    }
  };

  const roles = [
    { name: 'Deskhead', color: '#4CAF50' },
    { name: 'Junior Trader', color: '#2196F3' },
    { name: 'Risk Manager', color: '#FFC107' },
    { name: 'Researcher', color: '#9C27B0' },
  ];

  const components = {
    Deskhead: {
      MarketOverview: DeskheadMarketOverview,
      StockOverview: DeskheadStockOverview,
      ExpirationOverview: DeskheadExpirationOverview,
      SingleOptionOverview: DeskheadSingleOptionOverview,
    },
    'Junior Trader': {
      MarketOverview: JuniorTraderMarketOverview,
      StockOverview: JuniorTraderStockOverview,
      ExpirationOverview: JuniorTraderExpirationOverview,
      SingleOptionOverview: JuniorTraderSingleOptionOverview,
    },
    'Risk Manager': {
      MarketOverview: RiskManagerMarketOverview,
      StockOverview: RiskManagerStockOverview,
      ExpirationOverview: RiskManagerExpirationOverview,
      SingleOptionOverview: RiskManagerSingleOptionOverview,
    },
    Researcher: {
      MarketOverview: ResearcherMarketOverview,
      StockOverview: ResearcherStockOverview,
      ExpirationOverview: ResearcherExpirationOverview,
      SingleOptionOverview: ResearcherSingleOptionOverview,
    },
  };

  const renderMainContent = () => {
    const currentOverview = getCurrentView();
    console.log('Current view:', currentOverview);

    const ComponentToRender = components[selectedRole][currentOverview];
    console.log('Component to render:', ComponentToRender?.name);

    const componentProps = {
      watchlistStocks,
      addToWatchlist,
      removeFromWatchlist,
      symbol: selectedStock,
      selectedStock,
      expiration: selectedExpiration,
      selectedExpiration,
      selectedOption,
      stocksData,
      onSelectInstrument: handleSelectInstrument,
      onSelectExpiration: handleSelectExpiration,
      onSelectOption: handleSelectOptionWithCheck,
      navigateBack,
      theoreticalValues,
      role: selectedRole,
      handleRiskAnalysis,
      riskAnalysis,
      companyForRiskAnalysis,
      setCompanyForRiskAnalysis,
      handleResearchAnalysis,
      researchAnalysis,
      companyForResearch,
      setCompanyForResearch,
      positions,
      accountValue,
      pnlPercentage,
      currentStock,
      currentOptions,
      currentExpirationOptions,
      currentOptionDetails,
      stock: currentStock,
      // Ensure these props are correctly passed for SingleOptionOverview
      strike: selectedOption?.strike,
      optionType: selectedOption?.optionType,
    };

    console.log('Component props:', componentProps);

    return (
      <div className="relative h-full">
        <ComponentToRender {...componentProps} />
        {currentOverview !== 'MarketOverview' && (
          <button
            onClick={navigateBack}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity z-10"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
    );
  };

  console.log('isTrading:', isTrading);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left sidebar - Positions */}
      <PositionsManager
        onSelectInstrument={handleSelectInstrumentWithTrading}
        onShowRiskManager={() => setSelectedRole('Risk Manager')}
        className="w-64 flex-shrink-0 overflow-auto border-r"
      />

      {/* Main content area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Role selector tabs */}
        <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Deskhead">Deskhead</TabsTrigger>
            <TabsTrigger value="Junior Trader">Junior Trader</TabsTrigger>
            <TabsTrigger value="Risk Manager">Risk Manager</TabsTrigger>
            <TabsTrigger value="Researcher">Researcher</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Container for central panel and chats */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Central panel */}
          <div className="flex-1 overflow-y-auto p-4 max-h-[45vh] relative">
            {renderMainContent()}
          </div>

          {/* Chat windows */}
          <div className="flex-1 min-h-[30vh] flex border-t">
            <DeskChat
              messages={deskChatMessages}
              onSendMessage={handleDeskChatMessage}
              onMessageClick={handleDeskChatMessageClick}
              isCollapsed={isDeskChatCollapsed}
              onToggleCollapse={() => {
                setIsDeskChatCollapsed(!isDeskChatCollapsed);
                if (isDeskChatCollapsed) {
                  setUnreadDeskChatCount(0);
                }
              }}
              unreadCount={unreadDeskChatCount}
              className="flex-1 border-r"
            />
            {selectedAgent && (
          <AgentChat
            agent={selectedAgent}
            messages={agentChats[selectedAgent] || []}
            isCollapsed={isAgentChatCollapsed}
            onToggleCollapse={() => {
              setIsAgentChatCollapsed(!isAgentChatCollapsed)
              if (isAgentChatCollapsed) {
                setUnreadAgentChatCount(0)
              }
            }}
            unreadCount={unreadAgentChatCount}
            handlers={{
              'Risk Manager': {
                onStartRiskAnalysis: handleStartRiskAnalysis,
                onFollowUpQuestion: handleFollowUpQuestion
              },
            }}
            className="flex-1 p-4"
          />
        )}
          </div>
        </div>
      </main>

      {/* Right sidebar - Tools */}
      <ToolsPanel
        isCollapsed={isToolsPanelCollapsed}
        onToggleCollapse={() => setIsToolsPanelCollapsed(!isToolsPanelCollapsed)}
        isTrading={isTrading}
        onStartTrading={() => {
          console.log('Trade button clicked');
          setIsTrading(true);
          console.log('isTrading set to true in TradingPlatform');
        }}
        onCancelTrading={() => setIsTrading(false)}
        onViewSpread={() => setViewingSpread(true)}
        onExecuteOrder={handleExecuteOrder}
        spread={spread}
        addToSpread={addToSpread}
        selectedStock={selectedStock}
        isAuthenticated={isAuthenticated}
        onLogin={() => setShowLoginDialog(true)}
        onLogout={handleLogout}
        roles={roles}
        selectedRole={selectedRole}
        onSelectAgent={handleSelectAgent}
        className="w-72 flex-shrink-0 border-l"
      />

      {/* Login Dialog */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
        onSignUp={() => {
          setShowLoginDialog(false);
          setShowSignUpDialog(true);
        }}
      />

      {/* Sign Up Dialog */}
      <SignUpDialog
        open={showSignUpDialog}
        onOpenChange={setShowSignUpDialog}
        onSignUp={handleSignUp}
      />

      {/* Alerts */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {alerts.map((alert, index) => (
          <AlertComponent key={index} type={alert.type} message={alert.message} />
        ))}
      </div>
    </div>
  );
}
