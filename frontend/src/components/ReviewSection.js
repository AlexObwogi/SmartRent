import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

const ReviewSection = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  // Sample reviews for testing
  const sampleReviews = {
    '1': [
      {
        _id: 'r1',
        user: { name: 'Alice Johnson' },
        rating: 5,
        comment: 'Amazing apartment! The views are incredible and the location is perfect. Highly recommend!',
        createdAt: '2024-03-01',
      },
      {
        _id: 'r2',
        user: { name: 'Bob Williams' },
        rating: 4,
        comment: 'Great place to live. Only downside is the parking situation, but everything else is fantastic.',
        createdAt: '2024-02-20',
      },
      {
        _id: 'r3',
        user: { name: 'Carol Davis' },
        rating: 5,
        comment: 'Loved my time here! The landlord is responsive and the amenities are top-notch.',
        createdAt: '2024-02-15',
      },
    ],
    '2': [
      {
        _id: 'r4',
        user: { name: 'David Brown' },
        rating: 4,
        comment: 'Beautiful house with a great backyard. Perfect for families.',
        createdAt: '2024-03-05',
      },
      {
        _id: 'r5',
        user: { name: 'Emma Wilson' },
        rating: 3,
        comment: 'Nice house but a bit far from the city center. Good for quiet living.',
        createdAt: '2024-02-28',
      },
    ],
    '3': [
      {
        _id: 'r6',
        user: { name: 'Frank Miller' },
        rating: 5,
        comment: 'Luxury living at its best! The pool and ocean views are breathtaking.',
        createdAt: '2024-03-10',
      },
    ],
    '4': [
      {
        _id: 'r7',
        user: { name: 'Grace Lee' },
        rating: 4,
        comment: 'Great value for the price. Perfect for students.',
        createdAt: '2024-03-08',
      },
    ],
    '5': [
      {
        _id: 'r8',
        user: { name: 'Henry Taylor' },
        rating: 5,
        comment: 'The penthouse experience is unmatched. Worth every penny!',
        createdAt: '2024-03-12',
      },
    ],
    '6': [
      {
        _id: 'r9',
        user: { name: 'Ivy Chen' },
        rating: 4,
        comment: 'Charming cottage with easy beach access. Loved the porch!',
        createdAt: '2024-03-07',
      },
    ],
  };

  useEffect(() => {
    // Load reviews - use sample data for now
    const propertyReviews = sampleReviews[propertyId] || [];
    
    // Also load any user-added reviews from localStorage
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${propertyId}`)) || [];
    
    setReviews([...propertyReviews, ...storedReviews]);
    // eslint-disable-next-line
  }, [propertyId]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    const newReview = {
      _id: `r_${Date.now()}`,
      user: { name: user?.name || 'Anonymous' },
      rating: rating,
      comment: comment,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Save to localStorage
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${propertyId}`)) || [];
    storedReviews.push(newReview);
    localStorage.setItem(`reviews_${propertyId}`, JSON.stringify(storedReviews));

    // Update state
    setReviews([...reviews, newReview]);
    setRating(0);
    setComment('');
    setShowForm(false);
    setSuccess('Review submitted successfully!');

    setTimeout(() => setSuccess(''), 3000);
  };

  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      breakdown[review.rating]++;
    });
    return breakdown;
  };

  const breakdown = getRatingBreakdown();

  return (
    <div className="review-section">
      <h3>Reviews & Ratings</h3>

      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="rating-overview">
          <div className="rating-big-number">
            {getAverageRating().toFixed(1)}
          </div>
          <StarRating rating={getAverageRating()} readonly={true} />
          <p className="review-count">{reviews.length} reviews</p>
        </div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="breakdown-row">
              <span className="breakdown-star">{star} ★</span>
              <div className="breakdown-bar">
                <div
                  className="breakdown-fill"
                  style={{
                    width: reviews.length > 0
                      ? `${(breakdown[star] / reviews.length) * 100}%`
                      : '0%',
                  }}
                ></div>
              </div>
              <span className="breakdown-count">{breakdown[star]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Add Review Button/Form */}
      {user ? (
        <div className="add-review">
          {!showForm ? (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              ✍️ Write a Review
            </button>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <h4>Your Review</h4>
              <div className="form-group">
                <label>Rating *</label>
                <StarRating rating={rating} onRate={setRating} readonly={false} />
              </div>
              <div className="form-group">
                <label>Your Review *</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this property..."
                  rows="4"
                  required
                />
              </div>
              <div className="form-buttons">
                <button type="submit">Submit Review</button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowForm(false);
                    setRating(0);
                    setComment('');
                    setError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="login-prompt">
          Please <a href="/login">login</a> to write a review
        </p>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4>{review.user.name}</h4>
                    <p className="review-date">{review.createdAt}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} readonly={true} />
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;