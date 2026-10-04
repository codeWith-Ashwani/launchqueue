import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getDiscovery } from "../api/resources";
import { usePageMotion } from "../hooks/usePageMotion";
export default function ProductLeaderboard() {
  const [period, setPeriod] = useState("week");
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const root = useRef(null);
  usePageMotion(root, `${period}-${result?.updatedAt || ""}`);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    getDiscovery({ period }, { signal: controller.signal })
      .then(({ data }) => {
        if (active) setResult({ ...data, period });
      })
      .catch(() => {
        if (active)
          setError("We couldn’t load the leaderboard. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [period, revision]);
  return (
    <section
      id="leaderboard"
      className="discovery-section"
      ref={root}
      data-motion-root
      aria-labelledby="leaderboard-heading"
    >
      <div className="platform-section-heading">
        <div>
          <span className="platform-eyebrow">THE DISCOVERY BOARD</span>
          <h2 id="leaderboard-heading">
            Small beginnings.
            <br />
            Big possibilities.
          </h2>
          <p>Find your next favorite product before everyone else.</p>
        </div>
        <div className="period-switch" aria-label="Leaderboard period">
          {[
            ["week", "This week"],
            ["all", "All time"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="discovery-explainer">
        <span>
          <span className="status-dot" />
          Live products, real communities
        </span>
        <p>
          Ranked by confirmed signups. New joins count after email verification.
        </p>
      </div>
      {loading && !result ? (
        <div className="platform-empty" role="status">
          Finding the next wave of products…
        </div>
      ) : error && !result ? (
        <div className="platform-empty" role="alert">
          <p>{error}</p>
          <button
            className="lq-btn lq-btn-secondary"
            onClick={() => setRevision(revision + 1)}
          >
            Try again
          </button>
        </div>
      ) : !result?.products?.length ? (
        <div className="platform-empty discovery-empty">
          <span className="platform-eyebrow">
            THE NEXT GREAT IDEA COULD BE YOURS
          </span>
          <h3>A little early? Perfect.</h3>
          <p>
            No products are listed yet. Create a campaign and choose to feature
            it here.
          </p>
          <Link to="/dashboard/new" className="lq-btn lq-btn-primary">
            Launch your product ↗
          </Link>
        </div>
      ) : (
        <ol className="product-list" aria-label="Product rankings" aria-busy={loading}>
          {result.products.map((product) => (
            <li key={product.slug} data-reveal>
              <Link to={`/w/${product.slug}`} className="product-row">
                <span className="product-rank">
                  <span className="sr-only">Rank </span>
                  {String(product.rank).padStart(2, "0")}
                </span>
                <span
                  className="product-monogram"
                  style={{
                    "--product-accent": /^#[a-f\d]{6}$/i.test(
                      product.accentColor,
                    )
                      ? product.accentColor
                      : "#4940bc",
                  }}
                  aria-hidden="true"
                >
                  {product.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="product-copy">
                  <h3>
                    {product.name}
                    <span className="product-tag">Pre-launch</span>
                  </h3>
                  <p>
                    {product.description ||
                      "Meet the product and join its early community."}
                  </p>
                </div>
                <div className="product-score">
                  <strong>
                    {(result.period === "week"
                      ? product.weeklyMembers
                      : product.members
                    ).toLocaleString()}
                  </strong>
                  <span>
                    {result.period === "week" ? "joined this week" : "members"}
                  </span>
                </div>
                <span className="product-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
      <div className="discovery-bottom">
        {error && result && <span role="alert">{error}</span>}
        {loading && result && <span role="status">Updating board…</span>}
        <span>Discover. Join. Share. Be part of what comes next.</span>
        <button
          type="button"
          className="platform-text-button"
          disabled={loading}
          onClick={() => setRevision(revision + 1)}
        >
          Refresh board ↻
        </button>
      </div>
    </section>
  );
}
