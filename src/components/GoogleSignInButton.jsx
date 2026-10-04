import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import { loadGoogleIdentity } from "../utils/googleIdentity";
export default function GoogleSignInButton() {
  const button = useRef(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const host = button.current;
    setReady(false);
    setError("");
    async function initialize() {
      let clientId;
      try {
        const { data } = await api.get("/auth/config", {
          signal: controller.signal,
        });
        clientId = data.googleClientId;
      } catch {
        clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      }
      if (!active) return;
      if (!clientId)
        throw new Error(
          "Google sign-in is currently unavailable. Continue with email.",
        );
      const google = await loadGoogleIdentity();
      if (!active || !host) return;
      google.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!active || !response.credential) return;
          setSigningIn(true);
          setError("");
          try {
            const { data } = await api.post("/auth/google", {
              credential: response.credential,
            });
            if (active) {
              loginWithGoogle(data.founder);
              navigate("/dashboard");
            }
          } catch (err) {
            if (active)
              setError(
                err.response?.data?.error ||
                  "Google sign-in failed. Please try again.",
              );
          } finally {
            if (active) setSigningIn(false);
          }
        },
      });
      host.replaceChildren();
      google.renderButton(host, {
        theme: "outline",
        size: "large",
        width: Math.min(host.parentElement?.clientWidth || 320, 360),
        text: "continue_with",
        shape: "pill",
      });
      setReady(true);
    }
    initialize().catch((err) => {
      if (active) setError(err.message);
    });
    return () => {
      active = false;
      controller.abort();
      host?.replaceChildren();
    };
  }, [loginWithGoogle, navigate, revision]);
  return (
    <div className="google-sign-in">
      {!ready && (
        <button type="button" className="google-placeholder" disabled>
          <span aria-hidden="true">G</span>Continue with Google
        </button>
      )}
      <div
        className="lq-google-btn-wrapper"
        ref={button}
        aria-busy={!ready && !error}
      />
      {!ready && !error && (
        <p className="google-status" role="status">
          Loading Google sign-in…
        </p>
      )}
      {signingIn && (
        <p className="google-status" role="status">
          Signing in with Google…
        </p>
      )}
      {error && (
        <div className="google-status" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="platform-text-button"
            onClick={() => setRevision(revision + 1)}
          >
            Try Google again
          </button>
        </div>
      )}
    </div>
  );
}
