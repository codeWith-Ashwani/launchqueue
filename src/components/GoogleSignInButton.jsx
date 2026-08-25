import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

export default function GoogleSignInButton({ text = "signin_with" }) {
  const btnRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    function initializeGsi() {
      if (window.google?.accounts?.id && btnRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response.credential) return;
            setLoading(true);
            setError("");
            try {
              const res = await api.post("/auth/google", {
                credential: response.credential,
              });
              loginWithGoogle(res.data.founder);
              navigate("/dashboard");
            } catch (err) {
              setError(err.response?.data?.error || "Google Sign-In failed");
            } finally {
              setLoading(false);
            }
          },
        });

        window.google.accounts.id.renderButton(btnRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text: text,
          shape: "rectangular",
        });
      }
    }

    if (window.google?.accounts?.id) {
      initializeGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initializeGsi();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loginWithGoogle, navigate, text]);

  return (
    <div>
      <div className="lq-google-btn-wrapper" ref={btnRef}>
        {loading && <p className="lq-dashboard-sub">Signing in with Google...</p>}
      </div>
      {error && <div className="lq-msg-error">{error}</div>}
    </div>
  );
}
