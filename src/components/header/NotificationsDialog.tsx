import { Dialog, DialogContent } from "@/components/ui/dialog";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsDialog = ({ open, onOpenChange }: NotificationsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="text-center text-gray-500 py-4">
            No new notifications
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsDialog;