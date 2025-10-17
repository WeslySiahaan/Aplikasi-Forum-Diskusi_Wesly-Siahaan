import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TalkReplyInput({ replyTalk }) {
  const [text, setText] = useState('');

  function replyTalkHandler() {
    if (text.trim()) {
      replyTalk(text);
      setText('');
    }
  }

  function handleTextChange({ target }) {
    if (target.value.length <= 320) {
      setText(target.value);
    }
  }

  return (
    <div className="talk-reply-input">
      <textarea type="text" placeholder="Berikan Komentar" value={text} onChange={handleTextChange} />
      <p className="talk-reply-input__char-left">
        <strong>{text.length}</strong>
        /320
      </p>
      <button type="submit" onClick={replyTalkHandler}>Kirim</button>
    </div>
  );
}

TalkReplyInput.propTypes = {
  replyTalk: PropTypes.func.isRequired,
};

export default TalkReplyInput;
