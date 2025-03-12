import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers/Customers";
import Orders from "./pages/Orders/Orders";
import Menu from "./pages/Menu";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Reservation from "./pages/Reservatons/Reservation";
import AddMenuItem from "./pages/AddMenuItem";
import MenuItemDetail from "./pages/MenuItemDetail";
import AddOrder from "./pages/AddOrder";
import AddCustomer from "./pages/AddCustomer";
import AddReservation from "./pages/AddReservation";
import UpdateReservation from "./pages/UpdateReservation";
import NotFound from "./pages/NotFound";
import { Outlet } from "react-router-dom";
import UpdateCustomer from "./pages/UpdateCustomer";
import UpdateMenuItem from "./pages/UpdateMenuItem";
import UpdateOrder from "./pages/UpdateOrder";
import OrderDetailPage from "./pages/OrderDetail";
import CustomerDetail from "./pages/CustomerDetail";
import CategoryManagement from "./pages/Categories";
import Location  from "./pages/Location";
import UpdateLocation  from "./pages/UpdateLocation";
import AddLocation  from "./pages/AddLocation";

// Layout components for nested routes
const CustomersLayout = () => <Outlet />;
const OrdersLayout = () => <Outlet />;
const MenuLayout = () => <Outlet />;
const ReservationLayout = () => <Outlet />;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reviews" element={<Reviews />} />

      {/* Customers Route with Nested Sub-Routes */}
      <Route path="/customers" element={<CustomersLayout />}>
        <Route index element={<Customers />} />
        <Route path="add-customer" element={<AddCustomer />} />
        <Route path=":userId/detail" element={<CustomerDetail />} />
        <Route path=":customerId/update" element={<UpdateCustomer />} />
      </Route>

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
      <Route path="/reservation" element={<ReservationLayout />}>
        <Route index element={<Reservation />} />
        <Route path="add-reservation" element={<AddReservation />} />
        <Route path=":reservationId/update" element={<UpdateReservation />} />
      </Route>
      
      {/* Locations Route with Nested Sub-Routes */}
      <Route path="/locations" element={<ReservationLayout />}>
        <Route index element={<Location />} />
        <Route path="add-location" element={<AddLocation />} />
        <Route path=":locationId/update" element={<UpdateLocation />} />
      </Route>

      {/* Catch all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
