import { isDemoMode, getDemoUser } from '../lib/demo/demoSession';

describe('Demo Session Helpers', () => {
  it('should return false for isDemoMode when cookie is missing or invalid', () => {
    const mockCookieStore = {
      get: (name) => null
    };
    expect(isDemoMode(mockCookieStore)).toBe(false);

    const mockCookieStoreWrong = {
      get: (name) => ({ value: 'inactive' })
    };
    expect(isDemoMode(mockCookieStoreWrong)).toBe(false);
  });

  it('should return true for isDemoMode when cookie is active', () => {
    const mockCookieStore = {
      get: (name) => ({ value: 'active' })
    };
    expect(isDemoMode(mockCookieStore)).toBe(true);
  });

  it('should return the correct demo user', () => {
    const user = getDemoUser();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
  });
});
