import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate, useNavigate } from 'react-router-dom';
import { User, MessageSquare, Lock, Unlock, LogOut, AlertTriangle, Plus, Send, Eye, Edit, Trash2 } from 'lucide-react';

const API_BASE = '/api';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const navigate = useNavigate();

  // Auth functions
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
        setMessage('Login successful!');
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
        setMessage('Registration successful!');
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error occurred');
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
        setMessage('Post created successfully!');
        await loadPosts();
        navigate('/dashboard');
      } else if (response.status === 401) {
        setMessage('Session expired. Please login again.');
        logout();
      } else {
        setMessage(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Create post error:', error);
      setMessage('Network error occurred');
    }
    setLoading(false);
  };

  // Validate session on app initialization
  const validateSession = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <MessageSquare className="mx-auto mb-4 text-purple-600 animate-pulse" size={48} />
            <div className="text-lg font-medium text-gray-800">Loading...</div>
            <div className="text-sm text-gray-600 mt-2">Please wait</div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <MessageSquare className="mx-auto mb-4 text-purple-600" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">Menfess</h1>
            <p className="text-gray-600">Share your thoughts anonymously</p>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isLogin ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
              }`}
              onClick={() => {
                setIsLogin(true);
                setMessage('');
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isLogin ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
              }`}
              onClick={() => {
                setIsLogin(false);
                setMessage('');
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded-xl ${
              message.includes('successful') ? 
              'bg-green-50 border border-green-200 text-green-700' : 
              'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <MessageSquare className="text-purple-600" size={32} />
            <h1 className="text-xl font-bold text-gray-800">Menfess</h1>
            {user && (
              <span className="text-sm text-gray-500">Hello, {user.username}!</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                navigate('/create');
                setMessage('');
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Post</span>
            </button>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {message && (
          <div className={`mb-4 p-4 rounded-xl ${
            message.includes('successful') ? 
            'bg-green-50 border border-green-200 text-green-700' : 
            message.includes('expired') ? 
            'bg-yellow-50 border border-yellow-200 text-yellow-700' :
            'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{post.username}</span>
                    {post.is_private && (
                      <div className="flex items-center space-x-1">
                        <Lock className="text-red-500" size={14} />
                        <span className="text-xs text-red-500">Private</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/posts/${post.id}`)}
                      className="text-purple-600 hover:text-purple-800 transition-colors"
                      title="View post"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                <div 
                  className="text-gray-800 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                <div className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  // Create Post Component
  const CreatePost = () => {
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = () => {
      if (!content.trim()) {
        setMessage('Content cannot be empty');
        return;
      }
      createPost(content.trim(), isPrivate);
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Create New Post</h1>
            <button
              onClick={() => {
                navigate('/dashboard');
                setMessage('');
              }}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message (BBCode supported)
                </label>
                <textarea
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder="Share your thoughts... You can use BBCode: [b]bold[/b], [i]italic[/i], [url=link]text[/url], [img]url[/img]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={2000}
                  disabled={loading}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {content.length}/2000 characters
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="rounded focus:ring-purple-500"
                  disabled={loading}
                />
                <label htmlFor="private" className="text-sm text-gray-700 flex items-center space-x-1">
                  <Lock size={14} />
                  <span>Make this post private</span>
                </label>
              </div>

              {message && (
                <div className={`p-4 rounded-xl ${
                  message.includes('successful') ? 
                  'bg-green-50 border border-green-200 text-green-700' : 
                  'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-4 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send size={16} />
                <span>{loading ? 'Publishing...' : 'Publish Post'}</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-medium text-blue-800 mb-2">BBCode Help:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div><code>[b]Bold Text[/b]</code> → <strong>Bold Text</strong></div>
                <div><code>[i]Italic Text[/i]</code> → <em>Italic Text</em></div>
                <div><code>[url=https://example.com]Link[/url]</code> → <a href="#" className="text-blue-600 underline">Link</a></div>
                <div><code>[img]https://example.com/image.jpg[/img]</code> → Image</div>
                <div><code>[h1]Heading[/h1]</code> → <h1 className="text-lg font-bold">Heading</h1></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Single Post View Component
  const SinglePostView = () => {
    const { postId } = useParams();
    const [selectedPost, setSelectedPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(true);

    useEffect(() => {
      const loadPost = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please login first');
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
            setMessage('Session expired. Please login again.');
            logout();
          } else if (response.status === 404) {
            setMessage('Post not found');
            navigate('/dashboard');
          } else {
            setMessage('Failed to load post');
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('View post error:', error);
          setMessage('Network error occurred');
          navigate('/dashboard');
        }
        setLoadingPost(false);
      };

      if (postId) {
        loadPost();
      }
    }, [postId, navigate]);

    if (loadingPost) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="mx-auto mb-4 text-purple-600 animate-pulse" size={48} />
            <div className="text-lg font-medium text-gray-800">Loading post...</div>
          </div>
        </div>
      );
    }

    if (!selectedPost) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-gray-800">Post not found</div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">View Post</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <User className="text-gray-400" size={16} />
                <span className="text-sm text-gray-600">{selectedPost.username}</span>
                {selectedPost.is_private && (
                  <div className="flex items-center space-x-1">
                    <Lock className="text-red-500" size={14} />
                    <span className="text-xs text-red-500">Private</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(selectedPost.created_at).toLocaleString()}
              </div>
            </div>
            
            <div 
              className="text-gray-800 mb-6 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-800 mb-2">Share this post:</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/posts/${selectedPost.id}`}
                  className="flex-1 p-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                  onClick={(e) => e.target.select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/posts/${selectedPost.id}`);
                    setMessage('URL copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-600 mt-1" size={20} />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-800">Report this post</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      If this post violates our community guidelines, you can report it to our admin team.
                    </p>
                    <a
                      href="http://localhost:5000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <AlertTriangle size={16} />
                      <span>Report to Admin</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
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
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;