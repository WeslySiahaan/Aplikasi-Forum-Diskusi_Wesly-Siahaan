// Skenario:
// - Pengguna mengisi Username & Password lalu klik Login, komponen memanggil props login(id, password)
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginInput from './LoginInput';

describe('LoginInput', () => {
  it('calls login with entered credentials', async () => {
    const login = vi.fn();
    render(<LoginInput login={login} />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'user@example.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'secret');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(login).toHaveBeenCalledWith({ id: 'user@example.com', password: 'secret' });
  });
});