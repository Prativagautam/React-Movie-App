
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import AuthModal from "./Authmodal"

function NavBar() {
  const { user, logout, openAuth } = useAuth()

  return (
    <nav className="bg-gray-950 text-gray-200 px-10 py-5 flex justify-between items-center shadow-lg">
      {/* Brand */}
      <div className="text-2xl font-bold text-white">
        <Link to="/" className="hover:text-blue-400 transition"> Movie App</Link>
      </div>

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/favorites" className="hover:text-blue-400 transition">Favorites</Link>

        {/* Auth Section */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Hi, <span className="text-white font-semibold">{user.username || user.email}</span>
            </span>
            <button
              onClick={logout}
              className="border border-red-500 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-lg transition"
            >
              Login
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-lg transition"
            >
              Sign up
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal />
    </nav>
  )
}

export default NavBar
