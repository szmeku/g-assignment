'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { useAgents } from '@/lib/context/AgentContext'
import {Agent, AgentFormData} from '@/lib/types'

interface AgentFormProps {
  mode: 'add' | 'edit'
  initialData?: Agent
  open: boolean
  onClose: () => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}

export function AgentForm({ mode, initialData, open, onClose }: AgentFormProps) {
  const { addAgent } = useAgents()

  const submitAction = async (formData: FormData) => {
    const data: AgentFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'inactive',
    }
    
    await addAgent(data)
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
        <form action={submitAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={initialData?.name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialData?.email}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={initialData?.status ?? 'active'}
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
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 