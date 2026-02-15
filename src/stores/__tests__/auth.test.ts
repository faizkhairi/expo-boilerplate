import { renderHook, act } from '@testing-library/react-native'
import { useAuthStore } from '../auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAuthStore.getState().clearTokens()
  })

  it('should start with no tokens', () => {
    const { result } = renderHook(() => useAuthStore())
    expect(result.current.accessToken).toBeNull()
    expect(result.current.refreshToken).toBeNull()
  })

  it('should set tokens', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setTokens('access123', 'refresh456')
    })

    expect(result.current.accessToken).toBe('access123')
    expect(result.current.refreshToken).toBe('refresh456')
  })

  it('should clear tokens', () => {
    const { result } = renderHook(() => useAuthStore())

    act(() => {
      result.current.setTokens('access123', 'refresh456')
    })

    expect(result.current.accessToken).toBe('access123')

    act(() => {
      result.current.clearTokens()
    })

    expect(result.current.accessToken).toBeNull()
    expect(result.current.refreshToken).toBeNull()
  })
})
