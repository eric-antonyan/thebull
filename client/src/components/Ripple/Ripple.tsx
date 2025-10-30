import React, { useState, MouseEvent } from 'react';
import './RippleButton.css';

interface RippleButtonProps {
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
  className?: string; // Optional className for additional styles
}

const Ripple: React.FC<RippleButtonProps> = ({ onClick, children, className }) => {
  const [ripples, setRipples] = useState<{ x: number; y: number }[]>([]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left; // X position relative to button
    const y = event.clientY - rect.top;   // Y position relative to button

    // Set the new ripple position
    setRipples((prev) => [...prev, { x, y }]);

    // Call the onClick prop if it exists
    if (onClick) {
      onClick(event);
    }

    // Remove the ripple after animation duration
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 1400); // Match this with your CSS animation duration
  };

  return (
      <div className={`ripple-btn ${className}`} onClick={handleClick}>
        {children}
        {ripples.map((ripple, index) => (
            <span
                key={index}
                className="ripple"
                style={{
                  left: ripple.x - 50, // Centering ripple (half of width)
                  top: ripple.y - 50,  // Centering ripple (half of height)
                  width: '100px',      // Ripple size
                  height: '100px',     // Ripple size
                }}
            />
        ))}
      </div>
  );
};

export default Ripple;
