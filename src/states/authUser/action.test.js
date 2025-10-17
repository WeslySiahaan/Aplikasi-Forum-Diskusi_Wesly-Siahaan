// Skenario:
// - Sukses login: simpan token, ambil profil, dispatch SET_AUTH_USER, tampil/selesai loading
// - Gagal login: munculkan alert pesan error, selesai loading
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncSetAuthUser } from './action';
import api from '../../utils/api';
import { showLoading, hideLoading } from '@dimasmds/react-redux-loading-bar';

vi.mock('../../utils/api', () => ({
  default: {
    login: vi.fn(),
    putAccessToken: vi.fn(),
    getAccessToken: vi.fn(),
    getOwnProfile: vi.fn(),
  },
}));
vi.spyOn(console, 'error').mockImplementation(() => {});

vi.mock('@dimasmds/react-redux-loading-bar', () => ({
  showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
  hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

describe('asyncSetAuthUser thunk', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {}); // silence error noise
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches setAuthUser on success', async () => {
    api.login.mockResolvedValue('token-1');
    api.getAccessToken.mockReturnValue('token-1');
    api.getOwnProfile.mockResolvedValue({ id: 'u-1', name: 'Jane' });

    await asyncSetAuthUser({ id: 'user@example.com', password: 'pass' })(dispatch);

    expect(showLoading).toHaveBeenCalled();
    expect(api.putAccessToken).toHaveBeenCalledWith('token-1');
    expect(api.getOwnProfile).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'SET_AUTH_USER' }));
    expect(hideLoading).toHaveBeenCalled();
  });

  it('alerts when login fails', async () => {
    api.login.mockRejectedValue(new Error('Invalid'));
    await asyncSetAuthUser({ id: 'x', password: 'y' })(dispatch);
    expect(window.alert).toHaveBeenCalledWith('Invalid');
    expect(hideLoading).toHaveBeenCalled();
  });
});