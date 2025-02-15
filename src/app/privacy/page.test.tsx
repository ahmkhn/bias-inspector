import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import PrivacyPolicy from './page'
 
describe('Page', () => {
  it('renders a heading', () => {
    render(<PrivacyPolicy />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})