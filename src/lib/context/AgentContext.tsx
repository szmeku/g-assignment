'use client'

import { createContext, useContext, useState, useEffect, useTransition } from 'react'
import { Agent, AgentFormData } from '../types'
import { api } from '../api'

interface AgentContextType {
  agents: Agent[]
  addAgent: (data: AgentFormData) => Promise<void>
  updateAgent: (id: string, data: AgentFormData) => Promise<void>
  deleteAgent: (id: string) => Promise<void>
  getAgent: (id: string) => Agent | undefined
  searchAgents: (query: string) => Agent[]
  loading: boolean
  error: string | null
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const performAction = async <T,>(
    operation: () => Promise<T>,
    successCallback: (result: T) => void
  ) => {
    startTransition(async () => {
      try {
        await operation().then(successCallback)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('Operation failed')
      }
    })
  }

  useEffect(() => {
    performAction(
      () => api.getAgents(),
      (data) => setAgents(data)
    )
  }, [])

  const addAgent = async (data: AgentFormData) => {
    await performAction(
      () => api.createAgent(data),
      (newAgent) => setAgents(prev => [...prev, newAgent])
    )
  }

  const updateAgent = async (id: string, data: AgentFormData) => {
    await performAction(
      () => api.updateAgent(id, data),
      (updatedAgent) => setAgents(prev => 
        prev.map(agent => agent.id === id ? updatedAgent : agent)
      )
    )
  }

  const deleteAgent = async (id: string) => {
    await performAction(
      () => api.deleteAgent(id),
      () => setAgents(prev => prev.filter(agent => agent.id !== id))
    )
  }

  const getAgent = (id: string) => {
    return agents.find(agent => agent.id === id)
  }

  const searchAgents = (query: string) => {
    if (!query) return agents
    
    const lowercaseQuery = query.toLowerCase()
    return agents.filter(agent => 
      agent.name.toLowerCase().includes(lowercaseQuery) ||
      agent.email.toLowerCase().includes(lowercaseQuery)
    )
  }

  return (
    <AgentContext.Provider value={{ 
      agents, 
      addAgent, 
      updateAgent, 
      deleteAgent, 
      getAgent,
      searchAgents,
      loading: isPending,
      error
    }}>
      {children}
    </AgentContext.Provider>
  )
}

export const useAgents = () => {
  const context = useContext(AgentContext)
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider')
  }
  return context
} 