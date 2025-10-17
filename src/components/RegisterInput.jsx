import React from 'react';
import PropTypes from 'prop-types';
import useInput from '../hooks/useInput';

function RegisterInput({ register }) {
  const [name, onNameChange] = useInput('');
  const [id, onIdChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const isEmailValid = /.+@.+\..+/.test(id);
  const isPasswordValid = password.length >= 6;
  const canSubmit = name.trim() && isEmailValid && isPasswordValid;

  function onSubmit() {
    if (!canSubmit) return;
    register({ name, id, password });
  }

  return (
    <form className="register-input">
      <input type="text" value={name} onChange={onNameChange} placeholder="Name" />
      <input type="email" value={id} onChange={onIdChange} placeholder="Email" />
      <input type="password" value={password} onChange={onPasswordChange} placeholder="Password (min 6)" />
      <button type="button" disabled={!canSubmit} onClick={onSubmit}>Register</button>
    </form>
  );
}

RegisterInput.propTypes = {
  register: PropTypes.func.isRequired,
};

export default RegisterInput;
