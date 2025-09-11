import React, { useState, useEffect } from 'react';
import { Heart, Clock, Camera, MessageCircle, Calendar, Star, MapPin, Coffee, Gamepad2, Plus, Send } from 'lucide-react';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('home');
  const [moodImran, setMoodImran] = useState('😊');
  const [moodAjsa, setMoodAjsa] = useState('💕');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeIn = (timezone: string) => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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

  const favorites = [
    { type: 'food', name: 'Pizza', person: 'Imran', emoji: '🍕' },
    { type: 'food', name: 'Tacos', person: 'Ajsa', emoji: '🌮' },
    { type: 'hobby', name: 'Photography', person: 'Imran', emoji: '📸' },
    { type: 'hobby', name: 'Reading', person: 'Ajsa', emoji: '📚' },
  ];

  const bucketList = [
    'Visit Paris together',
    'Try authentic Texas BBQ',
    'Watch sunrise from London Bridge',
    'Road trip across America',
  ];

  const dailyPrompts = [
    "What made you smile today?",
    "Share a photo of your current view",
    "What's your favorite memory of us?",
    "If you could teleport here right now, what would we do?",
  ];

  const loveNotes = [
    { from: 'Imran', message: 'Missing you extra today 💕', time: '2 hours ago' },
    { from: 'Ajsa', message: 'Can\'t wait to see you soon! 🥰', time: '4 hours ago' },
    { from: 'Imran', message: 'You make every day brighter ✨', time: '1 day ago' },
  ];

  const TabButton = ({ id, icon: Icon, label, active }: { id: string; icon: any; label: string; active: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
        active 
          ? 'bg-white/20 text-white shadow-lg scale-105' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg p-6 text-white">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-pink-300 mr-2" size={24} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              Together
            </h1>
            <Heart className="text-pink-300 ml-2" size={24} />
          </div>
          
          {/* Timezone Display */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <MapPin size={16} className="text-pink-300 mr-1" />
                <span className="text-sm font-medium">London, UK</span>
              </div>
              <div className="text-2xl font-bold text-pink-200">
                {getTimeIn('Europe/London')}
              </div>
              <div className="text-xs text-white/80">
                {getDateIn('Europe/London')}
              </div>
              <div className="mt-2 text-lg">Imran {moodImran}</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <MapPin size={16} className="text-purple-300 mr-1" />
                <span className="text-sm font-medium">Texas, USA</span>
              </div>
              <div className="text-2xl font-bold text-purple-200">
                {getTimeIn('America/Chicago')}
              </div>
              <div className="text-xs text-white/80">
                {getDateIn('America/Chicago')}
              </div>
              <div className="mt-2 text-lg">Ajsa {moodAjsa}</div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 space-y-4 flex-1">
          {activeTab === 'home' && (
            <div className="space-y-4">
              {/* Mood Selector */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-pink-300" />
                  How are you feeling?
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {['😊', '😍', '🥰', '😴', '😢', '🤗'].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setMoodImran(mood)}
                      className={`p-3 rounded-xl text-2xl transition-all duration-200 hover:scale-110 ${
                        moodImran === mood ? 'bg-pink-500/30 scale-110' : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Prompt */}
              <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Star size={18} className="mr-2 text-yellow-300" />
                  Today's Connection Prompt
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {dailyPrompts[0]}
                </p>
                <button className="flex items-center bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                  <Camera size={16} className="mr-2" />
                  Share Response
                </button>
              </div>

              {/* Quick Love Note */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <MessageCircle size={18} className="mr-2 text-blue-300" />
                  Send a Love Note
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="What's on your heart?"
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/60 text-sm"
                  />
                  <button className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-xl transition-colors duration-200">
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
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <h3 className="text-white font-semibold text-sm">{item.name}</h3>
                    <p className="text-white/70 text-xs mt-1">{item.person}'s favorite</p>
                  </div>
                ))}
                
                <button className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors duration-200">
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

              {bucketList.map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-pink-300 rounded-full mr-3 flex-shrink-0"></div>
                    <p className="text-white font-medium">{item}</p>
                  </div>
                </div>
              ))}

              <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition-transform duration-200">
                + Add New Dream
              </button>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">Love Notes</h2>
                <p className="text-white/80 text-sm">Sweet messages between us</p>
              </div>

              {loveNotes.map((note, index) => (
                <div key={index} className={`p-4 rounded-2xl border border-white/20 ${
                  note.from === 'Imran' 
                    ? 'bg-pink-500/20 ml-8' 
                    : 'bg-purple-500/20 mr-8'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold text-sm">{note.from}</span>
                    <span className="text-white/60 text-xs">{note.time}</span>
                  </div>
                  <p className="text-white/90 text-sm">{note.message}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-2">Our Calendar</h2>
                <p className="text-white/80 text-sm">Important dates & virtual dates</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-pink-300" />
                  Upcoming
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Virtual Movie Night</p>
                      <p className="text-white/70 text-sm">Saturday, 8 PM UK / 2 PM TX</p>
                    </div>
                    <div className="text-2xl">🍿</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Anniversary</p>
                      <p className="text-white/70 text-sm">In 23 days</p>
                    </div>
                    <div className="text-2xl">💕</div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-2xl font-semibold hover:scale-105 transition-transform duration-200">
                + Add New Date
              </button>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg p-4 border-t border-white/20">
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