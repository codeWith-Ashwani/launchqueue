import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateWaitlist = lazy(() => import("./pages/CreateWaitlist"));
const WaitlistPage = lazy(() => import("./pages/WaitlistPage"));
const Welcome = lazy(() => import("./pages/Welcome"));
const WaitlistDetail = lazy(() => import("./pages/WaitlistDetail"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Home = lazy(() => import("./pages/Home"));
const WaitlistSettings = lazy(() => import("./pages/WaitlistSettings"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<p role="status" className="lq-container">Loading page...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/new"
              element={
                <ProtectedRoute>
                  <CreateWaitlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/:id"
              element={
                <ProtectedRoute>
                  <WaitlistDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/w/:slug" element={<WaitlistPage />} />
            <Route path="/w/:slug/welcome" element={<Welcome />} />
            <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
            <Route path="/dashboard/:id/settings" element={<ProtectedRoute><WaitlistSettings /></ProtectedRoute>} />
            <Route path="*" element={<main className="lq-container"><h1>Page not found</h1><a href="/">Return to LaunchQueue</a></main>} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
