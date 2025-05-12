"use client";

import { useState } from "react";

interface ReviewStarsProps {
  initialRating?: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
}

export default function ReviewStars({
  initialRating = 0,
  onChange,
  size = "md",
  interactive = true,
}: ReviewStarsProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (newRating: number) => {
    if (!interactive) return;

    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  const sizeClass = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`focus:outline-none transition-transform ${interactive ? "hover:scale-110" : ""}`}
          disabled={!interactive}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={star <= (hoverRating || rating) ? "var(--color-primary)" : "none"}
            stroke={star <= (hoverRating || rating) ? "var(--color-primary)" : "currentColor"}
            className={sizeClass[size]}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={star <= (hoverRating || rating) ? "0" : "1.5"}
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
