import { Agent, AgentFormData } from './types'

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

    return users.map((user) => ({
      id: user.id.toString(),
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
    const user = await response.json()

    return {
      ...data,
      id: user.id.toString(),
      createdAt: new Date().toISOString(),
    }
  },

  updateAgent: async (id: string, data: AgentFormData): Promise<Agent> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
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
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete agent')
  },
} 