'use client'

import { useState } from 'react'
import { useAgents } from "@/lib/context/AgentContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AgentForm } from '@/components/AgentForm'
import { Agent } from '@/lib/types'

export default function Home() {
  const { agents, deleteAgent } = useAgents()
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      deleteAgent(id)
    }
  }

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingAgent(undefined)
  }

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Agent Management</h1>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="search"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[300px]"
            />
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto"
            >
              Add Agent
            </Button>
          </div>
        </header>

        <div className="overflow-x-auto -mx-4 sm:mx-0 bg-white rounded-lg shadow">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No agents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id} className="sm:table-row flex flex-col sm:flex-row">
                      <TableCell className="sm:table-cell">
                        <span className="sm:hidden font-medium">Name: </span>
                        {agent.name}
                      </TableCell>
                      <TableCell className="sm:table-cell">
                        <span className="sm:hidden font-medium">Email: </span>
                        {agent.email}
                      </TableCell>
                      <TableCell className="sm:table-cell">
                        <span className="sm:hidden font-medium">Status: </span>
                        <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
                          agent.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {agent.status}
                        </span>
                      </TableCell>
                      <TableCell className="sm:table-cell flex flex-row space-x-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(agent)}
                          className="flex-1 sm:flex-none"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDelete(agent.id)}
                          className="flex-1 sm:flex-none"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AgentForm
        mode={editingAgent ? 'edit' : 'add'}
        initialData={editingAgent}
        open={showForm}
        onClose={handleCloseForm}
      />
    </main>
  )
}
