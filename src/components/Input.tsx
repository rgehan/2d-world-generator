import React from 'react';

import './Input.scss';

interface InputProps {
  name: string;
  label: string;
  value: number;
  onChange: Function;
}

export const Input = ({ name, label, value, onChange }: InputProps) => (
  <div className="Input">
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={e => onChange(name, +e.target.value)}
    />
  </div>
);
