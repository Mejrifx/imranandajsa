import React, { useState, useEffect } from 'react';
import { Heart, Clock, Camera, MessageCircle, Calendar, Star, MapPin, Coffee, Gamepad2, Plus, Send } from 'lucide-react';
import { supabase, Note, Movie, Favorite, BucketListItem, UserMood } from './supabase';

// Login Component - moved outside to prevent re-creation on every render
const LoginPage = ({ onLogin }: { onLogin: (username: string, password: string) => boolean }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(username, password)) {
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-lg rounded-3xl p-8 border border-blue-500/30 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-blue-300 mr-2" size={32} />
            <h1 className="text-3xl font-bold text-blue-200">
              Distance doesn't matter...
            </h1>
            <Heart className="text-blue-300 ml-2" size={32} />
          </div>
          <p className="text-white/80 text-sm">Sign in to access your personal space</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-white/80 text-sm font-medium block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-slate-700/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="text-white/80 text-sm font-medium block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-700/50 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          {error && (
            <div className="text-red-300 text-sm text-center bg-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
          >
            Sign In
          </button>
        </form>

      </div>
    </div>
  );
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [moodImran, setMoodImran] = useState('😊');
  const [moodAjsa, setMoodAjsa] = useState('💕');
  const [moodTextImran, setMoodTextImran] = useState('');
  const [moodTextAjsa, setMoodTextAjsa] = useState('');
  const [newNote, setNewNote] = useState('');
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);
  const [loveNotes, setLoveNotes] = useState<Note[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [weather, setWeather] = useState({
    manchester: { temp: 12, condition: 'cloudy', icon: '☁️' },
    texas: { temp: 28, condition: 'sunny', icon: '☀️' }
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [moodTextTimeout, setMoodTextTimeout] = useState<NodeJS.Timeout | null>(null);

  // Check for existing login session
  useEffect(() => {
    const savedUser = localStorage.getItem('together-current-user');
    if (savedUser && (savedUser === 'Imran' || savedUser === 'Ajsa')) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Load data from Supabase on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Reload shared data when user changes
  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  // Supabase functions
  const loadAllData = async () => {
    await Promise.all([
      loadNotes(),
      loadMovies(),
      loadFavorites(),
      loadBucketList(),
      loadMoods()
    ]);
  };

  const loadNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error loading notes:', error);
    else setLoveNotes(data || []);
  };

  const loadMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error loading movies:', error);
    else setMovies(data || []);
  };

  const loadFavorites = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error loading favorites:', error);
    else setFavorites(data || []);
  };

  const loadBucketList = async () => {
    const { data, error } = await supabase
      .from('bucket_list')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error loading bucket list:', error);
    else setBucketList(data || []);
  };

  const loadMoods = async () => {
    const { data, error } = await supabase
      .from('user_moods')
      .select('*');
    
    if (error) console.error('Error loading moods:', error);
    else if (data) {
      const imranMood = data.find(m => m.user_name === 'Imran');
      const ajsaMood = data.find(m => m.user_name === 'Ajsa');
      
      if (imranMood) {
        setMoodImran(imranMood.mood_emoji);
        setMoodTextImran(imranMood.mood_text);
      }
      if (ajsaMood) {
        setMoodAjsa(ajsaMood.mood_emoji);
        setMoodTextAjsa(ajsaMood.mood_text);
      }
    }
  };

  // Save moods to Supabase when they change
  useEffect(() => {
    if (currentUser === 'Imran' && moodImran) {
      saveMood('Imran', moodImran, moodTextImran);
    }
  }, [moodImran, moodTextImran, currentUser]);

  useEffect(() => {
    if (currentUser === 'Ajsa' && moodAjsa) {
      saveMood('Ajsa', moodAjsa, moodTextAjsa);
    }
  }, [moodAjsa, moodTextAjsa, currentUser]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load weather on component mount
  useEffect(() => {
    getWeather();
  }, []);

  const getTimeIn = (timezone: string) => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getDateIn = (timezone: string) => {
    return new Date().toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  const moviePrompts = [
    "What movie should we watch tonight?",
    "Add a movie you've been wanting to see",
    "What's your all-time favorite movie?",
    "Add a movie we should watch together",
    "What movie made you cry the most?",
    "Add a comedy we should watch",
    "What's a movie you think I'd love?",
    "Add a classic movie to our list",
  ];

  // Supabase CRUD functions
  const addFavorite = async (type: string, name: string, person: string, emoji: string) => {
    console.log('Adding favorite:', { type, name, person, emoji });
    
    // Validate person field before sending to Supabase
    if (person !== 'Imran' && person !== 'Ajsa') {
      showToastNotification('❌ Person must be exactly "Imran" or "Ajsa"');
      return;
    }
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ type, name, person, emoji }])
      .select();
    
    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error('Error adding favorite:', error);
      showToastNotification(`❌ Failed to add favorite: ${error.message}`);
    } else if (data && data.length > 0) {
      setFavorites([data[0], ...favorites]);
      showToastNotification('⭐ Favorite added successfully!');
    } else {
      console.error('No data returned from Supabase');
      showToastNotification('❌ Failed to add favorite. No data returned.');
    }
  };

  const addBucketListItem = async (item: string) => {
    const { data, error } = await supabase
      .from('bucket_list')
      .insert([{ item }])
      .select();
    
    if (error) {
      console.error('Error adding bucket list item:', error);
      showToastNotification('❌ Failed to add dream. Try again.');
    } else if (data) {
      setBucketList([data[0], ...bucketList]);
      showToastNotification('✨ Dream added to our bucket list!');
    }
  };

  const addLoveNote = async (from: string, message: string) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ from_user: from, message }])
      .select();
    
    if (error) console.error('Error adding note:', error);
    else if (data) {
      setLoveNotes([data[0], ...loveNotes]);
    }
  };

  const addMovie = async (title: string, addedBy: string) => {
    const { data, error } = await supabase
      .from('movies')
      .insert([{ title, added_by: addedBy }])
      .select();
    
    if (error) {
      console.error('Error adding movie:', error);
      showToastNotification('❌ Failed to add movie. Try again.');
    } else if (data) {
      setMovies([data[0], ...movies]);
      showToastNotification('🎬 Movie added to our list!');
    }
  };

  const saveMood = async (userName: string, emoji: string, text: string) => {
    console.log('Saving mood:', { userName, emoji, text });
    
    const { error } = await supabase
      .from('user_moods')
      .upsert([{ user_name: userName, mood_emoji: emoji, mood_text: text }], {
        onConflict: 'user_name'
      });
    
    if (error) {
      console.error('Error saving mood:', error);
      showToastNotification(`❌ Failed to save mood: ${error.message}`);
    } else {
      console.log('Mood saved successfully');
    }
  };

  const deleteFavorite = async (id: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);
    
    if (error) console.error('Error deleting favorite:', error);
    else {
      setFavorites(favorites.filter(f => f.id !== id));
    }
  };

  const deleteBucketItem = async (id: string) => {
    const { error } = await supabase
      .from('bucket_list')
      .delete()
      .eq('id', id);
    
    if (error) console.error('Error deleting bucket item:', error);
    else {
      setBucketList(bucketList.filter(item => item.id !== id));
    }
  };

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const sendLoveNote = async () => {
    if (newNote.trim()) {
      try {
        await addLoveNote(currentUser || 'You', newNote.trim());
        setNewNote('');
        showToastNotification('💕 Note sent successfully!');
      } catch (error) {
        showToastNotification('❌ Failed to send note. Try again.');
      }
    }
  };

  const getRandomPrompt = () => {
    return moviePrompts[Math.floor(Math.random() * moviePrompts.length)];
  };

  // Simple weather function (mock data for demo)
  const getWeather = () => {
    const conditions = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
    const icons = ['☀️', '☁️', '🌧️', '⛅'];
    const manchesterTemp = Math.floor(Math.random() * 15) + 5; // 5-20°C
    const texasTemp = Math.floor(Math.random() * 20) + 20; // 20-40°C
    
    const manchesterCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const texasCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    setWeather({
      manchester: { 
        temp: manchesterTemp, 
        condition: manchesterCondition, 
        icon: icons[conditions.indexOf(manchesterCondition)]
      },
      texas: { 
        temp: texasTemp, 
        condition: texasCondition, 
        icon: icons[conditions.indexOf(texasCondition)]
      }
    });
  };

  // Authentication functions
  const handleLogin = (username: string, password: string) => {
    if ((username === 'Imran' && password === 'Imran') || 
        (username === 'Ajsa' && password === 'Ajsa')) {
      setCurrentUser(username);
      setIsLoggedIn(true);
      localStorage.setItem('together-current-user', username);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('together-current-user');
  };

  const TabButton = ({ id, icon: Icon, label, active }: { id: string; icon: any; label: string; active: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-blue-600/50 text-white shadow-lg scale-105' 
          : 'text-white/70 hover:text-white hover:bg-slate-700/50'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );


  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-900">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-enter">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg border border-blue-400/30 backdrop-blur-sm toast-glow">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium">{toastMessage}</span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto bg-slate-800/50 backdrop-blur-lg min-h-screen w-full relative main-content">
        {/* Header */}
        <div className="bg-slate-800/80 backdrop-blur-lg p-6 text-white border-b border-blue-500/30">
          {/* User info and logout */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-white/80 text-sm">
              Welcome back, <span className="font-semibold text-white">{currentUser}</span>!
            </div>
            <button
              onClick={handleLogout}
              className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
          
          {/* Timezone Display */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/30 shadow-lg">
              <div className="text-lg font-bold text-blue-200 mb-2">Imran</div>
              <div className="flex items-center justify-center mb-3">
                <MapPin size={14} className="text-blue-300 mr-1" />
                <span className="text-xs font-semibold text-blue-200">MANCHESTER</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {getTimeIn('Europe/London')}
              </div>
              <div className="text-xs text-blue-100 font-medium">
                {getDateIn('Europe/London')}
              </div>
              <div className="flex items-center justify-center mt-2 mb-2">
                <span className="text-2xl mr-2">{weather.manchester.icon}</span>
                <span className="text-sm text-blue-200 font-medium">{weather.manchester.temp}°C</span>
              </div>
              <div className="mt-3 text-sm text-blue-200 font-medium">{moodImran}</div>
            </div>
            
            <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/30 shadow-lg">
              <div className="text-lg font-bold text-blue-200 mb-2">Ajsa</div>
              <div className="flex items-center justify-center mb-3">
                <MapPin size={14} className="text-blue-300 mr-1" />
                <span className="text-xs font-semibold text-blue-200">TEXAS</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {getTimeIn('America/Chicago')}
              </div>
              <div className="text-xs text-blue-100 font-medium">
                {getDateIn('America/Chicago')}
              </div>
              <div className="flex items-center justify-center mt-2 mb-2">
                <span className="text-2xl mr-2">{weather.texas.icon}</span>
                <span className="text-sm text-blue-200 font-medium">{weather.texas.temp}°C</span>
              </div>
              <div className="mt-3 text-sm text-blue-200 font-medium">{moodAjsa}</div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-4 flex-1 pb-20">
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Mood Selector */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-blue-300" />
                  How are you feeling, {currentUser}?
                </h3>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {['😊', '😍', '🥰', '😴', '😢', '🤗'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => {
                        if (currentUser === 'Imran') {
                          setMoodImran(mood);
                          saveMood('Imran', mood, moodTextImran);
                        } else {
                          setMoodAjsa(mood);
                          saveMood('Ajsa', mood, moodTextAjsa);
                        }
                      }}
                      className={`p-3 rounded-xl text-2xl transition-all duration-200 hover:scale-110 ${
                        (currentUser === 'Imran' ? moodImran === mood : moodAjsa === mood) 
                          ? 'bg-blue-500/30 scale-110' 
                          : 'bg-slate-700/50 hover:bg-slate-600/50'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-white/80 text-sm font-medium block mb-2">Your mood today:</label>
                  <input
                    type="text"
                    value={currentUser === 'Imran' ? moodTextImran : moodTextAjsa}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (currentUser === 'Imran') {
                        setMoodTextImran(value);
                        // Debounce the save
                        if (moodTextTimeout) clearTimeout(moodTextTimeout);
                        const timeout = setTimeout(() => {
                          saveMood('Imran', moodImran, value);
                        }, 1000);
                        setMoodTextTimeout(timeout);
                      } else {
                        setMoodTextAjsa(value);
                        // Debounce the save
                        if (moodTextTimeout) clearTimeout(moodTextTimeout);
                        const timeout = setTimeout(() => {
                          saveMood('Ajsa', moodAjsa, value);
                        }, 1000);
                        setMoodTextTimeout(timeout);
                      }
                    }}
                    placeholder="How are you feeling today?"
                    className="w-full bg-slate-700/50 border border-blue-500/30 rounded-xl px-4 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Movies Section */}
              <div className="bg-blue-900/30 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 movie-section">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Star size={18} className="mr-2 text-yellow-300" />
                  Movies We Should Watch
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  Movies we should watch eventually...
                </p>
                <div className="space-y-2 mb-3">
                  {movies.slice(0, 3).map((movie) => (
                    <div key={movie.id} className="bg-slate-800/50 rounded-lg p-2 flex justify-between items-center">
                      <span className="text-white text-sm">{movie.title}</span>
                      <span className="text-blue-300 text-xs">
                        {movie.added_by} • {new Date(movie.created_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const movieTitle = prompt('What movie should we watch?');
                    if (movieTitle && movieTitle.trim()) {
                      addMovie(movieTitle.trim(), currentUser || 'You');
                    }
                  }}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  Add Movie
                </button>
              </div>

              {/* Quick Love Note */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <MessageCircle size={18} className="mr-2 text-blue-300" />
                  Send a note to {currentUser === 'Imran' ? 'Ajsa' : 'Imran'}
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendLoveNote()}
                    placeholder="What's on your heart?"
                    className="flex-1 bg-slate-700/50 border border-blue-500/30 rounded-xl px-4 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button 
                    onClick={sendLoveNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">Our Favorites</h2>
                <p className="text-white/80 text-sm">The things we love</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {favorites.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/30">
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{item.person}'s favorite</p>
                    <button 
                      onClick={() => deleteFavorite(item.id)}
                      className="text-red-300 text-xs mt-2 hover:text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    const name = prompt('What\'s the name?');
                    const emoji = prompt('What emoji? (e.g., 🍕)');
                    const person = prompt('Who\'s favorite? (Type exactly: Imran or Ajsa)');
                    const type = prompt('What type? (e.g., Food, Movie, Place, etc.)');
                    
                    // Validate person field
                    if (name && emoji && type && person && (person === 'Imran' || person === 'Ajsa')) {
                      addFavorite(type, name, person, emoji);
                    } else if (person && person !== 'Imran' && person !== 'Ajsa') {
                      showToastNotification('❌ Person must be exactly "Imran" or "Ajsa"');
                    } else if (!name || !emoji || !type || !person) {
                      showToastNotification('❌ Please fill in all fields');
                    }
                  }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/30 hover:bg-slate-700/50 transition-colors duration-200"
                >
                  <Plus className="text-white mx-auto mb-2" size={24} />
                  <p className="text-white text-sm font-medium">Add New</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bucket' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">Our Bucket List</h2>
                <p className="text-white/80 text-sm">Dreams we'll make reality</p>
              </div>

              {bucketList.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="text-white/50 mx-auto mb-3" size={48} />
                  <p className="text-white/70 text-sm">No dreams added yet. Start adding your bucket list items!</p>
                </div>
              ) : (
                bucketList.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-pink-300 rounded-full mr-3 flex-shrink-0"></div>
                        <p className="text-white font-medium">{item.item}</p>
                      </div>
                      <button 
                        onClick={() => deleteBucketItem(item.id)}
                        className="text-red-300 text-sm hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button 
                onClick={() => {
                  const item = prompt('What dream would you like to add?');
                  if (item && item.trim()) {
                    addBucketListItem(item.trim());
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition-transform duration-200"
              >
                + Add New Dream
              </button>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">Notes to Each Other</h2>
                <p className="text-white/80 text-sm">Sweet messages between us</p>
              </div>

              {loveNotes.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="text-white/50 mx-auto mb-3" size={48} />
                  <p className="text-white/70 text-sm">No notes yet. Start sharing your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loveNotes.map((note) => (
                    <div 
                      key={note.id} 
                      className={`paper-note p-6 relative ${
                        note.from_user === currentUser 
                          ? 'note-from-imran' 
                          : 'note-from-ajsa'
                      }`}
                    >
                      <div className="note-pin"></div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="handwritten-text font-bold text-lg text-gray-800">
                          {note.from_user}
                        </span>
                        <span className="note-timestamp">
                          {new Date(note.created_at).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                          })}
                        </span>
                      </div>
                      <p className="handwritten-text text-gray-700 text-base leading-relaxed">
                        {note.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">Our Calendar</h2>
                <p className="text-white/80 text-sm">Important dates & virtual dates</p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-blue-300" />
                  Time Difference
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Current Time Difference</p>
                      <p className="text-white/70 text-sm">
                        {(() => {
                          const london = new Date().toLocaleString("en-US", {timeZone: "Europe/London"});
                          const texas = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
                          const londonTime = new Date(london);
                          const texasTime = new Date(texas);
                          const diffHours = Math.abs(londonTime.getHours() - texasTime.getHours());
                          return `${diffHours} hours apart`;
                        })()}
                      </p>
                    </div>
                    <div className="text-2xl">⏰</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Best Call Times</p>
                      <p className="text-white/70 text-sm">Evening UK / Afternoon TX</p>
                    </div>
                    <div className="text-2xl">📞</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-300" />
                  Quick Tips
                </h3>
                <div className="space-y-2 text-sm text-white/80">
                  <p>• Manchester is 6 hours ahead of Texas</p>
                  <p>• Best time to call: 7-9 PM Manchester / 1-3 PM Texas</p>
                  <p>• Weekend mornings work well for both</p>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>

      {/* Bottom Navigation - Outside main container */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-lg border-t border-blue-500/30">
        <div className="max-w-md mx-auto p-4">
          <div className="grid grid-cols-5 gap-2">
            <TabButton id="home" icon={Heart} label="Home" active={activeTab === 'home'} />
            <TabButton id="favorites" icon={Coffee} label="Favorites" active={activeTab === 'favorites'} />
            <TabButton id="bucket" icon={Star} label="Dreams" active={activeTab === 'bucket'} />
            <TabButton id="notes" icon={MessageCircle} label="Notes" active={activeTab === 'notes'} />
            <TabButton id="calendar" icon={Calendar} label="Calendar" active={activeTab === 'calendar'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;