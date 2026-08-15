import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import SignupsChart from "../components/SignupsChart";
import ReferrerLeaderboard from "../components/ReferrerLeaderboard";

export default function WaitlistDetail() {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/waitlists/${id}/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.error || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleExport() {
    try {
      const res = await api.get(`/waitlists/${id}/export`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${stats.waitlist.slug}-signups.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/pricing");
      }
    }
  }
}
