'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { useAgents } from '@/lib/context/AgentContext'
import { Agent, AgentFormData } from '@/lib/types'

interface AgentFormProps {
  mode: 'add' | 'edit'
  initialData?: Agent
  open: boolean
  onClose: () => void
}

export function AgentForm({ mode, initialData, open, onClose }: AgentFormProps) {
  const { addAgent, updateAgent } = useAgents()
  const [formData, setFormData] = useState<AgentFormData>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    status: initialData?.status ?? 'active'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'add') {
      addAgent(formData)
    } else if (initialData) {
      updateAgent(initialData.id, formData)
    }
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {mode === 'add' ? 'Add New Agent' : 'Edit Agent'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="w-full border rounded-md p-2"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Agent' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 