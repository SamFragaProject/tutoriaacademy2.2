import React from 'react';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', style }) => {
  return (
    <div className={`ta-skeleton ${className}`} style={style} />
  );
};

export default Skeleton;