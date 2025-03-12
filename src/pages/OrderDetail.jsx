import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Banknote, ShoppingCart, PhoneCall, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/StatusBadge";
import { BASE_URL } from "@/lib/utils";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders/${orderId}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching order data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [orderId]);

  if (loading) return <Skeleton />;

  return (
    <div className="p-6 max-w-screen-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-base font-semibold text-gray-800">Order Details</h2>
        <StatusBadge status={order.orderStatus} />
      </div>

      {/* Order Date & Time */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Order Date & Time:</p>
        <p className="text-md font-medium text-gray-800">
          {new Date(order.createdAt).toLocaleString()} {/* Formats the date and time */}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Info</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Name:</p>
              <p className="text-md font-medium text-gray-800">{order.customerInfo.name} {order.customerInfo.lastName}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Phone:</p>
              <p className="text-md font-medium text-gray-800">{order.customerInfo.phoneNumber}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Location:</p>
              <p className="text-md font-medium text-gray-800">{order.customerInfo.subcity}, {order.customerInfo.area}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ordered Items</h3>
          <div className="flex flex-col gap-4">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4 mr-4">
                  <img src={item?.foodItem?.imageUrl} alt={item?.foodItem?.name} className="w-16 h-16 rounded-md object-cover" />
                  <div>
                    <p className="text-md font-semibold text-gray-800">{item?.foodItem?.name}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-lg font-medium text-gray-800">{item.price} Birr</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="flex justify-between items-center border-t pt-6">
          <div>
            <p className="text-sm text-gray-500">Order Type</p>
            <p className="text-base font-medium text-gray-800">{order.orderType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-semibold text-gray-800">
              {order.items.reduce((total, item) => total + item.price * item.quantity, 0)} Birr
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      {order.orderType === "Delivery" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Shipping Information</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <MapPin className="text-primary" />
              <div>
                <p className="text-md font-normal text-gray-800">
                  <span className="text-gray-500">Delivery to:</span> {order.customerInfo.subcity}, {order.customerInfo.area}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PhoneCall className="text-primary" />
              <p className="text-md font-normal text-gray-500">
                Contact Customer: <a href={`tel:${order.customerInfo.phoneNumber}`} className="text-primary underline">{order.customerInfo.phoneNumber}</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
