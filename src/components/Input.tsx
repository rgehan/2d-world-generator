import React from 'react';
import cx from 'classnames';

import './Input.scss';

interface InputProps {
  name: string;
  label: string;
  value: number;
  onChange: Function;
  className?: string;
}

export const Input = ({ name, label, value, onChange, className }: InputProps) => (
  <div className={cx('Input', className)}>
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(name, +e.target.value)}
    />
  </div>
);
