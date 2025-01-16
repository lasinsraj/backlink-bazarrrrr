import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import SearchDialog from "./header/SearchDialog";
import NotificationsDialog from "./header/NotificationsDialog";
import UserMenu from "./header/UserMenu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const checkAdminStatus = async () => {
        try {
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (fetchError) {
            console.error('Error fetching profile:', fetchError);
            return;
          }
          
          setIsAdmin(!!profile?.is_admin);
        } catch (error) {
          console.error('Error in checkAdminStatus:', error);
        }
      };

      checkAdminStatus();
    }
  }, [session]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error && !error.message?.includes('session_not_found')) {
        console.error('Error signing out:', error);
        toast({
          title: "Warning",
          description: "Failed to sign out. Please try again.",
          variant: "destructive",
        });
      } else {
        setIsAdmin(false);
        navigate("/");
        toast({
          title: "Success",
          description: "You have been signed out successfully.",
        });
      }
    } catch (error) {
      console.error('Error in handleSignOut:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] bg-gradient-app">
        <nav className="flex flex-col space-y-4 mt-8">
          <Link 
            to="/" 
            className="text-white hover:text-white/80 text-lg font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className="text-white hover:text-white/80 text-lg font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Shop
          </Link>
          {session ? (
            <Link 
              to="/account" 
              className="text-white hover:text-white/80 text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </Link>
          ) : (
            <Button 
              onClick={() => {
                navigate("/auth");
                setIsMobileMenuOpen(false);
              }} 
              variant="secondary"
              className="w-full"
            >
              Sign In
            </Button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-gradient-app text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <MobileMenu />
            <Link to="/" className="text-2xl font-bold">
              Backlink Bazaar
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-white/90 hover:text-white flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Shop</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white relative"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-accent rounded-full animate-pulse" />
            </Button>
            
            {session ? (
              <UserMenu isAdmin={isAdmin} onSignOut={handleSignOut} />
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                variant="secondary"
                className="hidden md:flex"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <NotificationsDialog open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </header>
  );
};

export default Header;