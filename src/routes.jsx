import { Outlet, Route, Routes } from "react-router-dom";
import AddMenuItem from "./pages/AddMenuItem";
import AddOrder from "./pages/AddOrder";
import AddReservation from "./pages/AddReservation";
import CategoryManagement from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import MenuItemDetail from "./pages/MenuItemDetail";
import NotFound from "./pages/NotFound";
import OrderDetailPage from "./pages/OrderDetail";
import Orders from "./pages/Orders/Orders";
import Reservation from "./pages/Reservation";
import Reviews from "./pages/Reviews";
import UpdateMenuItem from "./pages/UpdateMenuItem";
import UpdateOrder from "./pages/UpdateOrder";

// Layout components for nested routes
const CustomersLayout = () => <Outlet />;
const OrdersLayout = () => <Outlet />;
const MenuLayout = () => <Outlet />;
const ReservationLayout = () => <Outlet />;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reviews" element={<Reviews />} />

      {/* Orders Route with Nested Sub-Routes */}
      <Route path="/orders" element={<OrdersLayout />}>
        <Route index element={<Orders />} />
        <Route path="add-order" element={<AddOrder />} />
        <Route path=":orderId/detail" element={<OrderDetailPage />} />
        <Route path=":orderId/update" element={<UpdateOrder/>} />
      </Route>

      {/* Menu Route with Nested Sub-Routes */}
      <Route path="/menu" element={<MenuLayout />}>
        <Route index element={<Menu />} />
        <Route path="add-menu-item" element={<AddMenuItem />} />
        <Route path=":menuId/detail" element={<MenuItemDetail />} />
        <Route path=":menuId/update" element={<UpdateMenuItem/>} />
        <Route path="categories" element={<CategoryManagement />} />
      </Route>

      {/* Reservation Route with Nested Sub-Routes */}
      <Route path="/cheforders" element={<ReservationLayout />}>
        <Route index element={<Reservation />} />
        <Route path="add-reservation" element={<AddReservation />} />
      </Route>
      

      {/* Catch all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
