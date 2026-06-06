import {useLocation, useNavigate} from "react-router-dom"
export default function NavBar(){
    const location = useLocation()
    const navigate =useNavigate()
    const {user, openAuth , logout} = useAuth()
    const{favorites} = useMovieContext()
    const isHome = location.pathname === "/"
    return(
        <nav>
              <div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate("/")}
            >
              <span style={{ color: 'white' }}>Movie</span>
              <span style={{ color: '#3b82f6' }}>.id</span>
            </div>
               < style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={() => navigate("/")}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
              >
                Home
              </button>
              <button
                style={{ padding: '0.5rem 1rem', backgroundColor: 'white', color: '#111827', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' }}
              >
                Favorites
              </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {(user.username || user.email)[0].toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600' }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuth('login')}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Login
                </button>
              )}
            </div>
        </nav>
    )

}