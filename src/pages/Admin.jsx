import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../components/AppNav";
import api from "../api/axios";
import { usePageMotion } from "../hooks/usePageMotion";
const date = (value) => (value ? new Date(value).toLocaleDateString() : "—");
export default function Admin() {
  const root = useRef(null);
  usePageMotion(root);
  const [overview, setOverview] = useState(null);
  const [overviewError, setOverviewError] = useState("");
  const [view, setView] = useState({
    tab: "founders",
    page: 1,
    search: "",
    filterId: "",
    filterLabel: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [busyId, setBusyId] = useState("");
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    api
      .get("/admin/overview", { signal: controller.signal })
      .then(({ data }) => {
        if (active) {
          setOverview(data);
          setOverviewError("");
        }
      })
      .catch(() => {
        if (active) setOverviewError("Platform totals couldn’t load.");
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [revision]);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setResult(null);
    const params = { page: view.page, search: view.search };
    if (view.filterId)
      params[view.tab === "campaigns" ? "founderId" : "waitlistId"] =
        view.filterId;
    api
      .get(`/admin/${view.tab}`, { params, signal: controller.signal })
      .then(({ data }) => {
        if (active) setResult(data);
      })
      .catch((err) => {
        if (active)
          setError(
            err.response?.data?.error ||
              "Couldn’t load these records. Try again.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [view, revision]);
  function show(tab, filterId = "", filterLabel = "") {
    setSearchInput("");
    setView({ tab, page: 1, search: "", filterId, filterLabel });
  }
  async function moderate(campaign) {
    setBusyId(campaign._id);
    setError("");
    try {
      await api.patch(`/admin/campaigns/${campaign._id}/discovery`, {
        discoveryHidden: !campaign.discoveryHidden,
      });
      setRevision((value) => value + 1);
    } catch (err) {
      setError(
        err.response?.data?.error || "Could not update product visibility.",
      );
    } finally {
      setBusyId("");
    }
  }
  const totals = overview?.totals;
  return (
    <div className="platform-account-page" ref={root}>
      <AppNav />
      <main className="platform-container admin-main">
        <header className="account-heading" data-hero>
          <div>
            <span className="platform-eyebrow">PLATFORM ADMINISTRATION</span>
            <h1>The whole picture.</h1>
            <p>Founders, campaigns, and the communities taking shape.</p>
          </div>
          <button
            className="lq-btn lq-btn-secondary"
            onClick={() => setRevision(revision + 1)}
          >
            Refresh data ↻
          </button>
        </header>
        {overviewError && (
          <p role="alert" className="lq-msg-error">
            {overviewError}
          </p>
        )}
        <div className="account-stat-grid" aria-label="Platform totals">
          {[
            ["Founders", totals?.founders],
            ["Campaigns", totals?.campaigns],
            ["Subscribers", totals?.subscribers],
            ["Pending verification", totals?.pendingVerification],
          ].map(([label, value]) => (
            <div className="account-stat" key={label}>
              <span>{label}</span>
              <strong>
                {value === undefined ? "—" : value.toLocaleString()}
              </strong>
            </div>
          ))}
        </div>
        {overview && (
          <div className="admin-service-strip">
            <span>{totals.listedProducts} products on discovery</span>
            <span>{totals.newFounders} new founders this week</span>
            <span>
              {overview.delivery
                .filter((item) => item._id === "failed")
                .reduce((sum, item) => sum + item.count, 0)}{" "}
              failed email deliveries
            </span>
          </div>
        )}
        <section
          className="account-card admin-records"
          aria-label="Platform records"
        >
          <div className="account-tabs" role="group" aria-label="Record type">
            {["founders", "campaigns", "subscribers"].map((tab) => (
              <button
                key={tab}
                type="button"
                aria-pressed={view.tab === tab}
                onClick={() => show(tab)}
              >
                {tab === "subscribers" ? "Users / subscribers" : tab}
              </button>
            ))}
          </div>
          <div className="admin-toolbar">
            <div>
              <h2>
                {view.tab === "subscribers"
                  ? "Users & subscribers"
                  : view.tab === "founders"
                    ? "Founder accounts"
                    : "Campaigns"}
              </h2>
              <p>
                {view.filterLabel || "Search and explore all platform records."}
              </p>
              {view.filterId && (
                <button
                  className="platform-text-button"
                  onClick={() => show(view.tab)}
                >
                  Clear filter
                </button>
              )}
            </div>
            <form
              className="admin-search"
              onSubmit={(event) => {
                event.preventDefault();
                setView({ ...view, page: 1, search: searchInput.trim() });
              }}
            >
              <label htmlFor="admin-search" className="sr-only">
                Search {view.tab}
              </label>
              <input
                id="admin-search"
                className="lq-input"
                value={searchInput}
                maxLength={100}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={
                  view.tab === "subscribers"
                    ? "Search email…"
                    : view.tab === "campaigns"
                      ? "Search product or slug…"
                      : "Search founder or email…"
                }
              />
              <button className="lq-btn lq-btn-secondary">Search</button>
            </form>
          </div>
          {error && (
            <div role="alert" className="lq-msg-error">
              {error}
              <button
                className="platform-text-button"
                onClick={() => setRevision(revision + 1)}
              >
                Try again
              </button>
            </div>
          )}
          {loading ? (
            <p className="platform-empty" role="status">
              Loading records…
            </p>
          ) : !result?.items?.length ? (
            <p className="platform-empty">No records match this view.</p>
          ) : (
            <div className="admin-table-scroll" tabIndex={0} role="region" aria-label="Scrollable platform records">
              <p className="table-scroll-hint">Swipe sideways to explore all columns.</p>
              <table className="lq-table">
                <caption className="sr-only">{view.tab} records</caption>
                <thead>
                  <tr>
                    {(view.tab === "founders"
                      ? [
                          "Founder",
                          "Subscription",
                          "Campaigns",
                          "Joined",
                          "Explore",
                        ]
                      : view.tab === "campaigns"
                        ? [
                            "Campaign",
                            "Founder",
                            "Subscribers",
                            "Visibility",
                            "Actions",
                          ]
                        : [
                            "Email",
                            "Product",
                            "Email verification",
                            "Invitation",
                            "Joined",
                          ]
                    ).map((heading) => (
                      <th scope="col" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item) => (
                    <tr key={item._id}>
                      {view.tab === "founders" ? (
                        <>
                          <td>
                            <strong>{item.name || "Unnamed founder"}</strong>
                            <span>{item.email}</span>
                          </td>
                          <td>
                            <span className="account-status">
                              {item.effectivePlan} plan
                            </span>
                            <span>
                              {item.subscriptionStatus ||
                                "No billing subscription"}
                            </span>
                            {item.subscriptionEndsAt && (
                              <span>Ends {date(item.subscriptionEndsAt)}</span>
                            )}
                          </td>
                          <td>{item.campaignCount}</td>
                          <td>{date(item.createdAt)}</td>
                          <td>
                            <button
                              className="platform-text-button"
                              onClick={() =>
                                show(
                                  "campaigns",
                                  item._id,
                                  `Campaigns by ${item.name || item.email}`,
                                )
                              }
                            >
                              View campaigns ↗
                            </button>
                          </td>
                        </>
                      ) : view.tab === "campaigns" ? (
                        <>
                          <td>
                            <Link to={`/w/${item.slug}`}>
                              <strong>{item.name} ↗</strong>
                            </Link>
                            <span>/w/{item.slug}</span>
                          </td>
                          <td>
                            {item.founderId?.name || "Unnamed founder"}
                            <span>
                              {item.founderId?.email || "Account unavailable"}
                            </span>
                          </td>
                          <td>{item.signupCount}</td>
                          <td>
                            <span className="account-status">
                              {item.paused ? "Paused" : "Active"}
                            </span>
                            <span>
                              {item.discoveryHidden
                                ? "Hidden by admin"
                                : item.discoverable
                                  ? "Public discovery"
                                  : "Unlisted"}
                            </span>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button
                                className="platform-text-button"
                                onClick={() =>
                                  show(
                                    "subscribers",
                                    item._id,
                                    `Subscribers of ${item.name}`,
                                  )
                                }
                              >
                                View users ↗
                              </button>
                              <button
                                className="platform-text-button"
                                disabled={busyId === item._id}
                                onClick={() => moderate(item)}
                              >
                                {busyId === item._id
                                  ? "Saving…"
                                  : item.discoveryHidden
                                    ? "Restore discovery"
                                    : "Hide from discovery"}
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {item.email}
                            <span>{item.referralCount} referrals</span>
                          </td>
                          <td>
                            {item.waitlistId?.name || "Campaign unavailable"}
                          </td>
                          <td>
                            <span className="account-status">
                              {item.verificationState === "legacy"
                                ? "Existing member"
                                : item.verificationState}
                            </span>
                          </td>
                          <td>
                            {item.status}
                            <span>Delivery: {item.invitationState}</span>
                          </td>
                          <td>{date(item.createdAt)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {result && (
            <div className="admin-pagination">
              <p>
                {result.pagination.total.toLocaleString()} records · Page{" "}
                {result.pagination.page} of {result.pagination.pages}
              </p>
              <div>
                <button
                  className="lq-btn lq-btn-secondary"
                  disabled={loading || view.page <= 1}
                  onClick={() => setView({ ...view, page: view.page - 1 })}
                >
                  Previous
                </button>
                <button
                  className="lq-btn lq-btn-secondary"
                  disabled={loading || view.page >= result.pagination.pages}
                  onClick={() => setView({ ...view, page: view.page + 1 })}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
