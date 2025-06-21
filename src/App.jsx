import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RoadmapList from "./components/RoadmapList";
import Footer from "./components/Footer";

function App() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target;
      // Don't close if clicking inside the auth modal
      if (target.closest(".auth-modal") || target.closest(".fixed.inset-0")) {
        return;
      }
      // Close user menu if clicking outside .user-menu
      if (!target.closest(".user-menu")) {
        setIsUserMenuOpen(false);
      }
      // Close mobile menu if clicking outside .mobile-menu
      if (!target.closest(".mobile-menu")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <Routes>
            <Route path="/" element={<RoadmapList key="roadmap-list" />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
  );
}

export default App;
