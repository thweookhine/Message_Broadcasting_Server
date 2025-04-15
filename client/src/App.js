import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./components/Dashboard";
import AuthProvider from "./context/AuthProvider";
import './App.css';
import Register from "./components/Register";
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            {/* Other routes */}
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;