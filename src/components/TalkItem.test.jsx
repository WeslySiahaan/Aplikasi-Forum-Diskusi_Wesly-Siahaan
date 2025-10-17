// Skenario:
// - Render konten: nama user, kategori, total komentar, teks pendukung terlihat
// - Interaksi: klik tombol Like memanggil handler dengan id talk
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TalkItem from './TalkItem';

const baseProps = {
  id: 't-1',
  title: 'Hello',
  text: '<p>World</p>',
  createdAt: new Date().toISOString(),
  likes: [],
  totalComments: 2,
  category: 'news',
  user: { id: 'u-1', name: 'Jane' },
  authUser: 'u-2',
};

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('TalkItem', () => {
  it('renders user and content', () => {
    renderWithRouter(<TalkItem {...baseProps} showHeaderTime={false} />);
    expect(screen.getByText('Jane')).toBeInTheDocument();
    expect(screen.getByText(/#news/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Dibuat oleh Jane/)).toBeInTheDocument();
  });

  it('calls like handler when like button clicked', async () => {
    const like = vi.fn();
    renderWithRouter(<TalkItem {...baseProps} like={like} />);
    await userEvent.click(screen.getByRole('button', { name: /like/i }));
    expect(like).toHaveBeenCalledWith('t-1');
  });
});