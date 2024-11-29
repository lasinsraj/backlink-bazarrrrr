import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, User } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { session, setSession } = useSessionContext();
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
      // First try to sign out remotely
      const { error } = await supabase.auth.signOut();
      
      // Even if there's an error, we want to clear the local session
      setSession(null);
      setIsAdmin(false);
      
      // Only show error if it's not the session_not_found error
      if (error && !error.message?.includes('session_not_found')) {
        console.error('Error signing out:', error);
        toast({
          title: "Warning",
          description: "Signed out locally. You may need to refresh the page.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "You have been signed out successfully.",
        });
      }
      
      navigate("/");
    } catch (error) {
      console.error('Error in handleSignOut:', error);
      // Clear local session state anyway
      setSession(null);
      setIsAdmin(false);
      navigate("/");
      
      toast({
        title: "Warning",
        description: "Signed out locally. You may need to refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query: string) => {
    toast({
      title: "Search",
      description: `Searching for: ${query}`,
    });
    setSearchOpen(false);
  };

  return (
    <header className="bg-gradient-app text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Backlink Bazaar
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/category/keyword-rank" className="text-white/90 hover:text-white">
              Keyword Rank
            </Link>
            <Link to="/category/blog-comments" className="text-white/90 hover:text-white">
              Blog Comments
            </Link>
            <Link to="/category/da-50-plus" className="text-white/90 hover:text-white">
              DA 50+
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onSelect={() => navigate("/account/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate("/account/orders")}>
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate("/account/payments")}>
                    Payment Methods
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onSelect={() => navigate("/admin")}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="secondary">
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Search</h2>
            <Input
              placeholder="Search backlinks..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(e.currentTarget.value);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="grid gap-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <div className="text-center text-gray-500 py-4">
              No new notifications
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;