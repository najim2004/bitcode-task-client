import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginEmail, loginPassword);
      onClose();
      navigate("/");
    } catch (err) {
      setAuthError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(signupEmail, signupPassword);
      onClose();
      navigate("/");
    } catch (err) {
      setAuthError(err.response?.data?.message || "Signup failed");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md relative auth-modal">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 !rounded-button"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
        <div className="p-8">
          {isLoginView ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Welcome Back
              </h2>
              <form className="space-y-4" onSubmit={handleLogin}>
                {authError && (
                  <p className="text-red-500 text-sm">{authError}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors !rounded-button"
                >
                  Login
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(false)}
                    className="text-blue-600 hover:text-blue-700 font-medium !rounded-button"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Account
              </h2>
              <form className="space-y-4" onSubmit={handleSignup}>
                {authError && (
                  <p className="text-red-500 text-sm">{authError}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors !rounded-button"
                >
                  Sign Up
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLoginView(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium !rounded-button"
                  >
                    Login
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
