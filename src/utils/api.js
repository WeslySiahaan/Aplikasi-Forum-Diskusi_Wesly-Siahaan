const api = (() => {
  const BASE_URL = 'https://forum-api.dicoding.dev/v1';

  async function _fetchWithAuth(url, options = {}) {
    const token = getAccessToken();
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...authHeader,
      },
    });
  }

  function putAccessToken(token) {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  function mapOwnerToUser(owner) {
    return {
      id: owner.id,
      name: owner.name,
      photo: owner.avatar,
    };
  }

  function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async function register({ id, name, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email: id,
        password,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { user } } = responseJson;

    return user;
  }

  async function login({ id, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: id, password }),
    });
    const responseJson = await response.json();
    const { status, message } = responseJson;
    if (status !== 'success') throw new Error(message);
    const token = responseJson?.data?.token;
    if (!token) throw new Error('Login response missing token');
    return token;
  }

  async function getOwnProfile() {
    const response = await _fetchWithAuth(`${BASE_URL}/users/me`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { user } } = responseJson;

    return { id: user.id, name: user.name, photo: user.avatar };

  }

  function mapThreadToTalk(thread) {
    return {
      id: thread.id,
      title: thread.title,
      text: thread.body, // using body as the main text
      createdAt: thread.createdAt,
      likes: Array.isArray(thread.upVotesBy) ? thread.upVotesBy : [],
      totalComments: typeof thread.totalComments === 'number' ? thread.totalComments : (Array.isArray(thread.comments) ? thread.comments.length : 0),
      category: thread.category,
      user: thread.ownerId || (thread.owner && thread.owner.id) || thread.owner, // will be joined with users list on Home
    };
  }

  function mapThreadDetailToTalkDetail(detail) {
    // detail.thread structure from Dicoding API
    const { id, title, body, createdAt, owner, comments = [], upVotesBy = [] } = detail;

    return {
      id,
      title,
      text: body,
      createdAt,
      likes: upVotesBy,
      user: mapOwnerToUser(owner),
      // Parent is not applicable for thread detail
      parent: null,
      // Replies are thread comments mapped into TalkItem shape
      replies: comments.map((c) => ({
        id: c.id,
        text: c.content,
        createdAt: c.createdAt,
        likes: Array.isArray(c.upVotesBy) ? c.upVotesBy : [],
        user: mapOwnerToUser(c.owner),
      })),
    };
  }

  async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/users`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { users } } = responseJson;

    return users.map((u) => ({ id: u.id, name: u.name, photo: u.avatar }));
  }

  async function getAllTalks() {
    const response = await fetch(`${BASE_URL}/threads`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }
    const { data: { threads } } = responseJson;
    return threads.map(mapThreadToTalk);

  }

  async function getTalkDetail(id) {
    const response = await fetch(`${BASE_URL}/threads/${id}`);

    const responseJson = await response.json();

    const { status, message } = responseJson;

    if (status !== 'success') {
      throw new Error(message);
    }

    const { data: { detailThread } } = responseJson;


    return mapThreadDetailToTalkDetail(detailThread);

  }

  async function createTalk({ title, body, category = 'general', text, replyTo = '' }) {
    // If replyTo exists we are creating a comment on a thread
    if (replyTo) {
      const response = await _fetchWithAuth(`${BASE_URL}/threads/${replyTo}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: text || body || title || '',
        }),
      });

      const responseJson = await response.json();
      const { status, message } = responseJson;
      if (status !== 'success') {
        throw new Error(message);
      }
      const { data: { comment } } = responseJson;
      return {
        id: comment.id,
        text: comment.content,
        createdAt: comment.createdAt,
        likes: Array.isArray(comment.upVotesBy) ? comment.upVotesBy : [],
        user: comment.owner?.id || comment.owner,
      };
    }

    // Otherwise create a new thread
    const finalTitle = title || (text ? (text.length > 50 ? `${text.slice(0, 50)}…` : text) : '');
    const finalBody = body || text || '';
    const response = await _fetchWithAuth(`${BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: finalTitle,
        body: finalBody,
        category,
      }),
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }
    const { data: { thread } } = responseJson;
    return mapThreadToTalk(thread);
  }

  async function toggleLikeTalk(id, { isLiked } = { isLiked: false }) {
    const endpoint = isLiked ? `${BASE_URL}/threads/${id}/neutral-vote` : `${BASE_URL}/threads/${id}/up-vote`;
    const response = await _fetchWithAuth(endpoint, {
      method: 'POST',
    });

    const responseJson = await response.json();
    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }
  }
  async function toggleLikeComment(threadId, commentId, { isLiked } = { isLiked: false }) {
    const endpoint = isLiked
      ? `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`
      : `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`;
    const response = await _fetchWithAuth(endpoint, { method: 'POST' });
    const responseJson = await response.json();
    const { status, message } = responseJson;
    if (status !== 'success') {
      throw new Error(message);
    }
  }


  // Thunk actions must live in state modules, not in the API layer.

  return {
    putAccessToken,
    getAccessToken,
    register,
    login,
    getOwnProfile,
    getAllUsers,
    getAllTalks,
    mapThreadToTalk,
    mapThreadDetailToTalkDetail,
    createTalk,
    toggleLikeTalk,
    toggleLikeComment,
    getTalkDetail,
  };
})();

export default api;
