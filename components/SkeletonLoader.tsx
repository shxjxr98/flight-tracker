import React from 'react';

interface SkeletonLoaderProps {
    className?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    style?: React.CSSProperties;
}

export default function SkeletonLoader({
    className = '',
    width = '100%',
    height = '1rem',
    borderRadius = '0.25rem',
    style = {}
}: SkeletonLoaderProps) {
    return (
        <div
            className={`skeleton-loader ${className}`}
            style={{
                width,
                height,
                borderRadius,
                ...style
            }}
            aria-hidden="true"
        />
    );
}
