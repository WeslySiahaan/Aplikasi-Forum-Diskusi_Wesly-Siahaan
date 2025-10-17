/**
 * @TODO: Define all the actions (creator) for the talks state
 */
import api from '../../utils/api';
import { showLoading, hideLoading } from '@dimasmds/react-redux-loading-bar';
import { asyncReceiveTalkDetail } from '../talkDetail/action';

const ActionType = {
  RECEIVE_TALKS: 'RECEIVE_TALKS',
  ADD_TALK: 'ADD_TALK',
  TOGGLE_LIKE_TALK: 'TOGGLE_LIKE_TALK',
};

function receiveTalksActionCreator(talks) {
  return {
    type: ActionType.RECEIVE_TALKS,
    payload: {
      talks,
    },
  };
}

function addTalkActionCreator(talk) {
  return {
    type: ActionType.ADD_TALK,
    payload: {
      talk,
    },
  };
}

function toggleLikeTalkActionCreator({ talkId, userId }) {
  return {
    type: ActionType.TOGGLE_LIKE_TALK,
    payload: {
      talkId,
      userId,
    },
  };
}

function asyncAddTalk({ text, title, body, category, replyTo = '' }) {
  return async (dispatch) => {
    dispatch(showLoading());
    try {
      // Prefer explicit title/body/category if provided; fallback to legacy 'text'
      const payload = replyTo
        ? { text, replyTo }
        : (
          title && body
            ? { title, body, category }
            : { text }
        );
      const talk = await api.createTalk(payload);
      if (replyTo) {
        // If adding a reply, refresh the thread detail to get the latest comments
        await dispatch(asyncReceiveTalkDetail(replyTo));
      } else {
        // If creating a new thread, add to talks list
        dispatch(addTalkActionCreator(talk));
      }
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncToogleLikeTalk(talkId) {
  return async (dispatch, getState) => {
    const { authUser, talks } = getState();
    if (!authUser || !authUser.id) {
      alert('You need to login to like a thread');
      return;
    }
    dispatch(toggleLikeTalkActionCreator({ talkId, userId: authUser.id }));

    try {
      const talk = Array.isArray(talks) ? talks.find((t) => t.id === talkId) : null;
      const isLiked = talk && Array.isArray(talk.likes) ? talk.likes.includes(authUser.id) : false;
      await api.toggleLikeTalk(talkId, { isLiked });
    } catch (error) {
      alert(error.message);
      dispatch(toggleLikeTalkActionCreator({ talkId, userId: authUser.id }));
    }
  };
}
export {
  ActionType,
  receiveTalksActionCreator,
  addTalkActionCreator,
  toggleLikeTalkActionCreator,
  asyncAddTalk,
  asyncToogleLikeTalk,
};