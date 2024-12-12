import { render, screen} from '@testing-library/react'
import { AgentForm } from '../AgentForm'

jest.mock('@/lib/context/AgentContext', () => ({
  useAgents: () => ({
    addAgent: jest.fn as jest.Mock,
  }),
}))

describe('AgentForm', () => {
  it('renders add form correctly', () => {
    render(
      <AgentForm 
        mode="add" 
        open={true} 
        onClose={() => {}} 
      />
    )

    expect(screen.getByText('Add New Agent')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
}) 