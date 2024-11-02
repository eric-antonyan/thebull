import React, { useState, MouseEvent } from 'react';
import './RippleButton.css';

interface RippleButtonProps {
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
}

const Ripple: React.FC<RippleButtonProps> = ({ onClick, children }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number }[]>([]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipples((prev) => [...prev, { x, y }]);

    // Call the onClick prop if it exists
    if (onClick) {
      onClick(event);
    }

    // Remove the ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600); // Match this with your CSS animation duration
  };

  return (
    <div className="ripple-button" onClick={handleClick}>
      {children}
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </div>
  );
};

export default Ripple;
