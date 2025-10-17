import React, { useState } from 'react';
import PropTypes from 'prop-types';

function TalkInput({ addTalk }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [body, setBody] = useState('');

  function onSubmit() {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) return;
    addTalk({ title: trimmedTitle, body: trimmedBody, category: category.trim() });
    setTitle('');
    setCategory('general');
    setBody('');
  }

  return (
    <div className="talk-input">
      <input
        type="text"
        placeholder="Thread title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
      />
      <input
        type="text"
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        maxLength={40}
      />
      <textarea
        type="text"
        placeholder="Thread body"
        value={body}
        onChange={(e) => { if (e.target.value.length <= 320) setBody(e.target.value); }}
      />
      <p className="talk-input__char-left">
        <strong>{body.length}</strong>
        /320
      </p>
      <button type="submit" onClick={onSubmit}>Create Thread</button>
    </div>
  );
}

TalkInput.propTypes = {
  addTalk: PropTypes.func.isRequired,
};

export default TalkInput;
