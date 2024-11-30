import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    toast({
      title: "Search",
      description: `Searching for: ${query}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default SearchDialog;