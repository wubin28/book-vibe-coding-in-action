import { describe, it, expect, afterEach } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from './App'

describe('App component', () => {
  it('renders the Optimize Prompt button', () => {
    render(<App />)
    expect(screen.getByText('Optimize Prompt')).toBeInTheDocument()
  })

  // Test rendering of major UI components
  it('renders the main RABPOC form elements', () => {
    // given
    render(<App />)
    
    // when - user views the app
    
    // then - all form fields should be visible
    expect(screen.getByText(/what role you want ai to play\?/i)).toBeInTheDocument()
    expect(screen.getByText(/what audience you want ai to generate content for\?/i)).toBeInTheDocument()
    expect(screen.getByText(/what boundary should ai focus on for this discussion\?/i)).toBeInTheDocument()
    expect(screen.getByText(/what purpose you want ai to help you achieve\?/i)).toBeInTheDocument()
    expect(screen.getByText(/what output format you want ai to generate\?/i)).toBeInTheDocument()
    expect(screen.getByText(/what concern you have about this discussion with ai\?/i)).toBeInTheDocument()
  })

  // Test form field input handling
  it('updates form data when user inputs values', async () => {
    // given
    render(<App />)
    const user = userEvent.setup()
    const roleInput = screen.getByPlaceholderText(/e\.g\., prompt optimization expert/i)
    
    // when
    await user.type(roleInput, 'Test Role')
    
    // then
    expect(roleInput).toHaveValue('Test Role')
  })

  // Test optimize button state changes based on loading state
  it('disables the optimize button during loading and changes text', async () => {
    // given
    render(<App />)
    const optimizeButton = screen.getByRole('button', { name: /optimize prompt/i })
    
    // when - button is clicked (simulate loading state)
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      // Never resolve to keep loading state
      return new Promise(() => {})
    })
    fireEvent.click(optimizeButton)
    
    // then
    expect(optimizeButton).toBeDisabled()
    expect(screen.getByText(/generating\.\.\./i)).toBeInTheDocument()
  })

  // Test form data state updates when inputs change - FIXED VERSION
  it('updates all form fields when user inputs values', async () => {
    // given
    render(<App />)
    const user = userEvent.setup()
    
    // 修复：使用更具体的查询方法来获取输入框
    // 首先通过标签文本查找包含该标签的 div，然后在该 div 内查找输入框
    const roleDiv = screen.getByText(/what role you want ai to play\?/i).closest('div')
    const audienceDiv = screen.getByText(/what audience you want ai to generate content for\?/i).closest('div')
    const boundaryDiv = screen.getByText(/what boundary should ai focus on for this discussion\?/i).closest('div')
    const purposeDiv = screen.getByText(/what purpose you want ai to help you achieve\?/i).closest('div')
    const outputDiv = screen.getByText(/what output format you want ai to generate\?/i).closest('div')
    const concernDiv = screen.getByText(/what concern you have about this discussion with ai\?/i).closest('div')
    
    // 在每个 div 中获取输入框
    const inputs = {
      role: within(roleDiv as HTMLElement).getByRole('textbox'),
      audience: within(audienceDiv as HTMLElement).getByRole('textbox'),
      boundary: within(boundaryDiv as HTMLElement).getByRole('textbox'),
      purpose: within(purposeDiv as HTMLElement).getByRole('textbox'),
      output: within(outputDiv as HTMLElement).getByRole('textbox'),
      concern: within(concernDiv as HTMLElement).getByRole('textbox')
    }
    
    // when
    for (const [key, input] of Object.entries(inputs)) {
      await user.clear(input)
      await user.type(input, `Test ${key}`)
    }
    
    // then
    for (const [key, input] of Object.entries(inputs)) {
      expect(input).toHaveValue(`Test ${key}`)
    }
  })

  // Test optimized prompt display
  it('displays default prompt message when no optimized prompt', () => {
    // given
    render(<App />)
    
    // when - initial render
    
    // then
    expect(screen.getByText(/your optimized prompt will be displayed here/i)).toBeInTheDocument()
  })

  // Test optimize prompt API call
  it('makes API call with correct data when optimize button is clicked', async () => {
    // given
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"content":"Test optimized prompt"}')
          }).mockResolvedValueOnce({
            done: true
          })
        })
      }
    })
    vi.spyOn(global, 'fetch').mockImplementation(mockFetch)
    
    render(<App />)
    const user = userEvent.setup()
    const roleInput = screen.getByPlaceholderText(/e\.g\., prompt optimization expert/i)
    await user.type(roleInput, 'Custom Role')
    
    // when
    const optimizeButton = screen.getByRole('button', { name: /optimize prompt/i })
    await user.click(optimizeButton)
    
    // then
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/api/optimize', 
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Custom Role')
      })
    )
  })

  // Test loading state indicators
  it('displays loading indicators when generating prompt', async () => {
    // given
    vi.spyOn(global, 'fetch').mockImplementation(() => {
      // Never resolve to maintain loading state
      return new Promise(() => {})
    })
    render(<App />)
    
    // when
    const optimizeButton = screen.getByRole('button', { name: /optimize prompt/i })
    fireEvent.click(optimizeButton)
    
    // then - should show loading indicators
    expect(screen.getByText(/generating\.\.\./i)).toBeInTheDocument()
    // Check for the animated dots (loading indicator)
    const loadingDots = document.querySelectorAll('.animate-pulse .bg-blue-600')
    expect(loadingDots.length).toBe(3)
  })

  // Additional test for copy functionality
  it('has optimized prompt text that can be selected', async () => {
    // given
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"content":"Test optimized prompt content"}')
          }).mockResolvedValueOnce({
            done: true
          })
        })
      }
    })
    vi.spyOn(global, 'fetch').mockImplementation(mockFetch)
    
    render(<App />)
    
    // when
    const optimizeButton = screen.getByRole('button', { name: /optimize prompt/i })
    fireEvent.click(optimizeButton)
    
    // then - wait for content to appear
    await screen.findByText('Test optimized prompt content')
    const promptText = screen.getByText('Test optimized prompt content')
    expect(promptText).toBeInTheDocument()
  })

  // Clean up mocks after tests
  afterEach(() => {
    vi.restoreAllMocks()
  })
})