export type Agent = {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type AgentFormData = Omit<Agent, 'id' | 'createdAt'>; 