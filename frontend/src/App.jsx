import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import { User, MessageSquare, Lock, Unlock, LogOut, AlertTriangle, Plus, Send, Eye, Edit, Trash2, Copy, Check } from 'lucide-react';
import LogoPng from './assets/logo.png';

const API_BASE = '/api';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        await loadPosts();
        setMessage('Login berhasil');
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error occurred');
    }
    setLoading(false);
  };

  const register = async (username, password) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        setUser(data.user);
        await loadPosts();
        setMessage('Pendaftaran berhasil');
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Pendaftaran gagal!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Terjadi kegagalan koneksi');
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPosts([]);
    setMessage('');
    navigate('/');
  };

  // Post functions
  const loadPosts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found for loading posts');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/posts/`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.items || []);
      } else if (response.status === 401) {
        console.log('Token expired or invalid during post loading');
        logout();
      } else {
        console.error('Failed to load posts:', response.status);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  const createPost = async (content, isPrivate) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first');
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, is_private: isPrivate })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Post berhasil dikirim');
        await loadPosts();
        navigate('/dashboard');
      } else if (response.status === 401) {
        setMessage('Session expired. Harap login lagi.');
        logout();
      } else {
        setMessage(data.error || 'Gagal membuat post baru');
      }
    } catch (error) {
      // console.error('Create post error:', error);
      setMessage('Koneksi error!');
    }
    setLoading(false);
  };

  // Validate session on app initialization
  const validateSession = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // console.log('No token found');
      setIsInitializing(false);
      return;
    }

    try {
      console.log('Validating token...');
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token valid, user data:', data.user);
        setUser(data.user);
        await loadPosts();
      } else {
        console.log('Token validation failed:', response.status, response.statusText);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Session validation error:', error);
      localStorage.removeItem('token');
    }
    
    setIsInitializing(false);
  };

  // Check for existing session on load
  useEffect(() => {
    validateSession();
  }, []);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isInitializing) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg font-light text-zinc-400">Loading</div>
          </div>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  // Login Component
  const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const containerRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.gsap && containerRef.current && formRef.current) {
        const gsap = window.gsap;
        
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out"
        });

        const formChildren = Array.from(formRef.current.children);
        if (formChildren.length > 0) {
          gsap.from(formChildren, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3
          });
        }
      }
    }, []);

    // Redirect if already logged in
    if (user && !isInitializing) {
      return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!username.trim() || !password.trim()) {
        setMessage('Please fill in all fields');
        return;
      }
      
      if (isLogin) {
        login(username.trim(), password);
      } else {
        register(username.trim(), password);
      }
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-cyan-950/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div ref={containerRef} className="relative bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div ref={formRef}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
                <MessageSquare className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-light text-white mb-2 tracking-tight">PENS Menfess</h1>
              <p className="text-zinc-500 text-sm">Ruang anonim untuk berbagi cerita, suarakan isi hatimu.</p>
            </div>

            <div className="flex bg-zinc-800/50 rounded-xl p-1 mb-8 border border-zinc-700/50">
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 rounded-lg font-light text-sm transition-all duration-300 ${
                  isLogin ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                onClick={() => {
                  setIsLogin(true);
                  setMessage('');
                }}
              >
                Masuk
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 px-4 rounded-lg font-light text-sm transition-all duration-300 ${
                  !isLogin ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                onClick={() => {
                  setIsLogin(false);
                  setMessage('');
                }}
              >
                Daftar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  maxLength={100}
                  disabled={loading}
                />
              </div>
              
              <div>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-light hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Buat Akun'}
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-xl border text-sm ${
                message.includes('berhasil') ? 
                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <div className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-900/30 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl shadow-lg shadow-emerald-500/20">
                  <MessageSquare className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-light text-white tracking-tight">Menfess</h1>
                  {user && (
                    <span className="text-xs text-zinc-500">@{user.username}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    navigate('/create');
                    setMessage('');
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 text-sm font-light"
                >
                  <Plus size={16} />
                  <span>Post Baru</span>
                </button>
                <button
                  onClick={logout}
                  className="text-zinc-400 hover:text-red-400 transition-colors p-2"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-xl border text-sm ${
              message.includes('berhasil') ? 
              'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
              message.includes('expired') ? 
              'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
              'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl mb-4">
                  <MessageSquare className="text-zinc-700" size={40} />
                </div>
                <p className="text-zinc-600 text-sm">Belum ada cerita. Kamu mau mulai duluan?.</p>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/50 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
                        <User className="text-emerald-500" size={14} />
                      </div>
                      <div>
                        <span className="text-sm text-zinc-400 font-light">{post.username}</span>
                        {post.is_private && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Lock className="text-red-400" size={12} />
                            <span className="text-xs text-red-400">Private</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/posts/${post.id}`)}
                      className="text-zinc-500 hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="View post"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                  
                  <div 
                    className="text-zinc-300 mb-4 line-clamp-3 font-light leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  
                  <div className="text-xs text-zinc-600">
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Create Post Component
  const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.gsap && containerRef.current) {
        const gsap = window.gsap;
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out"
        });
      }
    }, []);

    const handleSubmit = () => {
      if (!content.trim()) {
        setMessage('Content cannot be empty');
        return;
      }
      createPost(content.trim(), isPrivate);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-900/30">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-light text-white">Buat Post Baru</h1>
            <button
              onClick={() => {
                navigate('/dashboard');
                setMessage('');
              }}
              className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
            >
              Batal
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div ref={containerRef} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-zinc-400 mb-3">
                 Tulis pesanmu di sini
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent resize-none transition-all duration-300 font-light"
                  rows={8}
                  placeholder="Mau cerita apa hari ini? (Mendukung BBCode: [b]bold[/b], [i]italic[/i], [url=link]text[/url])"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={2000}
                  disabled={loading}
                />
                <div className="text-xs text-zinc-600 mt-2">
                  {content.length}/2000
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500/50"
                  disabled={loading}
                />
                <label htmlFor="private" className="text-sm text-zinc-400 flex items-center space-x-2 font-light">
                  <Lock size={14} />
                  <span>Post privat</span>
                </label>
              </div>

              {message && (
                <div className={`p-4 rounded-xl border text-sm ${
                  message.includes('berhasil') ? 
                  'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                  'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-light hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>{loading ? 'Mengirim...' : 'Kirim'}</span>
              </button>
            </div>

            <div className="mt-8 p-4 bg-zinc-800/30 border border-zinc-700/30 rounded-xl">
              <h3 className="font-light text-zinc-300 mb-3 text-sm">Petunjuk BBCode:</h3>
              <div className="text-xs text-zinc-500 space-y-2 font-light">
                <div><code className="text-emerald-400">[b]Bold[/b]</code> → <strong>Bold</strong></div>
                <div><code className="text-emerald-400">[i]Italic[/i]</code> → <em>Italic</em></div>
                <div><code className="text-emerald-400">[url=link]Text[/url]</code> → Link</div>
                <div><code className="text-emerald-400">[img]url[/img]</code> → Image</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const SinglePostView = () => {
    const { postId } = useParams();
    const [selectedPost, setSelectedPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [copied, setCopied] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
      const loadPost = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Harap login terlebih dulu!');
          navigate('/');
          return;
        }
        
        setLoadingPost(true);
        try {
          const response = await fetch(`${API_BASE}/posts/${postId}`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setSelectedPost(data.post);
          } else if (response.status === 401) {
            setMessage('Session expired. Harap login ulang.');
            logout();
          } else if (response.status === 404) {
            setMessage('Post tidak ditemukan');
            navigate('/dashboard');
          } else {
            setMessage('Gagal memuat postingan');
            navigate('/dashboard');
          }
        } catch (error) {
          // console.error('View post error:', error);
          setMessage('Koneksi error!');
          navigate('/dashboard');
        }
        setLoadingPost(false);
      };

      if (postId) {
        loadPost();
      }
    }, [postId, navigate]);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.gsap && contentRef.current && selectedPost) {
        const gsap = window.gsap;
        gsap.from(contentRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power3.out"
        });
      }
    }, [selectedPost]);

    if (loadingPost) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg font-light text-zinc-400">Loading post</div>
          </div>
        </div>
      );
    }

    if (!selectedPost) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-light text-zinc-400 mb-4">Post tidak ditemukan</div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
            >
              Kembali ke dashboard
            </button>
          </div>
        </div>
      );
    }

    const handleCopy = () => {
      navigator.clipboard.writeText(`${window.location.origin}/posts/${selectedPost.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <div className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-900/30">
          <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-light text-white">Post Details</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
            >
              Back
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div ref={contentRef} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
                  <User className="text-emerald-500" size={16} />
                </div>
                <div>
                  <span className="text-sm text-zinc-300 font-light">{selectedPost.username}</span>
                  {selectedPost.is_private && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Lock className="text-red-400" size={12} />
                      <span className="text-xs text-red-400">Private</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-zinc-600">
                {new Date(selectedPost.created_at).toLocaleString()}
              </div>
            </div>
            
            <div 
              className="text-zinc-300 mb-8 font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            <div className="border-t border-zinc-800/50 pt-6 mb-6">
              <h3 className="font-light text-zinc-400 mb-3 text-sm">Bagikan postingan ini</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/posts/${selectedPost.id}`}
                  className="flex-1 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-400 text-sm focus:outline-none"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 text-sm flex items-center space-x-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Tersalin ke clipboard' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-800/50 pt-6">
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <h4 className="font-light text-yellow-400 mb-2">Laporkan Posting</h4>
                    <p className="text-sm text-zinc-400 mb-4 font-light">
                      Nemuin hal yang nggak pantas? Langsung aja lapor ke admin.
                    </p>
                    <a
                      href="/report"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500/30 transition-all duration-300 text-sm font-light"
                    >
                      <AlertTriangle size={14} />
                      <span>Laporkan</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Routes
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute>
          <CreatePost />
        </ProtectedRoute>
      } />
      <Route path="/posts/:postId" element={
        <ProtectedRoute>
          <SinglePostView />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;