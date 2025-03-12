import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, UserRound, ShoppingCartIcon, BookOpenText, 
  NotebookPen, BarChart4, StarIcon, ChevronDown, ChevronUp, LocateIcon
} from "lucide-react";
import Logo from "../../assets/boss-burger-logo.svg";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard /> },
  { 
    name: "Customers", path: "/customers", icon: <UserRound />,
    subLinks: [
      { name: "Add Customer", path: "/customers/add-customer" },
    ]
   },
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
    name: "Reservation", path: "/reservation", icon: <NotebookPen />,
    subLinks: [
      { name: "Add Reservation", path: "/reservation/add-reservation" },
    ]
  },
  { 
    name: "Location", path: "/locations", icon: <LocateIcon />,
    subLinks: [
      { name: "Add Location", path: "/locations/add-location" },
    ]
  },
  { name: "Analytics", path: "/analytics", icon: <BarChart4 /> },
  { name: "Reviews", path: "/reviews", icon: <StarIcon /> },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const handleMenuClick = (item, event) => {
    if (item.subLinks) {
      event.preventDefault(); // Prevent full navigation if it has sublinks
      setOpenMenus((prev) => ({ ...prev, [item.name]: !prev[item.name] }));
    }
    navigate(item.path); // Navigate even when toggling submenu
  };

  return (
    <div className="w-72 h-screen border-r p-5 rounded-md ">
      <div className="h-20 mb-8 flex justify-start">
        <img src={Logo} alt="boss burger logo"/>
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
