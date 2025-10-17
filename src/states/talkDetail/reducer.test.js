// Skenario:
// - RECEIVE_TALK_DETAIL menyimpan detail
// - CLEAR_TALK_DETAIL mengosongkan state
// - TOGGLE_LIKE_TALK_DETAIL menambah/menghapus like pada talk
// - TOGGLE_LIKE_COMMENT menambah/menghapus like pada komentar
import { describe, it, expect } from 'vitest';
import talkDetailReducer from './reducer';
import { ActionType } from './action';

const base = {
  id: 't-1',
  title: 'Title',
  text: 'Body',
  createdAt: new Date().toISOString(),
  likes: ['u-1'],
  user: { id: 'u-1', name: 'Jane' },
  replies: [{ id: 'c-1', text: 'Hi', likes: ['u-1'], user: { id: 'u-2', name: 'John' } }],
};

describe('talkDetailReducer', () => {
  it('should receive talk detail', () => {
    const state = talkDetailReducer(null, { type: ActionType.RECEIVE_TALK_DETAIL, payload: { talkDetail: base } });
    expect(state).toEqual(base);
  });

  it('should clear talk detail', () => {
    const state = talkDetailReducer(base, { type: ActionType.CLEAR_TALK_DETAIL });
    expect(state).toBe(null);
  });

  it('should toggle like on talk detail', () => {
    const state = talkDetailReducer(base, { type: ActionType.TOGGLE_LIKE_TALK_DETAIL, payload: { userId: 'u-1' } });
    expect(state.likes).toEqual([]); // removed
    const state2 = talkDetailReducer(state, { type: ActionType.TOGGLE_LIKE_TALK_DETAIL, payload: { userId: 'u-1' } });
    expect(state2.likes).toEqual(['u-1']); // added back
  });

  it('should toggle like on a comment', () => {
    const state = talkDetailReducer(base, { type: ActionType.TOGGLE_LIKE_COMMENT, payload: { commentId: 'c-1', userId: 'u-1' } });
    expect(state.replies[0].likes).toEqual([]); // unlike
  });
});