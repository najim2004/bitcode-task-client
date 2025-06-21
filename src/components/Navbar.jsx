import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthModal from "./AuthModal";

function Navbar({
  isUserMenuOpen,
  setIsUserMenuOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Roadmap
              </Link>
            </div>
            <div className="hidden md:block user-menu">
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 !rounded-button"
                >
                  <i className="fas fa-user-circle text-xl"></i>
                  <span className="font-medium">
                    {user ? user.email : "Login"}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsUserMenuOpen(true)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          Login
                        </button>
                        <button
                          onClick={() => setIsUserMenuOpen(true)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="md:hidden mobile-menu">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900 !rounded-button"
              >
                <i
                  className={`fas ${
                    isMobileMenuOpen ? "fa-times" : "fa-bars"
                  } text-xl`}
                ></i>
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="py-3 space-y-1">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(true)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setIsUserMenuOpen(true)}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      {isUserMenuOpen && !user && (
        <AuthModal
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
