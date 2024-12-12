'use client'

import { useFormStatus } from 'react-dom'
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

function SubmitButton({ mode }: { mode: 'add' | 'edit' }) {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="w-full sm:w-auto min-w-[100px]"
    >
      {pending ? 'Saving...' : mode === 'add' ? 'Add Agent' : 'Save Changes'}
    </Button>
  )
}

export function AgentForm({ mode, initialData, open, onClose }: AgentFormProps) {
  const { addAgent, updateAgent } = useAgents()

  const submitAction = async (formData: FormData) => {
    const data: AgentFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'active' | 'inactive',
    }
    
    if (mode === 'edit' && initialData) {
      await updateAgent(initialData.id, data)
    } else {
      await addAgent(data)
    }
    onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      // todo: should be refactored
      PaperProps={{
        className: 'rounded-lg',
        sx: {
          margin: { xs: '16px', sm: '32px' },
          width: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
          maxWidth: '600px',
        }
      }}
    >
      <DialogTitle className="text-xl sm:text-2xl font-bold px-6 pt-6">
        {mode === 'add' ? 'Add New Agent' : 'Edit Agent'}
      </DialogTitle>
      <DialogContent className="!pt-6">
        <form action={submitAction} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={initialData?.name}
                required
                className="mt-1.5 w-full"
                placeholder="Enter agent name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={initialData?.email}
                required
                className="mt-1.5 w-full"
                placeholder="Enter agent email"
              />
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <select
                id="status"
                name="status"
                defaultValue={initialData?.status ?? 'active'}
                className="mt-1.5 w-full px-3 py-2 bg-white border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto min-w-[100px]"
            >
              Cancel
            </Button>
            <SubmitButton mode={mode} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 