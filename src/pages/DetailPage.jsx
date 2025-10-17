import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import TalkDetail from '../components/TalkDetail';
import TalkItem from '../components/TalkItem';
import TalkReplyInput from '../components/TalkReplyInput';
import { asyncReceiveTalkDetail, asyncToogleLikeTalkDetail } from '../states/talkDetail/action';
import { asyncAddTalk } from '../states/talks/action';
import { asyncToggleLikeComment } from '../states/talkDetail/action';


function DetailPage() {
  const { id } = useParams();
  const {
    talkDetail = null,
    authUser,
  } = useSelector((states) => states);
  const dispatch = useDispatch();

  const authId = authUser && authUser.id ? authUser.id : '';

  useEffect(() => {
    // @TODO: dispatch async action to get talk detail by id
    dispatch(asyncReceiveTalkDetail(id));
  }, [id, dispatch]);

  const onLikeTalk = () => {
    // @TODO: dispatch async action to toggle like talk detail
    dispatch(asyncToogleLikeTalkDetail());
  };

  const onReplyTalk = (text) => {
    // @TODO: dispatch async action to add reply talk
    dispatch(asyncAddTalk({ text, replyTo: id }));
  };

  const onLikeComment = (commentId) => {
    dispatch(asyncToggleLikeComment(commentId));
  };

  if (!talkDetail) {
    return null;
  }

  return (
    <section className="detail-page">
      {
        talkDetail.parent && (
          <div className="detail-page__parent">
            <h3>Replying To</h3>
            <TalkItem {...talkDetail.parent} authUser={authId} />
          </div>
        )
      }
      <TalkDetail {...talkDetail} authUser={authId} likeTalk={onLikeTalk} />
      {
        Array.isArray(talkDetail.replies) && talkDetail.replies.length > 0 && (
          <div className="detail-page__replies">
            <h3>Comments</h3>
            {talkDetail.replies.map((reply) => (
              <TalkItem key={reply.id} {...reply} authUser={authId} like={() => onLikeComment(reply.id)} clickable={false} showMeta={false} showHeaderTime={false} />
            ))}
          </div>
        )

      }
      <TalkReplyInput replyTalk={onReplyTalk} />
    </section>
  );
}
export default DetailPage;