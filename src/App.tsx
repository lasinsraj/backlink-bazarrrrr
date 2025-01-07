import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import AdminPanel from "@/pages/AdminPanel";
import EditProduct from "@/pages/EditProduct";
import NewProduct from "@/pages/NewProduct";
import UserManagement from "@/components/admin/UserManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import ProductManagement from "@/components/admin/ProductManagement";
import ChatManagement from "@/components/admin/ChatManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/products/edit/:id" element={<EditProduct />} />
            <Route path="/admin/products/new" element={<NewProduct />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/chats" element={<ChatManagement />} />
            <Route path="/admin/blog" element={<BlogManagement />} />
          </Routes>
          <Footer />
          <Toaster />
        </Router>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;