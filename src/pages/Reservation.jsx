import React, { useState, useEffect } from 'react';
import { Clock, User, AlertTriangle, Star, CheckCircle, Loader2, ChevronRight } from 'lucide-react';
import { BASE_URL } from '@/lib/utils';

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch orders with analysis
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${BASE_URL}/orders/chef?analyze=true`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid orders data format');
      }

      setOrders(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and setup refresh
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determine card border color based on sentiment
  const getCardBorderColor = (order) => {
    const sentiment = order.analysis?.sentiment?.toLowerCase();
    if (sentiment === 'negative') return 'border-l-4 border-red-500';
    if (sentiment === 'positive') return 'border-l-4 border-green-500';
    return 'border-l-4 border-gray-300';
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Get source badge color
  const getSourceBadgeColor = (source) => {
    switch (source) {
      case 'ai': return 'bg-blue-100 text-blue-800';
      case 'fallback': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Status update failed');
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kitchen Dashboard</h1>
            <p className="text-sm text-gray-500">
              Real-time order monitoring and preparation
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-blue-50 px-3 py-2 rounded-full">
              <Clock className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium text-blue-600">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Orders</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">All Caught Up!</h3>
            <p className="mt-2 text-sm text-gray-500">
              No pending orders at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-lg shadow overflow-hidden ${getCardBorderColor(order)}`}
              >
                {/* Order Header */}
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        Order #{order.orderNumber}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{order.orderTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'PREPARING'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                      {order.analysis?.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityBadgeColor(order.analysis.priority)}`}>
                          {order.analysis.priority.toUpperCase()} PRIORITY
                        </span>
                      )}
                      {order.analysis?.source && (
                        <span className={`px-2 py-1 rounded-full text-xs ${getSourceBadgeColor(order.analysis.source)}`}>
                          {order.analysis.source.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  {order.customerName && (
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <User className="h-3 w-3 mr-1" />
                      <span>{order.customerName}</span>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">ORDER ITEMS</h4>
                  <ul className="space-y-3">
                    {order.formattedItems.map((item, index) => (
                      <li key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-gray-500">${item.price?.toFixed(2)}</span>
                        </div>
                        {item.removedIngredients?.length > 0 && (
                          <div className="mt-1 text-xs text-red-500">
                            <span className="font-medium">REMOVED:</span>{' '}
                            {item.removedIngredients.join(', ')}
                          </div>
                        )}
                        {item.specialInstructions && (
                          <div className="mt-1 text-xs text-yellow-600 italic">
                            <span className="font-medium">NOTE:</span>{' '}
                            {item.specialInstructions}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Customer Analysis */}
                {order.analysis && (
                  <div className="bg-gray-50 p-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      CUSTOMER ANALYSIS
                    </h4>
                    <div className="bg-white p-3 rounded-md">
                      {/* Sentiment */}
                      <div className="flex items-center mb-2">
                        <span className="text-xs font-medium mr-2">SENTIMENT:</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          order.analysis.sentiment === 'positive'
                            ? 'bg-green-100 text-green-800'
                            : order.analysis.sentiment === 'negative'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.analysis.sentiment?.toUpperCase() || 'NEUTRAL'}
                        </span>
                      </div>

                      {/* Historical Data */}
                      {order.analysis.historicalData && (
                        <div className="mb-2">
                          <div className="flex items-center text-xs">
                            <span className="font-medium mr-2">AVG RATING:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(order.analysis.historicalData.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                              <span className="ml-1 text-xs">
                                ({order.analysis.historicalData.averageRating.toFixed(1)}/5)
                              </span>
                            </div>
                          </div>
                          <div className="text-xs mt-1">
                            <span className="font-medium">FEEDBACK COUNT:</span>{' '}
                            {order.analysis.historicalData.totalFeedback}
                          </div>
                        </div>
                      )}

                      {/* Feedback Samples */}
                      {order.analysis.feedbackSamples?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-xs font-medium">RECENT FEEDBACK:</span>
                          <ul className="mt-1 space-y-1">
                            {order.analysis.feedbackSamples.map((feedback, i) => (
                              <li key={i} className="text-xs">
                                <div className="flex items-start">
                                  <span className="font-medium mr-1">{feedback.foodItem}:</span>
                                  <span>{feedback.comment}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                  <Star className={`h-3 w-3 ${feedback.rating >= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-red-400'}`} />
                                  <span className="ml-1">{feedback.rating}/5</span>
                                  <span className="mx-2">•</span>
                                  <span>{feedback.date}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Recommendation */}
                      <div>
                        <span className="text-xs font-medium">CHEF RECOMMENDATION:</span>
                        <p className="text-xs mt-1 italic">
                          {order.analysis.recommendation}
                          {order.analysis.error && (
                            <span className="text-red-500 block mt-1">
                              Error: {order.analysis.error}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-3 bg-gray-50 flex justify-end gap-2">
                  {order.status === 'PENDING' && (
                    <button
                      onClick={() => updateStatus(order._id, 'preparing')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => updateStatus(order._id, 'ready')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
                    >
                      Mark as Ready
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefDashboard;