import React, { useState } from 'react';
import useFormValidation from '@hooks/useFormValidation';

const ConfirmPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const { errors, validateInput } = useFormValidation();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleBlur = () => {
    validateInput('password', password);
  };

  return (
    <div className='my-2'>
      <input
        className='w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none'
        type='password'
        placeholder='Password'
        value={password}
        onChange={handlePasswordChange}
        onBlur={handleBlur}
      />
      {errors.password && <p className='text-red-500'>{errors.password}</p>}
    </div>
  );
};

export default ConfirmPassword;
