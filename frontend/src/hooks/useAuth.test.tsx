import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from './useAuth';
import { authAPI } from '../services/api';

vi.mock('../services/api', () => ({
  authAPI: {
    getCurrentUser: vi.fn(),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    (authAPI.getCurrentUser as Mock).mockReset();
  });

  it('login 시 토큰을 저장하고 사용자 정보를 채운다', async () => {
    (authAPI.getCurrentUser as Mock).mockResolvedValue({
      id: '1',
      name: 'Alice',
      email: 'alice@test.com',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.login('tok'));

    await waitFor(() => expect(result.current.user?.email).toBe('alice@test.com'));
    expect(localStorage.getItem('auth_token')).toBe('tok');
  });

  it('logout 시 사용자와 토큰을 모두 비운다', async () => {
    (authAPI.getCurrentUser as Mock).mockResolvedValue({
      id: '1',
      name: 'Alice',
      email: 'alice@test.com',
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => result.current.login('tok'));
    await waitFor(() => expect(result.current.user).not.toBeNull());

    act(() => result.current.logout());

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });
});
