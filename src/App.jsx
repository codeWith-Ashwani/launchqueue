import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home — coming soon</div>} />
        <Route path="/dashboard" element={<div>Dashboard — coming soon</div>} />
        <Route path="/w/:slug" element={<div>Waitlist page — coming soon</div>} />
        <Route path="/w/:slug/welcome" element={<div>Welcome page — coming soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;