import { Link } from "react-router-dom";

export default function HomeButton() {
  return (
    <Link to="/" className="lq-home-btn" aria-label="Go to Home">
      ← Home
    </Link>
  );
}
