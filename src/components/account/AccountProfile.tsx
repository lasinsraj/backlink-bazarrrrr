import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccountProfileProps {
  session: Session;
}

export const AccountProfile = ({ session }: AccountProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="mt-1">{session?.user.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};