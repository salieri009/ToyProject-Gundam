import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from './api';

// api.ts 의 401 자동 refresh 인터셉터가 가장 복잡한 로직이므로 집중 검증한다.
// refresh 호출은 전역 axios 를 쓰므로(api 인스턴스가 아님) 두 어댑터를 모두 모킹한다.
describe('api 인터셉터', () => {
  let apiMock: MockAdapter;
  let axiosMock: MockAdapter;

  beforeEach(() => {
    apiMock = new MockAdapter(api);
    axiosMock = new MockAdapter(axios);
    localStorage.clear();
  });

  afterEach(() => {
    apiMock.restore();
    axiosMock.restore();
  });

  it('요청에 저장된 토큰을 Authorization 헤더로 첨부한다', async () => {
    localStorage.setItem('auth_token', 'tok123');
    apiMock.onGet('/posts').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer tok123');
      return [200, { posts: [] }];
    });

    const res = await api.get('/posts');
    expect(res.status).toBe(200);
  });

  it('401 응답 시 refresh 후 원요청을 새 토큰으로 재시도한다', async () => {
    localStorage.setItem('auth_token', 'old');
    localStorage.setItem('refresh_token', 'refresh123');

    let call = 0;
    apiMock.onGet('/posts').reply(() => {
      call += 1;
      if (call === 1) return [401, { error: 'unauthorized' }];
      return [200, { ok: true }];
    });
    axiosMock
      .onPost('http://localhost:8000/auth/refresh')
      .reply(200, { access_token: 'newtok' });

    const res = await api.get('/posts');
    expect(res.data).toEqual({ ok: true });
    expect(localStorage.getItem('auth_token')).toBe('newtok');
  });

  it('refresh_token 이 없으면 스토리지를 비우고 /auth 로 리다이렉트한다', async () => {
    localStorage.setItem('auth_token', 'old');
    apiMock.onGet('/posts').reply(401, { error: 'unauthorized' });

    await expect(api.get('/posts')).rejects.toBeTruthy();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(window.location.href).toBe('/auth');
  });
});
