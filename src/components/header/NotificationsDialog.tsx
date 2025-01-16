import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Bell, BellOff } from "lucide-react";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsDialog = ({ open, onOpenChange }: NotificationsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h2>
          </div>
          <div className="text-center text-muted-foreground py-8 flex flex-col items-center gap-3">
            <BellOff className="h-8 w-8 text-muted" />
            <p>No new notifications</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;