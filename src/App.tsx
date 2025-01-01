import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import AdminPanel from "./pages/AdminPanel";
import EditProduct from "./pages/EditProduct";
import Shop from "./pages/Shop";

// Configure QueryClient with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 404s
        if (error?.status === 404) return false;
        // Retry up to 3 times on other errors
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useSessionContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleAuthChange = async (event: string, currentSession: any) => {
      console.log("Auth event:", event);
      
      if (event === 'TOKEN_REFRESHED' && !currentSession) {
        console.log("Token refresh failed");
        toast({
          title: "Session expired",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { session } = useSessionContext();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route 
            path="/auth" 
            element={session ? <Navigate to="/" replace /> : <Auth />} 
          />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route 
            path="/checkout/:id" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment/:orderId" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/account/:section?"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider 
          supabaseClient={supabase}
          initialSession={null}
        >
          <TooltipProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;