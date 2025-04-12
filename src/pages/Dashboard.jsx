import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCartIcon, 
  Utensils,
  Users,
  PieChart,
  BarChart2,
  Trophy,
  Star
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

// Dashboard Component
function Dashboard() {
  const [foodRating, setFoodRating] = useState(null);
  const [waiterRating, setWaiterRating] = useState(null);
  const [topWaiters, setTopWaiters] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch food ratings
        const foodResponse = await axios.get(`${BASE_URL}/waiters//overall-rating`);
        setFoodRating(foodResponse.data);
        
        // Fetch waiter ratings
        const waiterResponse = await axios.get(`${BASE_URL}/waiters/overall-waiters`);
        setWaiterRating(waiterResponse.data);
        
        // For demo purposes, creating mock data for top waiters and foods
        // In a real app, you would fetch these from your API
        setTopWaiters([
          { name: "John Doe", rating: 4.5, reviews: 12 },
          { name: "Jane Smith", rating: 4.3, reviews: 8 },
          { name: "Mike Johnson", rating: 4.1, reviews: 15 },
          { name: "Sarah Williams", rating: 3.9, reviews: 7 },
          { name: "David Brown", rating: 3.8, reviews: 9 }
        ]);
        
        setTopFoods([
          { name: "Margherita Pizza", rating: 4.7, reviews: 25 },
          { name: "Pasta Carbonara", rating: 4.6, reviews: 18 },
          { name: "Caesar Salad", rating: 4.5, reviews: 15 },
          { name: "Tiramisu", rating: 4.4, reviews: 12 },
          { name: "Grilled Salmon", rating: 4.3, reviews: 10 }
        ]);
        
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
      {/* Overview Cards */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl text-black">Restaurant Overview</h2>
        <div className="flex gap-8 flex-wrap">
          {[
            {
              label: "Average Food Rating",
              value: foodRating?.averageRating || 0,
              icon: <Star className="text-yellow-500" size={24} />,
              color: "bg-yellow-100"
            },
            {
              label: "Total Food Reviews",
              value: foodRating?.totalReviews || 0,
              icon: <Utensils className="text-green-600" size={24} />,
              color: "bg-green-100"
            },
            {
              label: "Average Waiter Rating",
              value: waiterRating?.averageRating || 0,
              icon: <Users className="text-blue-500" size={24} />,
              color: "bg-blue-100"
            },
            {
              label: "Total Waiters",
              value: waiterRating?.totalWaiters || 0,
              icon: <Users className="text-purple-600" size={24} />,
              color: "bg-purple-100"
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
        {/* Top Rated Foods */}
        <div className="flex flex-col gap-4 p-6 border rounded-lg bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            <h2 className="font-semibold text-lg">Top Rated Menu Items</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topFoods}>
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
            {topFoods?.map((food, index) => (
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
              <BarChart data={topWaiters}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  formatter={(value, name, props) => [`${value}/5 rating`, `${props.payload.reviews} reviews`]}
                />
                <Bar dataKey="rating" fill="#82ca9d" name="Rating">
                  {topWaiters?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            {topWaiters?.map((waiter, index) => (
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
