import { Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import AdminPanel from "@/pages/AdminPanel";
import NewProduct from "@/pages/NewProduct";
import EditProduct from "@/pages/EditProduct";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import RefundPolicy from "@/pages/RefundPolicy";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";

const App = () => {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/products/new" element={<NewProduct />} />
            <Route path="/admin/products/:id/edit" element={<EditProduct />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout/:id" element={<Checkout />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </SessionContextProvider>
  );
};

export default App;