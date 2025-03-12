import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Banknote, ArrowUp, ShoppingCartIcon, NotebookPen, UserPlus } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Animated Number Component
function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = setInterval(() => {
      setCount((prev) => {
        const step = (value - prev) / 4; 
        return prev + step > value ? value : prev + step;
      });
    }, 50);

    return () => clearInterval(controls);
  }, [value]);

  return (
    <motion.span
      animate={{ opacity: [0, 1], y: [5, 0] }}
      transition={{ duration: 0.5 }}
      className="font-bold"
    >
      {Math.round(count)}
    </motion.span>
  );
}

// Dashboard Component
function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/dashboard`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-12">
        {/* Skeleton Loaders */}
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-base text-black">
            This Month's Overview
          </h2>
          <div className="flex gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 w-72 p-4 border rounded-md bg-green-50"
              >
                <Skeleton className="w-12 h-12" />
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-16 h-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-12">
      {/* Overview */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-base text-black">This Month's Overview</h2>
        <div className="flex gap-8">
          {[
            {
              label: "Total Dine-in Sales",
              value: data?.totalDineInSales,
              change: data?.dineInSalesChange,
            },
            {
              label: "Total Delivery Sales",
              value: data?.totalDeliverySales,
              change: data?.deliverySalesChange,
            },
            {
              label: "Dine-in Orders",
              value: data?.dineInOrders,
              change: data?.dineInOrdersChange,
            },
            {
              label: "Delivery Orders",
              value: data?.deliveryOrders,
              change: data?.deliveryOrdersChange,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4 justify-between w-72 p-4 border rounded-md bg-green-50"
            >
              <div className="flex gap-4 justify-between items-center">
                <div>
                <p className="font-bold text-base text-green-700">
                  <AnimatedNumber value={item.value} /> {index < 2 ? "Birr" : ""}
                </p>
                  <p className="text-textgray text-[14px]">{item.label}</p>
                </div>
                <div className={`flex gap-2 items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  <p className="font-semibold">
                    <AnimatedNumber value={item.change} />%
                  </p>
                  <ArrowUp size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-base text-black">Quick Actions</h2>
        <div className="flex gap-8">
          {[
            { to: "orders/add-order", icon: <ShoppingCartIcon />, label: "Place Order" },
            { to: "reservation/add-reservation", icon: <NotebookPen />, label: "Place Reservation" },
            { to: "customers/add-customer", icon: <UserPlus />, label: "Add Customer" },
          ].map((action, index) => (
            <Link key={index} to={action.to}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex gap-4 items-center px-10 py-6 border rounded-md hover:bg-secondary transition-transform duration-300 ease-in-out"
              >
                <div className="bg-secondary rounded-full w-fit p-4 text-primary">
                  {action.icon}
                </div>
                <p className="font-bold text-base">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="flex flex-col gap-4 lg:w-1/3">
        <h2 className="font-semibold text-base text-black">Recent Orders</h2>
        <div className="flex flex-col gap-4 border px-5 py-8 rounded-md">
          {data?.recentOrders.map((order, index) => (
            <Link key={index} to={`/orders/${order._id}/detail`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex justify-between items-center"
              >
                <div className="flex gap-2 items-center">
                  <div className="h-16 w-16 bg-slate-100 rounded-md">
                    <img src={order.items[0]?.foodItem?.imageUrl} className="w-full h-full" alt="" />
                  </div>
                  <div className="flex-col">
                    <h3 className="font-semibold">
                      {order.items.map((item) => item.foodItem?.name).join(", ")}
                    </h3>
                    <p className="text-textgray text-[16px]">
                      {order.customerInfo?.subcity}, {order.customerInfo?.area}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <StatusBadge status={order?.orderStatus} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
