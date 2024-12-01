import { Link, useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import SearchDialog from "./header/SearchDialog";
import NotificationsDialog from "./header/NotificationsDialog";
import UserMenu from "./header/UserMenu";

const Header = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    <header className="bg-gradient-app text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Backlink Bazaar
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/shop" className="text-white/90 hover:text-white">
              Shop
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            {session ? (
              <UserMenu isAdmin={isAdmin} onSignOut={handleSignOut} />
            ) : (
              <Button onClick={() => navigate("/auth")} variant="secondary">
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