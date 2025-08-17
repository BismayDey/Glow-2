import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  User,
  Settings,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import AuthModal from "./auth/AuthModal";
import UserProfile from "./UserProfile";
import AdminPanel from "./admin/AdminPanel";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { state } = useCart();
  const { state: wishlistState } = useWishlist();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const cartItemCount = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const wishlistItemCount = wishlistState.items.length;
  const isAdmin = user?.email === "bismaydey001@gmail.com";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, setIsMenuOpen]);

  const navItems = [
    { name: "Shop", href: "#shop" },
    { name: "Shade Finder", href: "#shade-finder" },
    { name: "About", href: "#about" },
  ];

  const handleUserClick = () => {
    if (user) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 font-serif"
              >
                GLOW
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-rose-500 transition relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-rose-500 transition"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-6 w-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-rose-500 transition relative"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="h-6 w-6" />
                <AnimatePresence>
                  {wishlistItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {wishlistItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-rose-500 transition relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-rose-500 transition relative"
                onClick={handleUserClick}
              >
                <User className="h-6 w-6" />
                {user && (
                  <motion.div
                    className="absolute -bottom-1 right-0 w-2 h-2 bg-green-500 rounded-full"
                    layoutId="userStatus"
                  />
                )}
              </motion.button>

              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-700 hover:text-rose-500 transition"
                  onClick={() => setIsAdminOpen(true)}
                >
                  <Settings className="h-6 w-6" />
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 hover:text-rose-500"
                    whileHover={{ x: 10 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <motion.button
                    whileHover={{ x: 10 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-rose-500"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart {cartItemCount > 0 && `(${cartItemCount})`}
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 10 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/wishlist");
                    }}
                    className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-rose-500"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist {wishlistItemCount > 0 && `(${wishlistItemCount})`}
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 10 }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleUserClick();
                    }}
                    className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-rose-500"
                  >
                    <User className="h-5 w-5 mr-2" />
                    {user ? "Profile" : "Sign In"}
                  </motion.button>

                  {isAdmin && (
                    <motion.button
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsAdminOpen(true);
                      }}
                      className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-rose-500"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      Admin Panel
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white w-full max-w-2xl mx-4 rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center border-b">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 ml-3 text-gray-700 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {searchQuery && (
                <div className="p-4">
                  <p className="text-gray-500">
                    Search results will appear here...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </>
  );
};

export default Navbar;
