import React, { useState, useEffect } from 'react';
import { Clock, User, AlertTriangle, Star, CheckCircle, Loader2, ChevronRight, Info, ChefHat } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const orderDate = new Date(dateString);
    const diffInSeconds = Math.floor((currentTime - orderDate) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Fetch orders automatically
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://kuriftu-backend-l9gk.onrender.com/orders/chef');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid orders data format');
      }

      // Process orders to add formatted data
      const processedOrders = data.map(order => ({
        ...order,
        orderTime: getTimeAgo(order.createdAt),
        formattedItems: order.items.map(item => ({
          ...item,
          name: item.foodItemId?.name || item.name,
          price: item.foodItemId?.price || item.price,
          preparationTime: item.foodItemId?.preparationTime || 15,
          specialInstructions: item.specialInstructions || '',
          removedIngredients: item.removedIngredients || []
        }))
      }));

      setOrders(processedOrders);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setOrders([]);
      toast.error(`Error loading orders: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchOrders();
    
    // Set up polling every 30 seconds
    const pollingInterval = setInterval(fetchOrders, 30000);
    return () => clearInterval(pollingInterval);
  }, []);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://kuriftu-backend-l9gk.onrender.com/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Status update failed');
      
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error('Update error:', err);
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  // Determine card border color based on sentiment
  const getCardBorderColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'negative': return 'border-l-red-500';
      case 'positive': return 'border-l-green-500';
      default: return 'border-l-blue-500';
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'pending') return { 
      bg: 'bg-yellow-100', 
      text: 'text-yellow-800',
      icon: '⏱️'
    };
    if (statusLower === 'preparing') return { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800',
      icon: '👨‍🍳'
    };
    if (statusLower === 'ready') return { 
      bg: 'bg-green-100', 
      text: 'text-green-800',
      icon: '✅'
    };
    return { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800',
      icon: '❓'
    };
  };

  // Format preparation time
  const formatPrepTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate total preparation time for an order
  const getTotalPrepTime = (items) => {
    if (!items || !items.length) return 0;
    return items.reduce((total, item) => total + (item.preparationTime || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kitchen Dashboard</h1>
              <p className="text-sm text-gray-500">
                Real-time order monitoring and preparation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
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
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error Loading Orders</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
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
            {orders.map((order) => {
              const statusStyle = getStatusBadgeStyle(order.status);
              const totalPrepTime = getTotalPrepTime(order.formattedItems);
              
              return (
                <div
                  key={order._id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${getCardBorderColor(order.feedbackAnalysis?.sentiment)} transition-all hover:shadow-lg`}
                >
                  {/* Order Header */}
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                          {order.orderNumber || `#${order._id.toString().slice(-6).toUpperCase()}`}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{order.orderTime}</span>
                          <span className="mx-2">•</span>
                          <span>{formatPrepTime(totalPrepTime)} total</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}
                        >
                          <span>{statusStyle.icon}</span>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <User className="h-3 w-3 mr-1" />
                      <span>{order.customerName || 'Guest'}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">ORDER ITEMS</h4>
                    <ul className="space-y-3">
                      {order.formattedItems.map((item, index) => (
                        <li key={index} className="text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {item.quantity}x {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {formatPrepTime(item.preparationTime)}
                              </span>
                            </div>
                          </div>
                          
                          {item.removedIngredients?.length > 0 && (
                            <div className="mt-1 text-xs text-red-500">
                              <span className="font-medium">REMOVED:</span>{' '}
                              {item.removedIngredients.join(', ')}
                            </div>
                          )}
                          
                          {item.specialInstructions && (
                            <div className="mt-1 text-xs text-blue-600 italic">
                              <span className="font-medium">NOTE:</span>{' '}
                              {item.specialInstructions}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">TOTAL:</span>
                      <span className="font-bold">${order.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  {/* Customer Feedback Analysis */}
                  {order.feedbackAnalysis && (
                    <div className="bg-gray-50 p-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        CUSTOMER FEEDBACK ANALYSIS
                      </h4>
                      
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        {/* Sentiment */}
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium mr-2">SENTIMENT:</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.feedbackAnalysis.sentiment === 'positive'
                              ? 'bg-green-100 text-green-800'
                              : order.feedbackAnalysis.sentiment === 'negative'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.feedbackAnalysis.sentiment?.toUpperCase() || 'NEUTRAL'}
                          </span>
                        </div>

                        {/* Recommendations */}
                        {order.feedbackAnalysis.recommendations?.length > 0 && (
                          <div>
                            <div className="text-xs font-medium mb-1">RECOMMENDATIONS:</div>
                            <ul className="text-xs text-gray-700 space-y-1">
                              {order.feedbackAnalysis.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="mr-1">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="p-3 bg-gray-50 flex justify-end gap-2">
                    {order.status.toLowerCase() === 'pending' && (
                      <button
                        onClick={() => updateStatus(order._id, 'preparing')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status.toLowerCase() === 'preparing' && (
                      <button
                        onClick={() => updateStatus(order._id, 'ready')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        Mark as Ready
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChefDashboard;
