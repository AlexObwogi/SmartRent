import React, { useState } from 'react';

const StarRating = ({ rating, onRate, readonly }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || rating) ? 'star-filled' : 'star-empty'}`}
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
      {rating > 0 && (
        <span className="rating-number">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default StarRating;