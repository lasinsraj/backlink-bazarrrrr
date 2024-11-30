import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserMenuProps {
  isAdmin: boolean;
  onSignOut: () => void;
}

const UserMenu = ({ isAdmin, onSignOut }: UserMenuProps) => {
  const navigate = useNavigate();

  return (
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
        <DropdownMenuItem onSelect={onSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;