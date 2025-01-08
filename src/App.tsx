import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import AdminPanel from "@/pages/AdminPanel";
import EditProduct from "@/pages/EditProduct";
import NewProduct from "@/pages/NewProduct";
import ProductDetail from "@/pages/ProductDetail";
import Account from "@/pages/Account";
import Auth from "@/pages/Auth";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import RefundPolicy from "@/pages/RefundPolicy";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/checkout/:id" element={<Checkout />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                <Route path="/admin/products/new" element={<NewProduct />} />
                <Route path="/account" element={<Account />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;