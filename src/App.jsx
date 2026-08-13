import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateWaitlist from "./pages/CreateWaitlist";
import WaitlistPage from "./pages/WaitlistPage";
import Welcome from "./pages/Welcome";
import WaitlistDetail from "./pages/WaitlistDetail";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<div style={{ padding: 40 }}>Home — coming soon</div>}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
