
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMovieContext } from "../contexts/MovieContext";
import AuthModal from "../components/auth/Authmodal";
import { getMovieDetails, getMovieReviews, getTVDetails, getTVReviews } from "../services/api";
import MovieDetailsHero from "../components/movie/MovieDetailsHero";
import TmdbReviews from "../components/movie/TmdbReviews";

const MOVIE_REVIEWS_STORAGE_KEY = "movieReviews";

const getStoredMovieReviews = () => {
  try {
    return JSON.parse(localStorage.getItem(MOVIE_REVIEWS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, openAuth, logout } = useAuth();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const contentType = location.pathname.startsWith("/tv/") ? "tv" : "movie";
  const reviewStorageKey = `${contentType}_${id}`;

  // ---------- movie + tmdb reviews ----------
  const [movie, setMovie] = useState(null);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [detailsError, setDetailsError] = useState(null);

  // ---------- local (app) reviews ----------
  const [localReviews, setLocalReviews] = useState([]);

  // inputs for new review
  const [newContent, setNewContent] = useState("");
  const [newRating, setNewRating] = useState(5);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingRating, setEditingRating] = useState(5);

  // reply state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // sorting for local reviews
  const [sortBy, setSortBy] = useState("newest");

  const genId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const favorite = movie ? isFavorite(movie.id) : false;

  // ---------- fetch movie & tmdb reviews ----------
  useEffect(() => {
    let ignoreResponse = false;

    const loadMovieDetails = async () => {
      setMovie(null);
      setDetailsError(null);

      try {
        const [movieData, reviewData] = await Promise.all(
          contentType === "tv"
            ? [getTVDetails(id), getTVReviews(id)]
            : [getMovieDetails(id), getMovieReviews(id)]
        );

        if (ignoreResponse) return;
        setMovie(movieData);
        setTmdbReviews(reviewData);
      } catch (err) {
        if (ignoreResponse) return;
        console.error("Movie details fetch error:", err);
        setDetailsError("Unable to load details for this title.");
      }
    };

    loadMovieDetails();

    return () => {
      ignoreResponse = true;
    };
  }, [id, contentType]);

  // ---------- load local reviews from localStorage ----------
  useEffect(() => {
    const stored = getStoredMovieReviews();
    setLocalReviews(stored[reviewStorageKey] || []);
  }, [reviewStorageKey]);

  // persist local reviews to localStorage
  useEffect(() => {
    const stored = getStoredMovieReviews();
    stored[reviewStorageKey] = localReviews;
    localStorage.setItem(MOVIE_REVIEWS_STORAGE_KEY, JSON.stringify(stored));
  }, [localReviews, reviewStorageKey]);

  // ---------- derived values ----------
  const averageLocalRating = useMemo(() => {
    if (!localReviews.length) return 0;
    const sum = localReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return +(sum / localReviews.length).toFixed(1);
  }, [localReviews]);

  const sortedLocalReviews = useMemo(() => {
    const copy = [...localReviews];
    if (sortBy === "newest") copy.sort((a, b) => b.createdAt - a.createdAt);
    else if (sortBy === "oldest") copy.sort((a, b) => a.createdAt - b.createdAt);
    else if (sortBy === "highest-rated") copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "most-liked") copy.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return copy;
  }, [localReviews, sortBy]);

  // ---------- actions for local reviews ----------
  const requireAuth = () => {
    if (!user) {
      openAuth("login");
      return false;
    }
    return true;
  };

  const toggleFavorite = () => {
    if (!requireAuth() || !movie) return;

    if (favorite) {
      removeFromFavorites(movie.id);
      return;
    }

    addToFavorites({
      ...movie,
      media_type: contentType,
    });
  };

  const addLocalReview = () => {
    if (!requireAuth()) return;
    const text = (newContent || "").trim();
    if (!text) return;

    const rev = {
      id: genId(),
      user: user.username || user.email,
      userId: user.email || user.username,
      content: text,
      rating: Number(newRating) || 0,
      createdAt: Date.now(),
      editedAt: null,
      likes: 0,
      likedBy: [],
      replies: [],
    };

    setLocalReviews((prev) => [...prev, rev]);
    setNewContent("");
    setNewRating(5);
  };

  const startEdit = (rev) => {
    if (!requireAuth()) return;
    if (rev.userId !== (user.email || user.username)) return;
    setEditingId(rev.id);
    setEditingContent(rev.content);
    setEditingRating(rev.rating || 5);
  };

  const saveEdit = () => {
    setLocalReviews((prev) =>
      prev.map((r) =>
        r.id === editingId ? { ...r, content: editingContent.trim(), rating: Number(editingRating) || 0, editedAt: Date.now() } : r
      )
    );
    setEditingId(null);
    setEditingContent("");
    setEditingRating(5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent("");
    setEditingRating(5);
  };

  const deleteLocalReview = (revId) => {
    const rev = localReviews.find((r) => r.id === revId);
    if (!rev) return;
    if (!requireAuth()) return;
    if (rev.userId !== (user.email || user.username)) return;
    if (!confirm("Delete this review?")) return;
    setLocalReviews((prev) => prev.filter((r) => r.id !== revId));
  };

  const toggleLikeLocal = (revId) => {
    if (!requireAuth()) return;
    const userId = user.email || user.username;
    setLocalReviews((prev) =>
      prev.map((r) => {
        if (r.id !== revId) return r;
        const has = (r.likedBy || []).includes(userId);
        return has
          ? { ...r, likes: Math.max(0, (r.likes || 1) - 1), likedBy: r.likedBy.filter((u) => u !== userId) }
          : { ...r, likes: (r.likes || 0) + 1, likedBy: [...(r.likedBy || []), userId] };
      })
    );
  };

  const startReply = (revId) => {
    if (!requireAuth()) return;
    setReplyingTo(revId);
    setReplyContent("");
  };

  const submitReply = (revId) => {
    if (!requireAuth()) return;
    const text = (replyContent || "").trim();
    if (!text) return;
    const reply = {
      id: genId(),
      user: user.username || user.email,
      userId: user.email || user.username,
      content: text,
      createdAt: Date.now(),
      likes: 0,
      likedBy: [],
    };

    setLocalReviews((prev) => prev.map((r) => (r.id === revId ? { ...r, replies: [...(r.replies || []), reply] } : r)));
    setReplyingTo(null);
    setReplyContent("");
  };

  const deleteReply = (revId, replyId) => {
    if (!requireAuth()) return;
    setLocalReviews((prev) => prev.map((r) => (r.id === revId ? { ...r, replies: (r.replies || []).filter((rp) => rp.id !== replyId) } : r)));
  };

  const toggleLikeReply = (revId, replyId) => {
    if (!requireAuth()) return;
    const userId = user.email || user.username;
    setLocalReviews((prev) =>
      prev.map((r) =>
        r.id !== revId
          ? r
          : {
              ...r,
              replies: (r.replies || []).map((rp) => {
                if (rp.id !== replyId) return rp;
                const has = (rp.likedBy || []).includes(userId);
                return has
                  ? { ...rp, likes: Math.max(0, (rp.likes || 1) - 1), likedBy: rp.likedBy.filter((u) => u !== userId) }
                  : { ...rp, likes: (rp.likes || 0) + 1, likedBy: [...(rp.likedBy || []), userId] };
              }),
            }
      )
    );
  };

  if (detailsError) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#111827', color: 'white' }}>{detailsError}</div>;
  }

  if (!movie) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#111827', color: 'white' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1f2937, #374151, #4b5563)', color: 'white' }}>
      {/* Auth Modal */}
      <AuthModal />

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(17, 24, 39, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #374151' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div 
              style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigate("/")}
            >
              <span style={{ color: 'white' }}>Movie</span>
              <span style={{ color: '#3b82f6' }}>.id</span>
            </div>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={() => navigate("/")}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
              >
                Home
              </button>
              <button
                onClick={() => navigate("/favorites")}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '1rem', fontWeight: '500' }}
              >
                Favorites
              </button>
            </nav>

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 1rem', maxWidth: '1280px', margin: '0 auto' }}>
        {/* Movie Info Section */}
        <MovieDetailsHero
          movie={movie}
          averageLocalRating={averageLocalRating}
          reviewCount={localReviews.length}
          favorite={favorite}
          onFavoriteClick={toggleFavorite}
        />

        {/* Reviews Sections */}
        <div>
          {/* TMDB Reviews */}
          <TmdbReviews reviews={tmdbReviews} />

          {/* Local User Reviews */}
          <section>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>User Reviews</h2>

            {/* Add Review Form */}
            <div style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #374151', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', flexShrink: 0 }}>
                  {user ? (user.username || user.email)[0].toUpperCase() : "G"}
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    rows={3}
                    placeholder={user ? "Write your review..." : "Login to write a review"}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    disabled={!user}
                    style={{ width: '100%', padding: '1rem', backgroundColor: '#374151', color: 'white', borderRadius: '0.75rem', border: 'none', outline: 'none', resize: 'vertical', marginBottom: '1rem' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                      <label style={{ color: '#d1d5db' }}>Your rating:</label>
                      <select 
                        value={newRating} 
                        onChange={(e) => setNewRating(e.target.value)} 
                        style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', outline: 'none' }} 
                        disabled={!user}
                      >
                        <option value={5}>★★★★★</option>
                        <option value={4}>★★★★☆</option>
                        <option value={3}>★★★☆☆</option>
                        <option value={2}>★★☆☆☆</option>
                        <option value={1}>★☆☆☆☆</option>
                      </select>
                    </div>

                    <button 
                      onClick={addLocalReview} 
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: user ? '#3b82f6' : '#6b7280', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: user ? 'pointer' : 'not-allowed' }}
                    >
                      {user ? "Submit" : "Login to submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sortedLocalReviews.length > 0 ? (
                sortedLocalReviews.map((r) => (
                  <div key={r.id} style={{ backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '3rem', height: '3rem', borderRadius: '9999px', background: 'linear-gradient(to bottom right, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.25rem', color: 'white', flexShrink: 0 }}>
                        {r.user ? r.user[0].toUpperCase() : "U"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{r.user}</div>
                            <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                              {new Date(r.createdAt).toLocaleString()} {r.editedAt ? " • edited" : ""}
                            </div>
                            <div style={{ color: '#fbbf24', marginTop: '0.5rem' }}>{Array.from({ length: r.rating || 0 }).map((_, i) => "★").join("")}</div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => toggleLikeLocal(r.id)}
                              style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: r.likedBy?.includes(user?.email || user?.username) ? '#3b82f6' : '#374151', color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                              ❤ {r.likes || 0}
                            </button>

                            <button 
                              onClick={() => startReply(r.id)} 
                              style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#374151', color: 'white', border: 'none', cursor: 'pointer' }}
                            >
                              Reply
                            </button>

                            {user && (user.email || user.username) === r.userId && (
                              <>
                                <button 
                                  onClick={() => startEdit(r)} 
                                  style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#374151', color: 'white', border: 'none', cursor: 'pointer' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => deleteLocalReview(r.id)} 
                                  style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#dc2626', color: 'white', border: 'none', cursor: 'pointer' }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                          {editingId === r.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              <textarea 
                                rows={3} 
                                value={editingContent} 
                                onChange={(e) => setEditingContent(e.target.value)} 
                                style={{ width: '100%', padding: '0.75rem', backgroundColor: '#374151', color: 'white', borderRadius: '0.5rem', border: 'none', outline: 'none', resize: 'vertical' }} 
                              />
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <select 
                                  value={editingRating} 
                                  onChange={(e) => setEditingRating(e.target.value)} 
                                  style={{ backgroundColor: '#374151', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', outline: 'none' }}
                                >
                                  <option value={5}>5</option>
                                  <option value={4}>4</option>
                                  <option value={3}>3</option>
                                  <option value={2}>2</option>
                                  <option value={1}>1</option>
                                </select>
                                <button 
                                  onClick={saveEdit} 
                                  style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={cancelEdit} 
                                  style={{ padding: '0.5rem 1rem', backgroundColor: '#6b7280', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p style={{ color: '#d1d5db', whiteSpace: 'pre-line', lineHeight: '1.75' }}>{r.content}</p>
                          )}
                        </div>

                        {/* Replies */}
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {(r.replies || []).map((rp) => (
                            <div key={rp.id} style={{ backgroundColor: '#374151', padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                              <div>
                                <div style={{ fontWeight: '600' }}>{rp.user}</div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>{new Date(rp.createdAt).toLocaleString()}</div>
                                <div style={{ color: '#d1d5db' }}>{rp.content}</div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '0.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: '#fbbf24' }}>Likes: {rp.likes || 0}</div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                  <button 
                                    onClick={() => toggleLikeReply(r.id, rp.id)} 
                                    style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#4b5563', color: 'white', border: 'none', cursor: 'pointer' }}
                                  >
                                    ❤
                                  </button>
                                  {user && (user.email || user.username) === rp.userId && (
                                    <button 
                                      onClick={() => deleteReply(r.id, rp.id)} 
                                      style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#dc2626', color: 'white', border: 'none', cursor: 'pointer' }}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Reply Input */}
                          {replyingTo === r.id && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                              <input 
                                value={replyContent} 
                                onChange={(e) => setReplyContent(e.target.value)} 
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#374151', color: 'white', borderRadius: '0.5rem', border: 'none', outline: 'none' }} 
                                placeholder="Write a reply..." 
                              />
                              <button 
                                onClick={() => submitReply(r.id)} 
                                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                              >
                                Send
                              </button>
                              <button 
                                onClick={() => setReplyingTo(null)} 
                                style={{ padding: '0.75rem 1rem', backgroundColor: '#6b7280', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>No user reviews yet. Be the first to review!</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .movie-details-grid {
            grid-template-columns: 300px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}



