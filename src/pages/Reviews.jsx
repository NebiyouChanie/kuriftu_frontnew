import React, { useState, useEffect } from 'react';
import { Star, Filter, ChevronDown, ChevronUp, Reply, MessageSquare, Loader2 } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 }
  });
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReview, setExpandedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5001/api/orders/analytics/satisfaction');
        
        const formattedReviews = response.data.recentFeedback.map((feedback) => ({
          id: feedback._id,
          foodItemId: feedback.foodItemId,
          customerName: feedback.user || 'Anonymous',
          date: format(new Date(feedback.date), 'MM/dd/yyyy'),
          rating: feedback.rating,
          comment: feedback.comment,
          sentiment: feedback.sentiment,
          foodItem: feedback.foodItem,
          replied: !!feedback.reply,
          reply: feedback.reply || ''
        }));

        setStats({
          averageRating: response.data.metrics.averageRating,
          totalReviews: response.data.metrics.totalReviews,
          sentimentDistribution: response.data.metrics.sentimentDistribution
        });

        setReviews(formattedReviews);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'new') {
      const reviewDate = new Date(review.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return reviewDate > oneWeekAgo;
    }
    if (filter === 'not-replied') return !review.replied;
    if (filter === 'replied') return review.replied;
    if (filter === 'negative') return review.sentiment === 'negative';
    return true;
  });

  const handleReply = async (reviewId, foodItemId) => {
    try {
      setIsSubmittingReply(true);
      await axios.post(`http://localhost:5001/api/orders/food-items/${foodItemId}/feedback/${reviewId}/reply`, { 
        reply: replyText 
      });
      
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, replied: true, reply: replyText }
          : review
      ));
      
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        fill={i < rating ? 'orange' : 'none'} 
        stroke='orange' 
        size={16} 
        className="inline"
      />
    ));
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <p>Error loading reviews: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-primary text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Rating</h3>
          <p className="text-2xl font-bold">
            {stats.averageRating.toFixed(1)}/5
          </p>
          <div className="mt-1">
            {renderStars(stats.averageRating)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Reviews</h3>
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Sentiment</h3>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex justify-between">
              <span className="text-green-600">Positive</span>
              <span>{stats.sentimentDistribution.positive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Neutral</span>
              <span>{stats.sentimentDistribution.neutral}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Negative</span>
              <span>{stats.sentimentDistribution.negative}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'not-replied', 'replied', 'negative'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews found matching your criteria
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="font-semibold text-gray-600">
                    {review.customerName.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold">{review.customerName}</h3>
                      <p className="text-sm text-gray-500">
                        {review.date} • {review.foodItem}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(
                        review.sentiment
                      )} self-start`}
                    >
                      {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium">{review.rating.toFixed(1)}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>

                  <div className="mb-3">
                    <p className="text-gray-700">
                      {expandedReview === review.id
                        ? review.comment
                        : review.comment.length > 150
                        ? `${review.comment.substring(0, 150)}...`
                        : review.comment}
                    </p>
                    {review.comment.length > 150 && (
                      <button
                        onClick={() =>
                          setExpandedReview(
                            expandedReview === review.id ? null : review.id
                          )
                        }
                        className="text-primary text-sm mt-1 flex items-center gap-1"
                      >
                        {expandedReview === review.id ? (
                          <>
                            <ChevronUp size={16} />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            Show More
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {review.replied && (
                    <div className="bg-blue-50 p-3 rounded-md mb-3">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <MessageSquare size={16} />
                        <span className="font-medium">Your reply</span>
                      </div>
                      <p className="text-gray-700">{review.reply}</p>
                    </div>
                  )}

                  {replyingTo === review.id ? (
                    <div className="mt-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-2 border rounded-md mb-2 text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReply(review.id, review.foodItemId)}
                          disabled={isSubmittingReply}
                          className="bg-primary text-white py-1 px-4 rounded-md text-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          {isSubmittingReply && (
                            <Loader2 className="animate-spin h-4 w-4" />
                          )}
                          Send
                        </button>
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyText('');
                          }}
                          className="bg-gray-200 text-gray-700 py-1 px-4 rounded-md text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    !review.replied && (
                      <button
                        onClick={() => setReplyingTo(review.id)}
                        className="text-primary font-medium flex items-center gap-1 text-sm mt-2"
                      >
                        <Reply size={16} />
                        Reply
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;