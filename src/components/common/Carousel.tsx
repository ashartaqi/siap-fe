"use client";
import React from "react";

export interface CarouselSharedProps {
  currentIndex: number;
  totalItems: number;
  onIndexChange: (index: number) => void;
}

export function CarouselHeader({
  title,
  currentIndex,
  totalItems,
  onIndexChange,
  className = "mb-4",
}: CarouselSharedProps & { title: React.ReactNode; className?: string }) {
  const navigate = (dir: number) => {
    onIndexChange((currentIndex + dir + totalItems) % totalItems);
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {title}
      {totalItems > 1 && (
        <div className="flex gap-1">
          <button
            onClick={() => navigate(-1)}
            className="w-7 h-7 rounded bg-surface-container-highest border border-[#474845]/20 text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container transition-all flex items-center justify-center text-xs"
          >
            ←
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-7 h-7 rounded bg-surface-container-highest border border-[#474845]/20 text-on-surface-variant hover:border-primary-container/40 hover:text-primary-container transition-all flex items-center justify-center text-xs"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export function CarouselDots({
  currentIndex,
  totalItems,
  onIndexChange,
  className = "",
}: CarouselSharedProps & { className?: string }) {
  if (totalItems <= 1) return null;
  return (
    <div className={`flex justify-center gap-1.5 ${className}`}>
      {Array.from({ length: totalItems }).map((_, i) => (
        <button
          key={i}
          onClick={() => onIndexChange(i)}
          className={`h-1 rounded-full transition-all duration-300 ${
            i === currentIndex
              ? "w-4 bg-primary-container"
              : "w-1 bg-[#474845]/40"
          }`}
        />
      ))}
    </div>
  );
}

export function Carousel({
  title,
  currentIndex,
  totalItems,
  onIndexChange,
  children,
  dotsContainerClassName,
  headerClassName,
}: CarouselSharedProps & {
  title: React.ReactNode;
  children: React.ReactNode;
  dotsContainerClassName?: string;
  headerClassName?: string;
}) {
  return (
    <div>
      <CarouselHeader
        title={title}
        currentIndex={currentIndex}
        totalItems={totalItems}
        onIndexChange={onIndexChange}
        className={headerClassName}
      />
      {children}
      <CarouselDots
        currentIndex={currentIndex}
        totalItems={totalItems}
        onIndexChange={onIndexChange}
        className={dotsContainerClassName}
      />
    </div>
  );
}
