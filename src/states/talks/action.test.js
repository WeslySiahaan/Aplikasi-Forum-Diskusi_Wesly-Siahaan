// Skenario:
// - Sukses membuat thread: tampil loading, panggil API, dispatch addTalk, selesai loading
// - Gagal membuat thread: munculkan alert pesan error
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { asyncAddTalk, addTalkActionCreator } from './action';
import api from '../../utils/api';
import { showLoading, hideLoading } from '@dimasmds/react-redux-loading-bar';

vi.mock('../../utils/api', () => ({
  default: {
    createTalk: vi.fn(),
  },
}));

vi.mock('@dimasmds/react-redux-loading-bar', () => ({
  showLoading: vi.fn(() => ({ type: 'SHOW_LOADING' })),
  hideLoading: vi.fn(() => ({ type: 'HIDE_LOADING' })),
}));

describe('asyncAddTalk', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('dispatches addTalkActionCreator when creating new thread', async () => {
    const newTalk = { id: 't-1', title: 'Hello', text: 'World', likes: [], createdAt: new Date().toISOString(), user: 'u-1' };
    api.createTalk.mockResolvedValue(newTalk);

    await asyncAddTalk({ title: 'Hello', body: 'World', category: 'general' })(dispatch);

    expect(showLoading).toHaveBeenCalled();
    expect(api.createTalk).toHaveBeenCalledWith({ title: 'Hello', body: 'World', category: 'general' });
    expect(dispatch).toHaveBeenCalledWith(addTalkActionCreator(newTalk));
    expect(hideLoading).toHaveBeenCalled();
  });

  it('alerts on error', async () => {
    api.createTalk.mockRejectedValue(new Error('Failed'));
    await asyncAddTalk({ text: 'x' })(dispatch);
    expect(window.alert).toHaveBeenCalledWith('Failed');
  });
});