import React from 'react';
import { Check, X } from 'lucide-react';

interface StatusBadgeProps {
  isCompleted: boolean;
  text: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  isCompleted, 
  text,
  className = ''
}) => {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
        isCompleted ? 'bg-green-500' : 'bg-gray-300'
      }`}>
        {isCompleted ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <X className="w-4 h-4 text-gray-600" />
        )}
      </div>
      <span className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
        {text}
      </span>
    </div>
  );
};

export default StatusBadge;