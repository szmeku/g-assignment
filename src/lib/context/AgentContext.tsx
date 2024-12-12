'use client'

import { createContext, useContext, useState, useEffect, useActionState, useOptimistic, startTransition } from 'react'
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
  const [optimisticAgents, setOptimisticAgents] = useOptimistic(agents)
  

  const [addError, addAction, isAddPending] = useActionState<string | null, AgentFormData>(
    async (state, formData) => {
      try {
        const newAgent = await api.createAgent(formData)
        setAgents(prev => [...prev, newAgent])
        return null
      } catch (err) {
        return String(err)
      }
    },
    null
  )

  const [updateError, updateAction, isUpdatePending] = useActionState<string | null, { id: string; data: AgentFormData }>(
    async (state, { id, data }) => {
      try {
        const updatedAgent = await api.updateAgent(id, data)
        setAgents(prev => prev.map(agent => 
          agent.id === id ? updatedAgent : agent
        ))
        return null
      } catch (err){
        return String(err)
      }
    },
    null
  )
  
  const [deleteError, deleteAction, isDeletePending] = useActionState<string | null, string>(
    async (state, id) => {
      try {
        await api.deleteAgent(id)
        setAgents(prev => prev.filter(agent => agent.id !== id))
        return null
      } catch (err) {
        return String(err)
      }
    },
    null
  )

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await api.getAgents()
        setAgents(data)
      } catch (err) {
        console.error('Failed to fetch agents:', err)
      }
    }
    fetchAgents()
  }, [])

  const addAgent = async (data: AgentFormData) => {
    startTransition(() => {
      setOptimisticAgents(prev => [...prev, { ...data, id: 'temp-id' } as Agent])
      addAction(data)
    })
  }

  const updateAgent = async (id: string, data: AgentFormData) => {
    startTransition(() => {
      setOptimisticAgents(prev => 
        prev.map(agent => agent.id === id ? { ...agent, ...data } : agent)
      )
      updateAction({ id, data })
    })
  }

  const deleteAgent = async (id: string) => {
    startTransition(() => {
      setOptimisticAgents(prev => prev.filter(agent => agent.id !== id))
      deleteAction(id)
    })
  }

  const getAgent = (id: string) => optimisticAgents.find(agent => agent.id === id)

  const searchAgents = (query: string) => {
    if (!query) return optimisticAgents
    const lowercaseQuery = query.toLowerCase()
    return optimisticAgents.filter(agent => 
      agent.name.toLowerCase().includes(lowercaseQuery) ||
      agent.email.toLowerCase().includes(lowercaseQuery)
    )
  }

  const loading = isAddPending || isUpdatePending || isDeletePending
  const error = addError || updateError || deleteError

  return (
    <AgentContext.Provider value={{ 
      agents: optimisticAgents,
      addAgent, 
      updateAgent, 
      deleteAgent, 
      getAgent,
      searchAgents,
      loading,
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