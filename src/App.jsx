import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./components/layoutComponents/Sidebar";
import Topbar from "./components/layoutComponents/Topbar";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
    <ToastContainer autoClose={2000} position="top-center" />
    <div className="flex h-screen">
      {/* Sidebar - Fixed and Persistent */}
      <div className="fixed top-0 left-0 h-full w-80 z-50 overflow-hidden">
        <Sidebar />
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 ml-80 overflow-y-auto">
        <Topbar />
        <div className="p-4 border min-h-screen rounded-md">
          {/* Only refresh this part */}
          <AppRoutes key={window.location.pathname} />
        </div>
      </div>
    </div>
  </BrowserRouter>

  
  );
}

export default App;
