import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session);
      } else if (event === "USER_DELETED") {
        toast({
          title: "Account Deleted",
          description: "Your account has been deleted.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: 'rgb(59 130 246)', color: 'white' },
              anchor: { color: 'rgb(59 130 246)' },
              message: { color: 'rgb(239 68 68)' }, // Red color for error messages
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
          showLinks={true}
          view="sign_in"
        />
      </div>
    </div>
  );
};

export default AuthPage;