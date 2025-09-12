import React, { useState, useEffect } from 'react';
import { Heart, Clock, Camera, MessageCircle, Calendar, Star, MapPin, Coffee, Gamepad2, Plus, Send } from 'lucide-react';

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
  const [favorites, setFavorites] = useState<Array<{type: string, name: string, person: string, emoji: string}>>([]);
  const [bucketList, setBucketList] = useState<string[]>([]);
  const [loveNotes, setLoveNotes] = useState<Array<{from: string, message: string, time: string}>>([]);
  const [movies, setMovies] = useState<Array<{title: string, addedBy: string, time: string}>>([]);
  const [weather, setWeather] = useState({
    manchester: { temp: 12, condition: 'cloudy', icon: '☁️' },
    texas: { temp: 28, condition: 'sunny', icon: '☀️' }
  });

  // Check for existing login session
  useEffect(() => {
    const savedUser = localStorage.getItem('together-current-user');
    if (savedUser && (savedUser === 'Imran' || savedUser === 'Ajsa')) {
      setCurrentUser(savedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('together-favorites');
    const savedBucketList = localStorage.getItem('together-bucket-list');
    const savedLoveNotes = localStorage.getItem('together-notes');
    const savedMovies = localStorage.getItem('together-movies');
    const savedMoodImran = localStorage.getItem('together-mood-imran');
    const savedMoodAjsa = localStorage.getItem('together-mood-ajsa');
    const savedMoodTextImran = localStorage.getItem('together-mood-text-imran');
    const savedMoodTextAjsa = localStorage.getItem('together-mood-text-ajsa');

    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedBucketList) setBucketList(JSON.parse(savedBucketList));
    if (savedLoveNotes) setLoveNotes(JSON.parse(savedLoveNotes));
    if (savedMovies) setMovies(JSON.parse(savedMovies));
    if (savedMoodImran) setMoodImran(savedMoodImran);
    if (savedMoodAjsa) setMoodAjsa(savedMoodAjsa);
    if (savedMoodTextImran) setMoodTextImran(savedMoodTextImran);
    if (savedMoodTextAjsa) setMoodTextAjsa(savedMoodTextAjsa);
  }, []);

  // Reload shared data when user changes (for notes, movies, etc.)
  useEffect(() => {
    if (currentUser) {
      const savedLoveNotes = localStorage.getItem('together-notes');
      const savedMovies = localStorage.getItem('together-movies');
      const savedFavorites = localStorage.getItem('together-favorites');
      const savedBucketList = localStorage.getItem('together-bucket-list');

      if (savedLoveNotes) setLoveNotes(JSON.parse(savedLoveNotes));
      if (savedMovies) setMovies(JSON.parse(savedMovies));
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedBucketList) setBucketList(JSON.parse(savedBucketList));
    }
  }, [currentUser]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('together-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('together-bucket-list', JSON.stringify(bucketList));
  }, [bucketList]);

  useEffect(() => {
    localStorage.setItem('together-notes', JSON.stringify(loveNotes));
  }, [loveNotes]);

  useEffect(() => {
    localStorage.setItem('together-movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('together-mood-imran', moodImran);
  }, [moodImran]);

  useEffect(() => {
    localStorage.setItem('together-mood-ajsa', moodAjsa);
  }, [moodAjsa]);

  useEffect(() => {
    localStorage.setItem('together-mood-text-imran', moodTextImran);
  }, [moodTextImran]);

  useEffect(() => {
    localStorage.setItem('together-mood-text-ajsa', moodTextAjsa);
  }, [moodTextAjsa]);

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

  // Functional handlers
  const addFavorite = (type: string, name: string, person: string, emoji: string) => {
    setFavorites([...favorites, { type, name, person, emoji }]);
  };

  const addBucketListItem = (item: string) => {
    setBucketList([...bucketList, item]);
  };

  const addLoveNote = (from: string, message: string) => {
    const now = new Date();
    const timeAgo = now.getTime() - now.getTime();
    const timeString = 'Just now';
    
    setLoveNotes([{ from, message, time: timeString }, ...loveNotes]);
  };

  const addMovie = (title: string, addedBy: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    setMovies([{ title, addedBy, time: timeString }, ...movies]);
  };

  const sendLoveNote = () => {
    if (newNote.trim()) {
      addLoveNote(currentUser || 'You', newNote.trim());
      setNewNote('');
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
                      onClick={() => currentUser === 'Imran' ? setMoodImran(mood) : setMoodAjsa(mood)}
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
                    onChange={(e) => currentUser === 'Imran' ? setMoodTextImran(e.target.value) : setMoodTextAjsa(e.target.value)}
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
                  {movies.slice(0, 3).map((movie, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-2 flex justify-between items-center">
                      <span className="text-white text-sm">{movie.title}</span>
                      <span className="text-blue-300 text-xs">{movie.addedBy} • {movie.time}</span>
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
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl transition-colors duration-200"
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
                {favorites.map((item, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/30">
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{item.person}'s favorite</p>
                    <button 
                      onClick={() => setFavorites(favorites.filter((_, i) => i !== index))}
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
                    const person = prompt('Who\'s favorite? (Imran/Ajsa)');
                    if (name && emoji && person) {
                      addFavorite('custom', name, person, emoji);
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
                bucketList.map((item, index) => (
                  <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 border-2 border-pink-300 rounded-full mr-3 flex-shrink-0"></div>
                        <p className="text-white font-medium">{item}</p>
                      </div>
                      <button 
                        onClick={() => setBucketList(bucketList.filter((_, i) => i !== index))}
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
                loveNotes.map((note, index) => (
                  <div key={index} className={`p-4 rounded-2xl border border-blue-500/30 ${
                    note.from === currentUser 
                      ? 'bg-blue-600/20 ml-8' 
                      : 'bg-blue-500/20 mr-8'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">{note.from}</span>
                      <span className="text-white/60 text-xs">{note.time}</span>
                    </div>
                    <p className="text-white/90 text-sm">{note.message}</p>
                  </div>
                ))
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