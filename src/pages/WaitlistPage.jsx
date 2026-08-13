import { useParams } from "react-router-dom";
import { useWaitlist } from "../hooks/useWaitlist";
import SignupForm from "../components/SignupForm";

export default function WaitlistPage() {
  const { slug } = useParams();
  const { waitlist, loading, error } = useWaitlist(slug);

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, textAlign: "center" }}>{error}</div>;

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", padding: 24, textAlign: "center" }}>
      <h1 style={{ marginBottom: 8 }}>{waitlist.name}</h1>
      {waitlist.description && (
        <p style={{ color: "#666", marginBottom: 24 }}>{waitlist.description}</p>
      )}
      <p style={{ fontSize: 13, color: "#999", marginBottom: 24 }}>
        {waitlist.totalSignups} people on the list
      </p>
      <SignupForm slug={slug} />
    </div>
  );
}