'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SpreadBuilder from '@/components/new/SpreadBuilder'
import RoleLegend from '@/components/new/RoleLegend'

const ToolsPanel = React.memo((props) => {
  const {
    isCollapsed,
    onToggleCollapse,
    isTrading,
    onStartTrading,
    onCancelTrading,
    onViewSpread,
    onExecuteOrder,
    spread,
    addToSpread,
    selectedStock,
    isAuthenticated,
    onLogin,
    onLogout,
    roles,
    selectedRole
  } = props;

  console.log('ToolsPanel rendered, isTrading:', isTrading);
  console.log('ToolsPanel props:', props);

  return (
    <aside className={`border-l transition-all duration-300 flex flex-col ${isCollapsed ? 'w-16' : 'w-72'}`}>
      <div className="p-2 flex-grow overflow-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className={`text-sm font-semibold ${isCollapsed ? 'hidden' : ''}`}>Tools</h2>
          <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
            {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
        {!isCollapsed && (
          <ScrollArea className="h-full">
            {isTrading ? (
              <SpreadBuilder
                onCancel={onCancelTrading}
                onViewSpread={onViewSpread}
                onExecuteOrder={onExecuteOrder}
                spread={spread}
                addToSpread={addToSpread}
              />
            ) : (
              <div className="space-y-2">
                {selectedStock && (
                  <Button className="w-full text-xs" onClick={onStartTrading}>Trade {selectedStock}</Button>
                )}
                <Button className="w-full text-xs">Option Calculator</Button>
                <Button className="w-full text-xs">Market Scanner</Button>
                {isAuthenticated ? (
                  <Button className="w-full text-xs" onClick={onLogout}>Logout</Button>
                ) : (
                  <Button className="w-full text-xs" onClick={onLogin}>Login</Button>
                )}
              </div>
            )}
          </ScrollArea>
        )}
      </div>
      <RoleLegend roles={roles} selectedRole={selectedRole} />
    </aside>
  )
})

export default ToolsPanel