import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import AnalysisDashboard from './page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    }
  }
}))

// mock the clerk authentication

jest.mock('@clerk/nextjs', () => ({
  auth: () => new Promise((resolve) => resolve({ userId: 'user_123' })),
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    isLoaded: true,
    userId: 'user_123'
  })
}))

describe('Page', () => {
    it('renders loading state', () => {
      render(<AnalysisDashboard />)
      const loading = screen.getByTestId('loading-spinner')
      expect(loading).toBeInTheDocument()
    })
  })