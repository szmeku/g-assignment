import { Agent, AgentFormData } from './types'
import { v4 as uuidv4 } from 'uuid'

interface JSONPlaceholderUser {
  id: number
  name: string
  email: string
}

const API_URL = 'https://jsonplaceholder.typicode.com'

export const api = {
  getAgents: async (): Promise<Agent[]> => {
    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) throw new Error('Failed to fetch agents')
    const users = await response.json() as JSONPlaceholderUser[]

    return users.map((user: JSONPlaceholderUser) => ({
      id: `jph_${user.id}`, // prefix to avoid conflicts
      name: user.name,
      email: user.email,
      status: user.id % 2 === 0 ? 'active' : 'inactive',
      createdAt: new Date().toISOString(),
    }))
  },

  createAgent: async (data: AgentFormData): Promise<Agent> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create agent')

    return {
      ...data,
      id: `new_${uuidv4()}`, // prefix to distinguish new agents
      createdAt: new Date().toISOString(),
    }
  },

  updateAgent: async (id: string, data: AgentFormData): Promise<Agent> => {
    const response = await fetch(`${API_URL}/users/${id.replace('jph_', '')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to update agent')
    
    return {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    }
  },

  deleteAgent: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id.replace('jph_', '')}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete agent')
  },
} 