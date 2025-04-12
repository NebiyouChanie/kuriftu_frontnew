
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Banknote, 
  ArrowUp, 
  ShoppingCartIcon, 
  NotebookPen, 
  UserPlus,
  Star,
  Utensils,
  Users,
  PieChart,
  BarChart2,
  Trophy
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

// Color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
        const response = await axios.get(`${BASE_URL}/analytics/dashboard`);
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
            Loading Dashboard...
          </h2>
          <div className="flex gap-8 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
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

  // Prepare data for charts
  const foodByCategoryData = data?.foodCategoryAnalysis?.data?.map(item => ({
    name: item._id,
    rating: item.averageRating.toFixed(1),
    items: item.totalItems,
    topItem: item.topRatedItem.name
  }));

  const topFoodsData = data?.foodRatingAnalysis?.data?.foods
    ?.slice(0, 5)
    .map(food => ({
      name: food.name,
      rating: food.rating.toFixed(1),
      reviews: food.totalFeedback
    }));

  const topWaitersData = data?.waiterRatingAnalysis?.data?.waiters
    ?.slice(0, 5)
    .map(waiter => ({
      name: waiter.name,
      rating: waiter.averageRating.toFixed(1),
      reviews: waiter.totalFeedback
    }));

  const orderStatusData = data?.monthlyOrderAnalysis?.data?.statusDistribution?.map(status => ({
    name: status._id,
    value: status.count
  }));




  return (
    <div className="p-5 flex flex-col gap-12">
      {/* Overview Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl text-black">Restaurant Overview</h2>
        <div className="flex gap-8 flex-wrap">
          {[
            {
              label: "Total Food Categories",
              value: data?.foodCategoryAnalysis?.data?.length || 0,
              icon: <Utensils className="text-purple-600" size={24} />,
              color: "bg-purple-100"
            },
            {
              label: "Average Food Rating",
              value: data?.foodRatingAnalysis?.data?.overallStats?.averageRating?.toFixed(1) || 0,
              icon: <Star className="text-yellow-500" size={24} />,
              color: "bg-yellow-100"
            },
            {
              label: "Average Waiter Rating",
              value: data?.waiterRatingAnalysis?.data?.overallStats?.averageRating?.toFixed(1) || 0,
              icon: <Users className="text-blue-500" size={24} />,
              color: "bg-blue-100"
            },
            {
              label: "This Month Orders",
              value: data?.monthlyOrderAnalysis?.data?.dailyStats?.reduce((sum, day) => sum + day.totalOrders, 0) || 0,
              icon: <ShoppingCartIcon className="text-green-600" size={24} />,
              color: "bg-green-100"
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex flex-col gap-4 justify-between w-72 p-6 border rounded-lg ${item.color}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-2xl text-gray-800">
                    {item.value}
                  </p>
                  <p className="text-gray-600 text-sm">{item.label}</p>
                </div>
                <div className="p-3 bg-white rounded-full shadow-sm">
                  {item.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Food Ratings by Category */}
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-purple-600" />
            <h2 className="font-semibold text-lg">Food Ratings by Category</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={foodByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value, name, props) => {
                    if (name === 'rating') return [`${value}/5`, 'Average Rating'];
                    if (name === 'items') return [value, 'Total Items'];
                    return [value, name];
                  }}
                />
                <Bar dataKey="rating" fill="#8884d8" name="Average Rating">
                  {foodByCategoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <p>Top in each category: {foodByCategoryData?.map(item => 
              `${item.topItem} (${item.rating})`).join(', ')}
            </p>
          </div>
        </div>




        {/* Order Status Distribution */}
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <PieChart className="text-green-600" />
            <h2 className="font-semibold text-lg">Order Status This Month</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {orderStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value, name, props) => [`${value} orders`, props.payload.name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Rated Foods */}
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <h2 className="font-semibold text-lg">Top Rated Menu Items</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topFoodsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  name="Rating"
                  dataKey="rating"
                  stroke="#FFBB28"
                  fill="#FFBB28"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value, name, props) => [`${value}/5 rating`, `${props.payload.reviews} reviews`]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            {topFoodsData?.map((food, index) => (
              <div key={index} className="text-center">
                <p className="font-medium">{food.name}</p>
                <p>{food.rating}/5</p>
              </div>
            ))}
          </div>
        </div>




        {/* Top Rated Waiters */}
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="text-blue-500" />
            <h2 className="font-semibold text-lg">Top Rated Waiters</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWaitersData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value, name, props) => [`${value}/5 rating`, `${props.payload.reviews} reviews`]}
                />
                <Bar dataKey="rating" fill="#82ca9d" name="Rating">
                  {topWaitersData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            {topWaitersData?.map((waiter, index) => (
              <div key={index} className="text-center">
                <p className="font-medium">{waiter.name.split(' ')[0]}</p>
                <p>{waiter.rating}/5</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-xl text-black">Quick Actions</h2>
        <div className="flex gap-8 flex-wrap">
          {[
            { to: "orders/add-order", icon: <ShoppingCartIcon />, label: "Place Order", color: "bg-blue-100" },
            { to: "reservation/add-reservation", icon: <NotebookPen />, label: "Place Reservation", color: "bg-green-100" },
            { to: "customers/add-customer", icon: <UserPlus />, label: "Add Customer", color: "bg-purple-100" },
            { to: "menu/add-food-item", icon: <Utensils />, label: "Add Food Item", color: "bg-yellow-100" },
          ].map((action, index) => (
            <Link key={index} to={action.to}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex gap-4 items-center px-8 py-5 border rounded-lg ${action.color} hover:shadow-md transition-all duration-300`}
              >
                <div className="bg-white rounded-full w-fit p-3 text-primary shadow-sm">
                  {action.icon}
                </div>
                <p className="font-bold text-base">{action.label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;