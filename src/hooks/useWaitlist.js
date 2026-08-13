import { useState, useEffect } from "react";
import api from "../api/axios";

export function useWaitlist(slug) {
  const [waitlist, setWaitlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/w/${slug}`)
      .then((res) => setWaitlist(res.data))
      .catch((err) => setError(err.response?.data?.error || "Waitlist not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { waitlist, loading, error };
}