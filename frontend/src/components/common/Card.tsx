import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  footer?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  onClick,
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className} ${onClick ? 'cursor-pointer transition-transform hover:scale-[1.02]' : ''}`}
      onClick={onClick}
    >
      {title && (
        <div className={`px-4 py-3 border-b border-gray-200 ${headerClassName}`}>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`px-4 py-3 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;