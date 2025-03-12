import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '@/lib/utils'; // Your base URL
import StatusBadge from '@/components/StatusBadge';

const CustomerDetail = () => {
  const { userId } = useParams(); // Assuming you're using React Router
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${userId}`);
        setCustomerData(response.data.data); // ✅ Corrected to match API response
      } catch (error) {
        console.error('Error fetching customer detail', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [userId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl bg-white rounded-lg shadow-md p-8">
        {/* Customer Info */}

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
          <div className="mt-4">
            <p className="text-gray-600"><strong>Name:</strong> {customerData?.customer?.firstName} {customerData?.customer?.lastName}</p>
            {/* Email is optional since it's not in the API response */}
            {customerData?.customer?.email && (
              <p className="text-gray-600"><strong>Email:</strong> {customerData.customer.email}</p>
            )}
            <p className="text-gray-600"><strong>Phone:</strong> {customerData?.customer?.phoneNumber}</p>
            <p className="text-gray-600"><strong>Address:</strong> {customerData?.customer?.subcity}, {customerData?.customer?.area}</p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order History</h2>
          <div className="space-y-4">
            {customerData?.orders?.length > 0 ? (
              customerData.orders.map((order) => (
                <Link to={`/orders/${order._id}/detail`}>
                <div
                  key={order._id}
                  className="border p-4 mb-4 rounded-md shadow-sm bg-gray-50 flex justify-between items-center"
                  >
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800">
                      {order.items.map((item) => item.foodItem?.name).join(', ')}
                    </h3>
                    <p className="text-gray-600">
                      <strong>Order Type:</strong>{' '}
                      <span className={`font-semibold ${order.orderType === 'Delivery' ? 'text-blue-600' : 'text-green-600'}`}>
                        {order.orderType}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <strong>Status:</strong> <StatusBadge status={order.orderStatus} />
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">
                      {order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)} Birr
                    </p>
                    <p className="text-sm text-gray-500">
                      Placed on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No orders found for this customer.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
