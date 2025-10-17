import React from 'react';
import PropTypes from 'prop-types';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { postedAt } from '../utils';

function TalkItem({
  id,
  title,
  text,
  createdAt,
  likes,
  totalComments,
  category,
  user,
  authUser,
  like,
  clickable = true,
  showMeta = true,
  showHeaderTime = true,
}) {
  const navigate = useNavigate();
  const isTalkLiked = likes.includes(authUser);

  const onLikeClick = (event) => {
    event.stopPropagation();
    if (like) like(id);
  };

  const onTalkClick = () => {
    if (clickable) navigate(`/talks/${id}`);
  };

  const onTalkPress = (event) => {
    if (event.key === 'Enter') onTalkClick();
  };

  return (
    <div
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      className="talk-item"
      onClick={clickable ? onTalkClick : undefined}
      onKeyDown={clickable ? onTalkPress : undefined}
    >
      <div className="talk-item__user-photo">
        <img
          src={user?.photo || 'https://ui-avatars.com/api/?name=User&background=random'}
          alt={user?.name || 'User avatar'}
        />
      </div>

      <div className="talk-item__detail">
        <header>
          <div className="talk-item__user-info">
            <p className="talk-item__user-name">{user.name}</p>
            <p className="talk-item__user-id">@{user.id}</p>
          </div>
          {showHeaderTime && <p className="talk-item__created-at">{postedAt(createdAt)}</p>}
        </header>

        {category && (
          <div className="talk-item__category">
            <span className="chip">#{category}</span>
          </div>
        )}

        {title && <h3 className="talk-item__title">{title}</h3>}

        <article>
          <div
            className="talk-item__text"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </article>

        {showMeta && (
          <footer className="talk-item__footer">
            {like && (
              <div className="talk-item__likes">
                <button type="button" aria-label="like" onClick={onLikeClick}>
                  {isTalkLiked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
                </button>
                <span>{likes.length}</span>
              </div>
            )}

            <div className="talk-item__comments">
              <span>{typeof totalComments === 'number' ? totalComments : 0}</span> comments
            </div>

            <div className="talk-item__time">{postedAt(createdAt)}</div>
            <div className="talk-item__owner">Dibuat oleh {user.name}</div>
          </footer>
        )}
      </div>
    </div>
  );
}

// PropTypes Definitions
const userShape = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  photo: PropTypes.string,
};

const talkItemShape = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  likes: PropTypes.arrayOf(PropTypes.string).isRequired,
  totalComments: PropTypes.number,
  category: PropTypes.string,
  authUser: PropTypes.string.isRequired,
  user: PropTypes.shape(userShape).isRequired,
};

// Component PropTypes
TalkItem.propTypes = {
  ...talkItemShape,
  like: PropTypes.func,
  clickable: PropTypes.bool,
  showMeta: PropTypes.bool,
  showHeaderTime: PropTypes.bool,
};

// Default Props
TalkItem.defaultProps = {
  like: null,
  clickable: true,
  title: '',
  totalComments: 0,
  category: '',
  showMeta: true,
  showHeaderTime: true,
};

export { talkItemShape };
export default TalkItem;
