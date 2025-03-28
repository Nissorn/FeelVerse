import React,{ useState, useEffect,useContext,useRef} from 'react';
import { data, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../context/AppContext';
import { FaPenAlt } from "react-icons/fa";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

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
  
  
  //editnote
  const [isModalEdit,setIsModalEdit]=useState(false);
  const squareRef = useRef(null);
  const OpenModalEdit=()=>setIsModalEdit(true);
  const [text,setText]=useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedmood, setSelectedmood] = useState('');
  const [selectedscore, setSelectedscore] = useState(0);
  const [datevalue, setValue] = React.useState(null);
  const [idtarget,setIdtarget]= useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const CloseModalEdit=(e)=>{
    setIsModalEdit(false);
    setSelectedEmoji('');
    setSelectedscore(0);
    setText('');
    setShowEmojis(false);
  }

  const handleTurnInClick = async (e) => {
      e.stopPropagation();
      if (!datevalue || !text || !selectedEmoji) {
        alert('Please fill in all fields before submitting.');
        return;
      }
      const formattedDate = dayjs(datevalue).format("YYYY-MM-DD");
      console.log("Id target:", idtarget);
      console.log("Date:", formattedDate);
      console.log("Note:", text);
      console.log("Emoji:", selectedEmoji);
      console.log("mood:", selectedmood);
      console.log("score:", selectedscore);
  
      try {
        const { data } = await axios.put(backendUrl + '/api/note/updatenodeobj', {     // ID of the note to be updated
            date: formattedDate,  // Formatted date
            note: text,           // Note text
            emoji: selectedEmoji, // Selected emoji
            mood: selectedmood,   // Selected mood
            score: selectedscore, // Selected score// Ensure the session or cookie is used
            idobj: idtarget
          },{withCredentials: true });

        console.log("Response:", data);

        if (data.success) {
            // alert("Note saved successfully!");
            // Reset state values after success
            setValue(null);
            setSelectedEmoji('');
            setSelectedscore(0);
            setText('');
            setShowEmojis(false);
            listday();
            CloseModalEdit();
        } else {
            alert("Error: " + data.message || 'Something went wrong');
        }
      } catch (error) {
        console.log("Error saving note:", error.message);  // Fix: Log error.message instead of data.message
        alert("Something went wrong. Please try again.");
      }
  };

  const handleEmojiClick = (e) => {
    setShowEmojis(!showEmojis);
  };

    const handleEmojiSelect = (emoji,name,score) => {
    setSelectedEmoji(emoji);
    setSelectedmood(name);
    setSelectedscore(score);
    setShowEmojis(false)
  };

  const handleEdit = async (id) => {
    console.log('get note with id:'+ id);
    setIdtarget(id);
    try{
        const response= await axios.get(backendUrl+'/api/note/notedobjid',{
          params: { idobj: id },
          withCredentials: true 
        });
        console.log("API Response:", response);
        if(response.data.success){
          const formattedDate = dayjs(response.data.note.date, "DD-MM-YYYY");
          setValue(formattedDate);

          setText(response.data.note.note);
          setSelectedEmoji(response.data.note.emoji);
          setSelectedmood(response.data.note.mood);
          setSelectedscore(response.data.note.score);
          console.log("Get complete: ", response.data);
          OpenModalEdit();
        }else{
          alert("Error: " + data.message);
        }
    }catch (error){
      alert("Error: " + data.message);
    }
  };
  
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
    return dateString;
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
        {isModalEdit && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 ">
            <button className="w-full h-full absolute bg-transparent" onClick={CloseModalEdit}></button>
            <div className="glass-card rounded-2xl shadow-lg p-6 space-y-4">
              <div className='w-[400px] h-[600px]'>
                <div className='flex flex-row  justify-between'>
                  <button className=" bg-[#d4d4d4] text-black rounded px-4 py-2" onClick={CloseModalEdit}>
                    Close
                  </button>
                  <div className='  bg-[#d4d4d4] rounded-md'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={datevalue}
                        onChange={(newValue) => setValue(newValue)}
                        format="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                  </div>
                  <button className="w-[50px] h-[55px] bg-[#d4d4d4] justify-center rounded-mdright-0 rounded " onClick={handleEmojiClick}>
                      {selectedEmoji || 'mood'}
                  </button>
                </div>
                
                <div ref={squareRef} className="w-full h-[82%] mt-2 bg-[#d4d4d4] border border-black flex flex-col items-center justify-center">
                    <textarea //Text area
                      className="w-full h-full p-2 bg-transparent border-none resize-none focus:outline-none text-black"
                      value={text}
                      onChange={handleTextChange}
                    />
                  </div>
                  

                  <button
                    className="mt-2 bg-[#d4d4d4] text-black rounded px-4 h-10 w-full"
                    onClick={handleTurnInClick}
                  >
                    Turn in
                  </button>
                  {showEmojis && (
                    <div className=" items-start flex absolute top-[20px] left-[70%] ">
                    <div className="bg-[#b1b1b1] rounded p-2">
                      {[  {emoji:'💓',name:'Love',score : 100},
                          {emoji:'😂',name:'Joy',score : 77},
                          {emoji:'😟',name:'Worry',score : 40},
                          {emoji:'😡',name:'Angry',score : 30}, 
                          {emoji:'💪',name:'Courage',score : 68},
                          {emoji:'💔',name:'Sadness',score : 20},
                          {emoji:'😏',name:'Chill',score : 50}].map(({emoji,name,score}) => (
                        <button 
                          key={emoji}
                          className="text-2xl  flex-col"
                          onClick={() => handleEmojiSelect(emoji,name,score)}
                          title={name}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Note;