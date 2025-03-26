import { useState, useEffect,useContext} from 'react';
import { data, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../context/AppContext';
import { FaPenAlt } from "react-icons/fa";

  // Define the 7 mood types with their descriptions and colors
  const moodTypes = {
    Love: {
      emoji:'💓',
      description: 'Represents love, compassion, and warmth',
      color: '#C1292E' // Warm red/pink
    },
    Joy: {
      emoji:'😂',
      description: 'Represents joy, fun, and bright moments',
      color: '#FFC857' // Bright yellow
    },
    Worry: {
      emoji:'😟',
      description: 'Represents worry, uncertainty, and fear',
      color: '#7B9E89' // Muted green
    },
    Angry: {
      emoji:'😡',
      description: 'Represents intense emotions arising from conflict or dissatisfaction',
      color: '#a84A5F' // Deep red
    },
    Courage: {
      emoji:'💪',
      description: 'Represents courage in facing fear and obstacles',
      color: '#F26419' // Orange
    },
    Sadness: {
      emoji:'💔',
      description: 'Reflects sadness, loss, or the gloomy moments of the day',
      color: '#4056A1' // Deep blue
    },
    Chill: {
      emoji:'😏',
      description: 'Represents relaxation and peace',
      color: '#A4B6A1' // Light green
    }
  };

  

const Note = () => {
  const {backendUrl} = useContext(AppContext)
  const navigate = useNavigate();
  const { date } = useParams(); // Get the date parameter from the URL
  const [noteData, setNoteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxmoods,setMaxmoods]=useState('');
  const moodColor = moodTypes[maxmoods]?.color || "#888888";
  const [isEditVisible, setIsEditVisible] = useState(false); // ใช้เพื่อควบคุมการแสดงปุ่ม Edit/Delete
  
  const listday = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/note/noteday`, {
        params: { date },
        withCredentials: true
      });
      console.log("Response Data:", response.data);
      if (response.data.success) {
        console.log(response.data);
        setNoteData(response.data.notes)
        setMaxmoods(response.data.maxMood)
        console.log("NoteData : ", noteData);
        
      } else {
        console.error("Failed to fetch summary:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    console.log("CHECK: " + date.toString());
    listday();
  }, [date]);

  // Format date for display (e.g., "May 15, 2023")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // For now, just return the date parameter
    // In a real app, you would parse and format it properly
    return dateString;
  };

  const handleEdit = (id) => {
    alert('Edit note with id:'+ id);
    // ทำสิ่งที่ต้องการเมื่อกด Edit, เช่นเปิด Modal หรือไปหน้าแก้ไข
  };
  
  const handleDelete = async (id) => {
    console.log('Delete note with id:'+ id);
    try{
        const {data} = await axios.delete(backendUrl+'/api/note/notedelete',{
          params: { idobj: id },
          withCredentials: true 
        });
        
        if(data.success){
          listday();
        }else{
          alert("Error: " + data.message);
        }
    }catch (error){
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start pt-16 bg-black/0 overflow-hidden overflow-y-auto  h-[calc(100vh-120px)]">

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

      <div>
        <button
            className="fixed bottom-10 right-[22%] flex justify-between items-center p-5 transition-all duration-300 hover:scale-110 bg-white/20 hover:bg-white/30 rounded-full"
            onClick={() => setIsEditVisible((prev) => !prev)} // แสดง/ซ่อนปุ่ม Edit/Delete
        >
          <FaPenAlt size={30} />
        </button>
      </div>
      
      {/* Main Content */}
      <div className="w-full max-w-4xl mt-5 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-white">Loading...</div>
          </div>
        ) : noteData ? (

          <div className="space-y-6 animate-fadeIn">
            Mood Card
            <div 
              className={`glass-card p-6 rounded-xl relative overflow-hidden `}
              style={{
                background: `linear-gradient(135deg, ${moodColor} 0.0001%, rgba(28, 19, 144, 0.1))`,
                boxShadow: `0 1px 12px ${moodColor}`,
              }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Today's Mood</h2>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full" 
                    style={{ backgroundColor: moodColor, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)"}}
                  > <p className="pt-1 text-white text-lg font-bold text-center mt-1">{moodTypes[maxmoods]?.emoji || "?"}</p></div>
                  <p className="pt-1 text-white text-lg font-bold">
                    {maxmoods !== null ? maxmoods   : 'No Mood'}
                  </p>
                </div>
                <p className="text-white/80 text-sm italic">
                  {moodTypes[maxmoods]?.description || "You haven't added your mood for today" }
                </p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Notes</h2>
              <div className="space-y-4">
                
                
              {
                noteData.length > 0 ? (
                  noteData.map((note) => (
                    <div key={note._id} className="p-4 text-xl flex flex-row justify-between bg-white/10 rounded-lg">
                      <p className="text-white">{note.emoji}{"\t"}{note.note}</p>
                      {isEditVisible && (
                        <div className="mt-2">
                          <button className="w-16 bg-slate-400 rounded-md" onClick={() => handleEdit(note._id)}>
                            Edit
                          </button>
                          <button className="w-16 ml-3 bg-red-500 rounded-md" onClick={() => handleDelete(note._id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-white/60 text-center">No notes found</p>
                )
              }
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