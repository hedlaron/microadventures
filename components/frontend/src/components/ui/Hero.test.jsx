import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hero from './Hero'

describe('Hero Component', () => {
  it('renders without crashing', () => {
    render(<Hero />)
    expect(screen.getByText('Discover Your Next Adventure')).toBeInTheDocument()
  })

  it('displays the main heading', () => {
    render(<Hero />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Discover Your Next Adventure')
  })

  it('displays the subtitle with description', () => {
    render(<Hero />)
    const subtitle = screen.getByRole('heading', { level: 2 })
    expect(subtitle).toHaveTextContent(/Plan short, exciting trips/)
    expect(subtitle).toHaveTextContent(/tailored to your location, time, and weather/)
  })

  it('displays the start planning button', () => {
    render(<Hero />)
    const button = screen.getByRole('button', { name: /start planning/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Start Planning')
  })

  it('applies proper styling classes', () => {
    render(<Hero />)
    
    // Check for main container styling
    const container = screen.getByText('Discover Your Next Adventure').closest('.layout-content-container')
    expect(container).toHaveClass('flex', 'flex-col', 'max-w-[960px]', 'flex-1')
  })

  it('has background image styling', () => {
    render(<Hero />)
    
    // Find the element with background image
    const backgroundDiv = screen.getByText('Discover Your Next Adventure').closest('[style*="background-image"]')
    expect(backgroundDiv).toBeTruthy()
    expect(backgroundDiv).toHaveStyle({ backgroundImage: expect.stringContaining('googleusercontent.com') })
  })

  it('button is clickable', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    
    const button = screen.getByRole('button', { name: /start planning/i })
    
    // Test that button can be clicked (doesn't throw error)
    await user.click(button)
    expect(button).toBeInTheDocument()
  })

  it('uses responsive design classes', () => {
    render(<Hero />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass(
      'text-4xl', 
      '@[480px]:text-5xl',
      'font-black',
      '@[480px]:font-black'
    )
  })

  it('has proper text content and hierarchy', () => {
    render(<Hero />)
    
    // Check that we have exactly one h1 and one h2
    const h1Elements = screen.getAllByRole('heading', { level: 1 })
    const h2Elements = screen.getAllByRole('heading', { level: 2 })
    
    expect(h1Elements).toHaveLength(1)
    expect(h2Elements).toHaveLength(1)
  })

  it('applies container query classes correctly', () => {
    render(<Hero />)
    
    // Check for @container usage by looking for the class name in the DOM
    const containerDiv = screen.getByText('Discover Your Next Adventure').closest('div')
    
    // Find a div that has @container class
    let foundContainer = false
    let currentElement = containerDiv
    
    while (currentElement && !foundContainer) {
      if (currentElement.className && currentElement.className.includes('@container')) {
        foundContainer = true
      }
      currentElement = currentElement.parentElement
    }
    
    expect(foundContainer).toBe(true)
  })
})
