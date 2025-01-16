import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell, Package2, CalendarClock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderNotification {
  id: string;
  created_at: string;
  status: string;
  products: {
    title: string;
  };
}

const NotificationsDialog = ({ open, onOpenChange }: NotificationsDialogProps) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const { session } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (session?.user && open) {
      fetchNotifications();
    }
  }, [session?.user, open]);

  const fetchNotifications = async () => {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at, status, products(title)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setNotifications(data as OrderNotification[]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <CalendarClock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Package2 className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleNotificationClick = (orderId: string) => {
    navigate('/account');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card hover:bg-accent/5 cursor-pointer transition-colors"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="mt-1">
                    {getStatusIcon(notification.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">
                      Order {notification.status}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.products.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-3">
              <Package2 className="h-8 w-8 text-muted" />
              <p>No new notifications</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;