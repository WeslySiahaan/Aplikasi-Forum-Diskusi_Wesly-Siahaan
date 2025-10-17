// Skenario:
// - SET_AUTH_USER menyimpan pengguna autentik
// - UNSET_AUTH_USER menghapus pengguna autentik
import { describe, it, expect } from 'vitest';
import authUserReducer from './reducer';
import { ActionType } from './action';

describe('authUserReducer', () => {
  it('should return initial state when given unknown action', () => {
    const state = authUserReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toBe(null);
  });

  it('should handle SET_AUTH_USER', () => {
    const user = { id: 'u-1', name: 'Jane' };
    const state = authUserReducer(null, { type: ActionType.SET_AUTH_USER, payload: { authUser: user } });
    expect(state).toEqual(user);
  });

  it('should handle UNSET_AUTH_USER', () => {
    const prev = { id: 'u-1', name: 'Jane' };
    const state = authUserReducer(prev, { type: ActionType.UNSET_AUTH_USER });
    expect(state).toBe(null);
  });
});