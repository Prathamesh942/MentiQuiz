import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import CreateQuizPage from "./pages/CreateQuizPage";
import AuthPage from "./pages/AuthPage";
import "./App.css";

function App() {
  const token = localStorage.getItem("authToken"); // Access token from AuthContext
  console.log(token);

  // A protected route that redirects to login if the user is not logged in
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/auth" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
