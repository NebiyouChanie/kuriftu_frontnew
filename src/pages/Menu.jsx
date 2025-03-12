import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BASE_URL } from "@/lib/utils";
import { useNavigate, Link } from 'react-router-dom';

function Menu() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, menuItemsRes] = await Promise.all([
          fetch(`${BASE_URL}/categories`),
          fetch(`${BASE_URL}/foodItems`)
        ]);
        const categoriesData = await categoriesRes.json();
        const menuItemsData = await menuItemsRes.json();
        
        if (categoriesData.success) setCategories(categoriesData.data);
        if (menuItemsData.success) setMenuItems(menuItemsData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredMenuItems = menuItems.filter(
    (item) =>
      (!selectedCategory || item.category._id === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <Input 
            placeholder="Search" 
            className="pr-10" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className='flex gap-2'>

         <button className="bg-secondary text-primary flex gap-2 py-2 px-[20px] border-1 border-primary rounded-md font-semibold ms-auto"
            onClick={() => navigate("categories")}
            >
            Manage Categories
         </button>
         <button className="bg-primary text-white flex gap-2 py-2 px-[20px] rounded-md font-semibold ms-auto"
            onClick={() => navigate("add-menu-item")}
            >
            <PlusCircle />
            Add Menu Item
         </button>
          </div>
      </div>

      <div className="flex gap-2 mb-2">
        {loading ? (
          <Skeleton className="w-24 h-10 rounded-md" />
        ) : (
          categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`${
                selectedCategory === category._id ? 'text-white bg-primary' : 'bg-secondary text-primary hover:text-secondary hover:bg-primary'
              } text-[14px] py-2 px-4 rounded-md font-semibold`}
            >
              {category.name}
            </button>
          ))
        )}
      </div>

      <Separator className="mb-4"/>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,310px))] gap-x-4 gap-y-16">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[250px] w-full rounded-lg" />
          ))
        ) : (
          filteredMenuItems.map((item) => (
            <Link key={item._id} to={`/menu/${item._id}/detail`}>            
              <div className="p-4 flex flex-col gap-4 border rounded-lg">
                <div className="bg-slate-100 w-full h-[184px] rounded-lg flex items-center justify-center">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-[14px] text-textgray">#{item?.category?.name}</p>
                    </div>
                    <div className={`py-[1px] px-3 rounded-md w-fit h-fit ${
                      item.isInStock ? 'text-green-700 bg-green-200' : 'text-red-700 bg-red-200'
                    }`}>
                      {item.isInStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                  <p className="text-textgray mb-3">{item.description}</p>
                  <p className="font-semibold">ETB {item.price.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Menu;