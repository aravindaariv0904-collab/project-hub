'use client'

import { Star } from 'lucide-react'

export default function RatingStars({ rating, setRating, readOnly = false, size = 24 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && setRating && setRating(star)}
          className={`transition-all duration-150 ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-125 active:scale-95'
          }`}
          title={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={star <= (rating || 0)
              ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
              : 'fill-gray-100 text-gray-200'
            }
          />
        </button>
      ))}
    </div>
  )
}
