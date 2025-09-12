import React, { useState, useEffect } from 'react';
import { Heart, Clock, Camera, MessageCircle, Calendar, Star, MapPin, Coffee, Gamepad2, Plus, Send } from 'lucide-react';
import { supabase, Note, Movie, Favorite, BucketListItem, UserMood, DailyPhoto } from './supabase';

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
  const [dailyPhotos, setDailyPhotos] = useState<DailyPhoto[]>([]);
  const [weather, setWeather] = useState({
    manchester: { temp: 12, condition: 'cloudy', icon: '☁️' },
    texas: { temp: 28, condition: 'sunny', icon: '☀️' }
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [birthdays, setBirthdays] = useState<{user_name: string, birth_date: string}[]>([]);

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
      loadMoods(),
      loadDailyPhotos(),
      loadBirthdays()
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

  const loadDailyPhotos = async () => {
    const { data, error } = await supabase
      .from('daily_photos')
      .select('*')
      .order('photo_date', { ascending: false });
    
    if (error) console.error('Error loading daily photos:', error);
    else setDailyPhotos(data || []);
  };

  const loadBirthdays = async () => {
    const { data, error } = await supabase
      .from('birthdays')
      .select('*');
    
    if (error) console.error('Error loading birthdays:', error);
    else setBirthdays(data || []);
  };

  const saveBirthday = async (userName: string, birthDate: string) => {
    const { data, error } = await supabase
      .from('birthdays')
      .upsert([{
        user_name: userName,
        birth_date: birthDate
      }], { onConflict: 'user_name' })
      .select();
    
    if (error) console.error('Error saving birthday:', error);
    else {
      setBirthdays([data[0], ...birthdays.filter(b => b.user_name !== userName)]);
      showToastNotification('🎂 Birthday saved!');
    }
  };

  const calculateTimeUntilBirthday = (birthDate: string) => {
    const today = new Date();
    const birthday = new Date(birthDate);
    
    // Set birthday to this year
    birthday.setFullYear(today.getFullYear());
    
    // If birthday has passed this year, set to next year
    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffMs = birthday.getTime() - today.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  // Note: Mood saving is now handled explicitly in the mood button click handlers
  // and mood text input handlers, not automatically on state change

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

  const addDailyPhoto = async (photoUrl: string, caption: string) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const { data, error } = await supabase
      .from('daily_photos')
      .upsert([{ 
        user_name: currentUser, 
        photo_url: photoUrl, 
        caption: caption,
        photo_date: today
      }], { onConflict: 'user_name,photo_date' })
      .select();
    
    if (error) console.error('Error adding daily photo:', error);
    else {
      setDailyPhotos([data[0], ...dailyPhotos.filter(photo => 
        !(photo.user_name === currentUser && photo.photo_date === today)
      )]);
      showToastNotification('📸 Pic of the day added!');
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', event.target.files);
    const file = event.target.files?.[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToastNotification('❌ Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToastNotification('❌ Image too large. Please select an image under 5MB');
      return;
    }

    setIsUploadingPhoto(true);
    showToastNotification('📸 Processing image...');

    try {
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        console.log('Image converted to base64, length:', dataUrl.length);
        
        // Ask for caption
        const caption = prompt('Add a caption (optional):') || '';
        
        // Add the photo
        await addDailyPhoto(dataUrl, caption);
        
        // Reset the input
        event.target.value = '';
        setIsUploadingPhoto(false);
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        showToastNotification('❌ Error reading image file');
        setIsUploadingPhoto(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      showToastNotification('❌ Error processing image. Please try again.');
      setIsUploadingPhoto(false);
    }
  };

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Helper function to get name color based on user
  const getNameColor = (name: string) => {
    if (name === 'Ajsa') return 'text-pink-400';
    if (name === 'Imran') return 'text-cyan-400';
    return 'text-blue-300';
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
              {moodTextImran && (
                <div className="mt-1 text-xs text-blue-100 italic">"{moodTextImran}"</div>
              )}
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
              {moodTextAjsa && (
                <div className="mt-1 text-xs text-blue-100 italic">"{moodTextAjsa}"</div>
              )}
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentUser === 'Imran' ? moodTextImran : moodTextAjsa}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (currentUser === 'Imran') {
                          setMoodTextImran(value);
                        } else {
                          setMoodTextAjsa(value);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (currentUser === 'Imran') {
                            saveMood('Imran', moodImran, moodTextImran);
                            showToastNotification('😊 Mood text saved!');
                          } else {
                            saveMood('Ajsa', moodAjsa, moodTextAjsa);
                            showToastNotification('😊 Mood text saved!');
                          }
                        }
                      }}
                      placeholder="How are you feeling today?"
                      className="flex-1 bg-slate-700/50 border border-blue-500/30 rounded-xl px-4 py-2 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button
                      onClick={() => {
                        if (currentUser === 'Imran') {
                          saveMood('Imran', moodImran, moodTextImran);
                          showToastNotification('😊 Mood text saved!');
                        } else {
                          saveMood('Ajsa', moodAjsa, moodTextAjsa);
                          showToastNotification('😊 Mood text saved!');
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-500/25 flex items-center"
                    >
                      <Send size={16} />
                    </button>
                  </div>
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
                  {movies.map((movie) => (
                    <div key={movie.id} className="bg-slate-800/50 rounded-lg p-2 flex justify-between items-center">
                      <span className="text-white text-sm">{movie.title}</span>
                      <span className="text-xs">
                        <span className={getNameColor(movie.added_by)}>{movie.added_by}</span>
                        <span className="text-blue-300"> • {new Date(movie.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} {new Date(movie.created_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false 
                        })}</span>
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
                  Send a note to <span className={getNameColor(currentUser === 'Imran' ? 'Ajsa' : 'Imran')}> {currentUser === 'Imran' ? 'Ajsa' : 'Imran'}</span>
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
                    <p className="text-xs mt-1">
                      <span className={getNameColor(item.person)}>{item.person}</span>
                      <span className="text-white/70">'s favorite</span>
                    </p>
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
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-blue-400" size={32} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Your Bucket List Awaits</h3>
                  <p className="text-blue-200/80 text-sm leading-relaxed">Start adding your dreams and goals. Every journey begins with a single step!</p>
                </div>
              ) : (
                bucketList.map((item, index) => (
                  <div key={item.id} className="group bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mr-4 flex-shrink-0 shadow-lg">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-base leading-relaxed">{item.item}</p>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            <span className="text-blue-300 text-xs font-medium">Bucket List Goal</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteBucketItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200 p-2 hover:bg-red-500/10 rounded-lg"
                        title="Remove from bucket list"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}

              <button 
                onClick={() => {
                  const item = prompt('What dream would you like to add to your bucket list?');
                  if (item && item.trim()) {
                    addBucketListItem(item.trim());
                  }
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Goal
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
                        <span className={`handwritten-text font-bold text-lg ${getNameColor(note.from_user)}`}>
                          {note.from_user}
                        </span>
                        <span className="note-timestamp">
                          {new Date(note.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} • {new Date(note.created_at).toLocaleTimeString('en-US', { 
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
                <p className="text-white/80 text-sm">Important dates & Pics of the day</p>
              </div>

              {/* Pic of the Day - Now at the top */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Camera size={18} className="mr-2 text-blue-300" />
                  Pic of the Day
                </h3>
                <p className="text-white/80 text-sm mb-4">Share your daily moments</p>
                
                {/* Add Photo Section */}
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ 
                      position: 'absolute',
                      left: '-9999px',
                      opacity: 0,
                      pointerEvents: 'none'
                    }}
                    id="photo-upload"
                    multiple={false}
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Button clicked, looking for file input...');
                      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
                      console.log('File input found:', fileInput);
                      if (fileInput) {
                        console.log('Triggering file input click...');
                        // Force focus and click
                        fileInput.focus();
                        fileInput.click();
                      } else {
                        console.error('File input not found!');
                        showToastNotification('❌ File input not found. Please refresh the page.');
                      }
                    }}
                    disabled={isUploadingPhoto}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                      isUploadingPhoto 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-[1.02] hover:shadow-blue-500/25 cursor-pointer'
                    }`}
                  >
                    {isUploadingPhoto ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Add Today's Pic
                      </>
                    )}
                  </button>
                  <p className="text-xs text-blue-200/80 text-center mt-2">
                    Tap to take a photo or select from gallery
                  </p>
                </div>

                {/* Display Recent Photos */}
                {dailyPhotos.length === 0 ? (
                  <div className="text-center py-4">
                    <Camera className="text-white/50 mx-auto mb-2" size={32} />
                    <p className="text-white/70 text-sm">No pics shared yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dailyPhotos.slice(0, 3).map((photo) => (
                      <div key={photo.id} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-semibold text-sm ${getNameColor(photo.user_name)}`}>
                            {photo.user_name}
                          </span>
                          <span className="text-xs text-blue-300">
                            {new Date(photo.photo_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <img 
                          src={photo.photo_url} 
                          alt={photo.caption || 'Daily photo'} 
                          className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(photo.photo_url)}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik04MCA0OEwxMjAgODhMODAgMTI4SDQwVjQ4SDgwWiIgZmlsbD0iIzYzNjY3MSIvPgo8Y2lyY2xlIGN4PSI2MCIgY3k9IjQ4IiByPSIxNiIgZmlsbD0iIzYzNjY3MSIvPgo8dGV4dCB4PSIxMDAiIHk9IjY0IiBmaWxsPSIjOUI5QkE1IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+VW5hYmxlIHRvIGxvYWQ8L3RleHQ+Cjwvc3ZnPg==';
                          }}
                        />
                        {photo.caption && (
                          <p className="text-white/80 text-xs italic">"{photo.caption}"</p>
                        )}
                      </div>
                    ))}
                    {dailyPhotos.length > 3 && (
                      <p className="text-center text-blue-300 text-xs">
                        +{dailyPhotos.length - 3} more photos
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Our Birthdays - Replaced Quick Tips */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-blue-300" />
                  Our Birthdays
                </h3>
                <p className="text-white/80 text-sm mb-4">Countdown to our special days</p>
                
                {/* Birthday Input */}
                <div className="mb-4">
                  <button
                    onClick={() => {
                      const birthDate = prompt(`Enter ${currentUser}'s birthday (YYYY-MM-DD):`);
                      if (birthDate && birthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        saveBirthday(currentUser, birthDate);
                      } else if (birthDate) {
                        showToastNotification('❌ Please enter date in YYYY-MM-DD format');
                      }
                    }}
                    className="w-full py-2 px-4 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/25"
                  >
                    🎂 Set {currentUser}'s Birthday
                  </button>
                </div>

                {/* Display Birthdays */}
                {birthdays.length === 0 ? (
                  <div className="text-center py-4">
                    <Heart className="text-white/50 mx-auto mb-2" size={32} />
                    <p className="text-white/70 text-sm">No birthdays set yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {birthdays.map((birthday) => {
                      const countdown = calculateTimeUntilBirthday(birthday.birth_date);
                      return (
                        <div key={birthday.user_name} className="bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-semibold text-sm ${getNameColor(birthday.user_name)}`}>
                              {birthday.user_name}'s Birthday
                            </span>
                            <span className="text-xs text-blue-300">
                              {new Date(birthday.birth_date).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-slate-600/50 rounded-lg p-2">
                              <div className="text-lg font-bold text-white">{countdown.days}</div>
                              <div className="text-xs text-white/70">Days</div>
                            </div>
                            <div className="bg-slate-600/50 rounded-lg p-2">
                              <div className="text-lg font-bold text-white">{countdown.hours}</div>
                              <div className="text-xs text-white/70">Hours</div>
                            </div>
                            <div className="bg-slate-600/50 rounded-lg p-2">
                              <div className="text-lg font-bold text-white">{countdown.minutes}</div>
                              <div className="text-xs text-white/70">Minutes</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
            </div>
          )}
        </div>
        </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img 
              src={selectedImage} 
              alt="Full size photo" 
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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