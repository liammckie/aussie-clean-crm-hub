
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mock Tabulator constructor
jest.mock('tabulator-tables', () => {
  return class MockTabulator {
    constructor() {
      return {
        on: jest.fn(),
        setData: jest.fn().mockReturnThis(),
        setSort: jest.fn().mockReturnThis(),
        setFilter: jest.fn().mockReturnThis(),
        setGroupBy: jest.fn().mockReturnThis(),
        getSelectedRows: jest.fn().mockReturnValue([]),
        destroy: jest.fn()
      };
    }
  };
});

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    ok: true,
    status: 200,
    headers: new Headers()
  })
) as jest.Mock;

// Silence console errors during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: React does not recognize the')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Create mock directories
jest.mock('__mocks__/styleMock.js', () => ({}), { virtual: true });
jest.mock('__mocks__/fileMock.js', () => 'test-file-stub', { virtual: true });

// Global afterEach cleanup
afterEach(() => {
  jest.clearAllMocks();
});
