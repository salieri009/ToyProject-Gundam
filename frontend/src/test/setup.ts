import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// 각 테스트 후 React 트리 + localStorage 정리
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// jsdom 은 location 할당 시 "Not implemented" 에러를 내므로,
// 리다이렉트 동작을 검증할 수 있도록 쓰기 가능한 stub 으로 대체한다.
beforeEach(() => {
  const loc = { href: '', pathname: '/posts', assign: vi.fn() };
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: loc as unknown as Location,
  });
});
