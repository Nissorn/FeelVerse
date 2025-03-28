import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Note = () => {
  const navigate = useNavigate();
  const { date } = useParams(); // Get the date parameter from the URL
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the 7 mood types with their descriptions and colors
  const moodTypes = {
    love: {
      name: 'Love',
      description: 'Represents love, compassion and warmth',
      color: '#E84A5F' // Warm red/pink
    },
    joy: {
      name: 'Joy',
      description: 'Represents joy, fun and bright moments',
      color: '#FFC857' // Bright yellow
    },
    worry: {
      name: 'Worry',
      description: 'Represents worry, uncertainty and fear',
      color: '#7B9E89' // Muted green
    },
    anger: {
      name: 'Anger',
      description: 'Represents intense emotions arising from conflict or dissatisfaction',
      color: '#C1292E' // Deep red
    },
    determination: {
      name: 'Determination',
      description: 'Represents determination, dreams, and inner drive',
      color: '#5F4BB6' // Purple
    },
    courage: {
      name: 'Courage',
      description: 'Represents courage in facing fear and obstacles',
      color: '#F26419' // Orange
    },
    sadness: {
      name: 'Sadness',
      description: 'Reflects sadness, loss or the gloomy moments of the day',
      color: '#4056A1' // Deep blue
    }
  };

  useEffect(() => {
    // In a real app, this would fetch data from your backend
    // For now, we'll simulate loading data
    const fetchNoteData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - in a real app, this would come from your API
        const mockData = {
          date: date,
          mood: {
            type: 'joy', // One of the 7 mood types
            description: moodTypes.joy.description,
            color: moodTypes.joy.color
          },
          notes: [
            {
              id: 1,
              content: 'Today was a great day! I accomplished all my tasks and had time to relax.',
              timestamp: '2023-05-15T14:30:00Z'
            },
            {
              id: 2,
              content: 'Evening reflection: Feeling grateful for the small moments of joy today.',
              timestamp: '2023-05-15T20:45:00Z'
            }
          ]
        };
        
        setNoteData(mockData);
      } catch (error) {
        console.error('Error fetching note data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchNoteData();
    }
  }, [date]);

  // Format date for display (e.g., "May 15, 2023")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // For now, just return the date parameter
    // In a real app, you would parse and format it properly
    return dateString;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-16 bg-black/0 overflow-hidden">
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-transparent backdrop-blur-sm">
        <button
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     flex items-center justify-center transition-all duration-300 hover:scale-110"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <span className="text-2xl text-white">←</span>
        </button>
        <div className="text-white text-lg font-medium">
          {formatDate(date)}
        </div>
        <button
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                     flex flex-col items-center justify-center gap-1 p-2 transition-all duration-300 hover:scale-110"
          aria-label="Menu"
        >
          <span className="w-4 h-[2px] bg-white"></span>
          <span className="w-4 h-[2px] bg-white"></span>
          <span className="w-4 h-[2px] bg-white"></span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl px-4 sm:px-6 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-white">Loading...</div>
          </div>
        ) : noteData ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Mood Card */}
            <div 
              className="glass-card p-6 rounded-xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${noteData.mood.color}40, rgba(28, 19, 144, 0.4))`,
                boxShadow: `0 0 40px 5px ${noteData.mood.color}30`
              }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Today's Mood</h2>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: noteData.mood.color }}
                  ></div>
                  <p className="text-white text-lg font-medium">
                    {moodTypes[noteData.mood.type]?.name || 'Unknown Mood'}
                  </p>
                </div>
                <p className="text-white/80 text-sm italic">
                  {noteData.mood.description}
                </p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Notes</h2>
              <div className="space-y-4">
                {noteData.notes.map((note) => (
                  <div key={note.id} className="p-4 bg-white/10 rounded-lg">
                    <p className="text-white">{note.content}</p>
                    <p className="text-white/60 text-xs mt-2">
                      {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Note Button */}
            <div className="flex justify-center mt-6">
              <button 
                className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm
                         flex items-center justify-center transition-all duration-300 hover:scale-105 text-white"
                onClick={() => {
                  // In a real app, this would open a form to add a new note
                  alert('Add new note functionality would go here');
                }}
              >
                Add New Note
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-white">No data found for this date.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Note;