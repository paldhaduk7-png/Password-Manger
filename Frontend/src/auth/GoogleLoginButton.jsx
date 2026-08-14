import { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../ContextAPI/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axios from "axios";

const GoogleLoginButton = ({ text = "continue_with" }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error("Google authentication failed. No token received.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/google`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      if (res.data.success) {
        if (updateUser) {
          updateUser(res.data.user);
        } else {
          setUser(res.data.user);
        }

        toast.success(res.data.message || "Signed in with Google successfully!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Google Sign-In backend error:", error);
      toast.error(
        error.response?.data?.message || "Failed to authenticate with Google"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-in failed");
    toast.error("Google Sign-in failed. Please try again.");
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-3 relative">
      {loading ? (
        <div className="w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center gap-2 text-sm text-slate-300">
          <Loader2 size={18} className="animate-spin text-indigo-400" />
          <span>Authenticating with Google...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!rounded-2xl">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
            text={text}
            size="large"
            width="100%"
            useOneTap={false}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;
