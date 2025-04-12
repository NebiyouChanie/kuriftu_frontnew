import {
  BookOpenText,
  ChevronDown, ChevronUp,
  LayoutDashboard,
  LocateIcon,
  NotebookPen,
  ShoppingCartIcon,
  StarIcon
} from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard /> },
   
  { 
    name: "Orders", path: "/orders", icon: <ShoppingCartIcon />,
    subLinks: [
      { name: "Add Order", path: "/orders/add-order" },
    ]
  },
  { 
    name: "Menu", path: "/menu", icon: <BookOpenText />,
    subLinks: [
      { name: "Add Item", path: "/menu/add-menu-item" },
    ]
  },
    
  { 
    name: "Chef Orders", path: "/cheforders", icon: <NotebookPen />,
  },
  { name: "Reviews", path: "/reviews", icon: <StarIcon /> },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const handleMenuClick = (item, event) => {
    if (item.subLinks) {
      event.preventDefault();  
      setOpenMenus((prev) => ({ ...prev, [item.name]: !prev[item.name] }));
    }
    navigate(item.path); 
  };

  return (
    <div className="w-72 h-screen border-r p-5 rounded-md ">
      <div className="h-20 mb-8 flex justify-center items-center">
         <p className="font-bold text-xl" >Menu Admin</p>
      </div>
      <nav>
        <ul className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink 
                to={item.path} 
                onClick={(e) => handleMenuClick(item, e)} 
                className={({ isActive }) =>
                  `py-2 ps-4 flex gap-[16px] text-base items-center w-full transition-all ease-in-out duration-200 ${
                    isActive
                      ? "text-primary bg-secondary font-semibold rounded-[10px] rounded-s-none border-s-[3px] border-primary"
                      : "hover:text-primary hover:bg-secondary hover:font-semibold hover:rounded-[10px] hover:rounded-s-none hover:border-s-[3px] hover:border-primary"
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.name}
                {item.subLinks && (
                  <span className="ml-auto">
                    {openMenus[item.name] ? <ChevronUp /> : <ChevronDown />}
                  </span>
                )}
              </NavLink>
              {item.subLinks && (
                <ul className={`my-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${openMenus[item.name] ? "max-h-40" : "max-h-0"}`}>
                  {item.subLinks.map((sub) => (
                    <li key={sub.name} className="ps-10">
                      <NavLink 
                        to={sub.path} 
                        className={({ isActive }) =>
                          `py-1 ps-4 flex gap-[16px] text-[16px] text-gray-700 font-medium items-center w-full transition-all ease-in-out duration-100 ${
                            isActive
                              ? "text-primary bg- font-semibold rounded-[10px] rounded-s-none  border-s-[3px] border-primary"
                              : "hover:text-primary hover:bg-secondary hover:font-semibold hover:rounded-[10px] hover:rounded-s-none hover:border-s-[3px] hover:border-primary"
                          }`
                        }
                      >
                        {sub.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
