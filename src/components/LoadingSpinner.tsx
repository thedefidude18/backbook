interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#7440FF' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <img
      src="/icons/bantahblue.svg"
      alt="Loading..."
      className={`animate-pulse ${sizeClasses[size]}`}
      style={{ filter: color !== '#7440FF' ? `brightness(0) saturate(100%) ${color}` : 'none' }}
    />
  );
};

export default LoadingSpinner;


