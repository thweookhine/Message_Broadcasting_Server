
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import '../App.css';
import {useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const auth = useAuth();
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      if (user.email !== "" && user.password !== "") {
        await auth.loginAction(user);
        if(auth.error) {
          setErrorMessage(auth.error)
        }
        return;
      }
    }catch(err) {
      alert(err)
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const redirectToSignUp = () => {
    navigate('/register')
  }

  return (
    <div className="card col-12 col-lg-3 login-card mt-2 hv-center d-flex align-items-center" style={{ borderColor: 'lightblue' }}>
      <h2 className="card-header mt-5">Login</h2>
      <form onSubmit={handleSubmitEvent}>
        <div className="form-group mt-3">
          <label htmlFor="user-email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="example@yahoo.com"
            onChange={handleInput}
            required
          />
        </div>
        <div className="form-group mt-3">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={handleInput}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>
      <div className="mt-3 mb-5">
                <span>Already have an account? </span>
                <span className="loginText btn btn-primary" onClick={redirectToSignUp}>Signup here</span> 
            </div>
      <div className="mt-3 mb-5">
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
