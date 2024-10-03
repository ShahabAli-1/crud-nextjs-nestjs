import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  label: string;
  className: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  label,
  className,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  );
};

export default ActionButton;
