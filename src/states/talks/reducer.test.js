import { describe, it, expect } from 'vitest';
import talksReducer from './reducer';

// Skenario:
// - RECEIVE_TALKS mengganti state
// - ADD_TALK menambah di awal daftar
// - TOGGLE_LIKE_TALK toggle like user pada talk tertentu

describe('talkReducers function', () => {
  it('should return the talks when given by RECEIVE_TALKS action', () => {
    // arrange
    const initialState = [];
    const action = {
      type: 'RECEIVE_TALKS',
      payload: {
        talks: [
          {
            id: 'talk-1',
            text: 'Talk Test 1',
            user: 'user-1',
            replyTo: '',
            likes: [],
            createdAt: '2022-09-22T10:06:55.588Z',
          },
          {
            id: 'talk-2',
            text: 'Talk Test 2',
            user: 'user-2',
            replyTo: '',
            likes: [],
            createdAt: '2022-09-22T10:06:55.588Z',
          },
        ],
      },
    };
    // action
    const nextState = talksReducer(initialState, action);
    // assert
    expect(nextState).toEqual(action.payload.talks);
  });

  it('should add new talk to the beginning when given ADD_TALK action', () => {
    // arrange
    const initialState = [
      { id: 'talk-2', text: 'Talk Test 2', user: 'user-2', replyTo: '', likes: [], createdAt: '2022-09-22T10:06:55.588Z' },
    ];
    const newTalk = { id: 'talk-3', text: 'Talk Test 3', user: 'user-3', replyTo: '', likes: [], createdAt: '2022-09-23T10:06:55.588Z' };
    const action = {
      type: 'ADD_TALK',
      payload: { talk: newTalk },
    };
    // action
    const nextState = talksReducer(initialState, action);
    // assert
    expect(nextState[0]).toEqual(newTalk);
    expect(nextState).toHaveLength(2);
  });

  it('should toggle like for a given user on a specific talk when given TOGGLE_LIKE_TALK action', () => {
    // arrange
    const initialState = [
      { id: 'talk-1', text: 'A', user: 'u-1', replyTo: '', likes: ['u-2'], createdAt: '2022-09-22T10:06:55.588Z' },
      { id: 'talk-2', text: 'B', user: 'u-2', replyTo: '', likes: [], createdAt: '2022-09-22T10:06:55.588Z' },
    ];
    const actionUnlike = { type: 'TOGGLE_LIKE_TALK', payload: { talkId: 'talk-1', userId: 'u-2' } };
    // action: unlike existing like
    const stateAfterUnlike = talksReducer(initialState, actionUnlike);
    // assert
    expect(stateAfterUnlike[0].likes).toEqual([]);

    // action: like again
    const actionLike = { type: 'TOGGLE_LIKE_TALK', payload: { talkId: 'talk-1', userId: 'u-2' } };
    const stateAfterLike = talksReducer(stateAfterUnlike, actionLike);
    expect(stateAfterLike[0].likes).toEqual(['u-2']);
  });
});