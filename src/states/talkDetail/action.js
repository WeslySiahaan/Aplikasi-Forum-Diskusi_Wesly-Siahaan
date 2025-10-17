/**
 * @TODO: Define all the actions (creator) for the talkDetail state
 */
import api from '../../utils/api';
import { showLoading, hideLoading } from '@dimasmds/react-redux-loading-bar';

const ActionType = {
  RECEIVE_TALK_DETAIL: 'RECEIVE_TALK_DETAIL',
  CLEAR_TALK_DETAIL: 'CLEAR_TALK_DETAIL',
  TOGGLE_LIKE_TALK_DETAIL: 'TOGGLE_LIKE_TALK_DETAIL',
  TOGGLE_LIKE_COMMENT: 'TOGGLE_LIKE_COMMENT',
};

function receiveTalkDetailActionCreator(talkDetail) {
  return {
    type: ActionType.RECEIVE_TALK_DETAIL,
    payload: {
      talkDetail,
    },
  };
}

function clearTalkDetailActionCreator() {
  return {
    type: ActionType.CLEAR_TALK_DETAIL,
  };
}

function toggleLikeTalkDetailActionCreator(userId) {
  return {
    type: ActionType.TOGGLE_LIKE_TALK_DETAIL,
    payload: {
      userId,
    },
  };
}

function toggleLikeCommentActionCreator({ commentId, userId }) {
  return {
    type: ActionType.TOGGLE_LIKE_COMMENT,
    payload: { commentId, userId },
  };
}

function asyncReceiveTalkDetail(talkId) {
  return async (dispatch) => {
    dispatch(clearTalkDetailActionCreator());
    dispatch(showLoading());
    try {
      const talkDetail = await api.getTalkDetail(talkId);
      dispatch(receiveTalkDetailActionCreator(talkDetail));
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncToogleLikeTalkDetail() {
  return async (dispatch, getState) => {
    const { authUser, talkDetail } = getState();
    dispatch(toggleLikeTalkDetailActionCreator(authUser.id));
    dispatch(showLoading());

    try {
      const isLiked = talkDetail.likes.includes(authUser.id);
      await api.toggleLikeTalk(talkDetail.id, { isLiked });
    } catch (error) {
      alert(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };
}

function asyncToggleLikeComment(commentId) {
  return async (dispatch, getState) => {
    const { authUser, talkDetail } = getState();
    if (!authUser || !authUser.id) return;

    // Optimistic update
    dispatch(toggleLikeCommentActionCreator({ commentId, userId: authUser.id }));
    dispatch(showLoading());

    try {
      const comment = (talkDetail.replies || []).find((c) => c.id === commentId);
      const isLiked = comment && Array.isArray(comment.likes)
        ? comment.likes.includes(authUser.id)
        : false;
      await api.toggleLikeComment(talkDetail.id, commentId, { isLiked });
    } catch (error) {
      alert(error.message);
      // revert
      dispatch(toggleLikeCommentActionCreator({ commentId, userId: authUser.id }));
    } finally {
      dispatch(hideLoading());
    }
  };
}

export {
  ActionType,
  receiveTalkDetailActionCreator,
  clearTalkDetailActionCreator,
  toggleLikeTalkDetailActionCreator,
  toggleLikeCommentActionCreator,
  asyncReceiveTalkDetail,
  asyncToogleLikeTalkDetail,
  asyncToggleLikeComment,
};