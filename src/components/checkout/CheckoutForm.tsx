import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  onSubmit: (keywords: string, targetUrl: string, skipDetails: boolean) => void;
  isSubmitting: boolean;
}

const CheckoutForm = ({ onSubmit, isSubmitting }: CheckoutFormProps) => {
  const [keywords, setKeywords] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [skipDetails, setSkipDetails] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(keywords, targetUrl, skipDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="skipDetails"
          checked={skipDetails}
          onCheckedChange={(checked) => setSkipDetails(checked as boolean)}
        />
        <Label htmlFor="skipDetails">
          Add keywords and URL later
        </Label>
      </div>

      {!skipDetails && (
        <>
          <div>
            <Label className="block text-sm font-medium mb-2">
              Target Keywords
            </Label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter your target keywords"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2">
              Target URL
            </Label>
            <Input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter your target URL"
              type="url"
            />
          </div>
        </>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Proceed to Payment
      </Button>
    </form>
  );
};

export default CheckoutForm;