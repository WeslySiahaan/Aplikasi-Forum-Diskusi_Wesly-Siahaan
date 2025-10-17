import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TalkInput from '../components/TalkInput';
import TalksList from '../components/TalksList';
import { asyncPopulateUsersAndTalks } from '../states/shared/action';
import { asyncAddTalk, asyncToogleLikeTalk } from '../states/talks/action';

function HomePage() {
  const {
    talks = [],
    users = [],
    authUser,
  } = useSelector((states) => states);

  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    dispatch(asyncPopulateUsersAndTalks());
  }, [dispatch]);

  const onAddTalk = (payload) => {
    dispatch(asyncAddTalk(payload));
  };

  const onLike = (id) => {
    dispatch(asyncToogleLikeTalk(id));
  };

  // Hitung kategori populer dari daftar thread
  const popularCategories = useMemo(() => {
    const counter = talks.reduce((acc, t) => {
      if (t.category) acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counter)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .slice(0, 10); // batasi 10 chip
  }, [talks]);

  // Gabungkan user dan authUser untuk komponen list
  const authId = authUser ? authUser.id : '';
  const augmentedTalks = talks
    .filter((t) => (selectedCategory ? t.category === selectedCategory : true))
    .map((talk) => ({
      ...talk,
      user: users.find((user) => user.id === talk.user),
      authUser: authId,
    }));

  return (
    <section className="home-page">
      <h2>Kategori populer</h2>
      <div className="home-page__categories">
        <button type="button" className={`chip ${!selectedCategory ? 'chip--active' : ''}`} onClick={() => setSelectedCategory('')}>#semua</button>
        {popularCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`chip ${selectedCategory === cat ? 'chip--active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            #{cat}
          </button>
        ))}
      </div>

      <h2>Diskusi tersedia</h2>
      <TalkInput addTalk={onAddTalk} />
      <TalksList talks={augmentedTalks} like={onLike} />
    </section>
  );
}

export default HomePage;