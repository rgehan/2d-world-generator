import React from 'react';

import './Slider.scss';

interface SliderProps {
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: Function;
}

export const Slider = ({
  name,
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: SliderProps) => (
  <div className="Slider">
    <label htmlFor={name} className="Slider__Label">
      {label}
    </label>
    <div className="Slider__InputContainer">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={e => onChange(name, +e.target.value)}
        id={name}
        className="Slider__InputContainer-Input"
      />
      <span className="Slider__InputContainer-Value">{value}</span>
    </div>
  </div>
);
