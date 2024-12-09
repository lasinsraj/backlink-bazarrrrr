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
      console.log("Auth event in AuthPage:", event);
      
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in successfully");
        navigate("/");
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        navigate("/auth");
      } else if (event === "USER_UPDATED") {
        console.log("User updated:", session);
      } else if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed successfully");
      }
    });

    // Check for existing session on component mount
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session check error:", error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
      } else if (session) {
        console.log("Existing session found");
        navigate("/");
      }
    };

    checkSession();

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
              message: { color: 'rgb(239 68 68)' },
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