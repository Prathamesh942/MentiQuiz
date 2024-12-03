import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import QuizCreator from "./pages/QuizCreator";
import QuizPage from "./pages/QuizPage";
import Landing from "./pages/Landing";
import axios from "axios";

// axios.defaults.baseURL = "https://documate-36bo.onrender.com";
axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  const token = localStorage.getItem("authToken"); // Access token from AuthContext
  console.log(token);

  // A protected route that redirects to login if the user is not logged in
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      if (children.type === HomePage) {
        return <Landing />;
      }
      // Redirect to AuthPage for other routes
      return <Navigate to="/auth" replace />;
    }
    // Render children if the user is authenticated
    return children;
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
              <QuizCreator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:quizId"
          element={
            <ProtectedRoute>
              <QuizPage />
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
