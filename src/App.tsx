import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import AdminPanel from "@/pages/AdminPanel";
import EditProduct from "@/pages/EditProduct";
import NewProduct from "@/pages/NewProduct"; // Import the new product page
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import ChatManagement from "@/components/admin/ChatManagement";
import BlogManagement from "@/components/admin/BlogManagement";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        <Route path="/admin/products/new" element={<NewProduct />} /> {/* New route for creating products */}
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/chats" element={<ChatManagement />} />
        <Route path="/admin/blog" element={<BlogManagement />} />
      </Routes>
      <Footer />
      <Toaster />
    </Router>
  );
}

export default App;
