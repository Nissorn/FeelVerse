import React, { useState, useRef,useContext } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';


import AppContext from '../context/AppContext';

const Notepad = () => {
  const [showSquare, setShowSquare] = useState(false);
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedmood, setSelectedmood] = useState('');
  const [selectedscore, setSelectedscore] = useState(0);
  const [hovered, setHovered] = useState(false);
  const squareRef = useRef(null);
  const [datevalue, setValue] = React.useState(null);


  const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContext)

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleImageClick = () => {
    setShowSquare(true);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setShowSquare(false);
    setValue(null);
    setSelectedEmoji('');
    setSelectedscore(0);
    setText('');
    setShowSquare(false);
    setShowEmojis(false);
  };

  const handleTurnInClick = async (e) => {
    e.stopPropagation();
    if (!datevalue || !text || !selectedEmoji) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    console.log("Date:", datevalue);
    console.log("Note:", text);
    console.log("Emoji:", selectedEmoji);
    console.log("mood:", selectedmood);

    try {
      const {data} = await axios.post(backendUrl+'/api/note/insertnote',{
          date: datevalue,
          note: text,
          emoji: selectedEmoji,
          mood: selectedmood,
          score: selectedscore
        },{ withCredentials: true });

        console.log("Response:", data);

      if (data.success) {
        alert("Note saved successfully!");
        setValue(null);
        setSelectedEmoji('');
        setSelectedscore(0);
        setText('');
        setShowSquare(false);
        setShowEmojis(false);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.log("Error saving note:");
      alert("Something went wrong. Please try again.");
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleEmojiClick = (e) => {
    e.stopPropagation();
    setShowEmojis(!showEmojis);
  };

  const handleEmojiSelect = (emoji,name,score) => {
    setSelectedEmoji(emoji);
    setSelectedmood(name);
    setSelectedscore(score);
    setShowEmojis(false)
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-x-hidden">
      <div
        className="group relative w-[90vw] h-[90vh] max-w-4xl flex items-center justify-center rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleImageClick}
      >
        <div
          className={`relative w-full h-full rounded-lg transition-all duration-300 ease-in-out ${
            !showSquare ? 'group-hover:shadow-glow group-hover:scale-105' : ''
          }`}
          style={{
            backgroundImage: hovered
              ? 'url("/src/assets/note_page2.png")'
              : 'url("/src/assets/note_page1.png")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {showSquare && (
            <>
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-[#d4d4d4] rounded-t-md">
                <div className="flex items-center gap-4">
                  <div className="w-[60%] sm:w-[40%] md:w-[30%] lg:w-1/4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={datevalue}
                        onChange={(newValue) => setValue(newValue)}
                        format="DD-MM-YYYY"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                  <button
                    className="w-[45px] sm:w-[48px] md:w-[50px] h-[45px] sm:h-[48px] md:h-[50px] bg-[#c0c0c0] rounded flex items-center justify-center text-sm sm:text-base hover:bg-[#b0b0b0] transition-colors shadow-md"
                    onClick={handleEmojiClick}
                    title="Select mood"
                  >
                    {selectedEmoji || '😊'}
                  </button>
                </div>
                <button
                  className="bg-[#c0c0c0] text-black rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base hover:bg-[#b0b0b0] transition-colors shadow-md flex items-center gap-1"
                  onClick={handleCloseClick}
                >
                  <span>✕</span>
                </button>
              </div>
              <div ref={squareRef} className="absolute top-[120px] left-1/2 transform -translate-x-1/2 w-[80%] sm:w-[60%] md:w-[40%] lg:w-1/4 h-[calc(70%-80px)] sm:h-[calc(75%-80px)] bg-[#d4d4d4] border border-black flex flex-col items-center justify-center">
                <textarea
                  className="w-full h-full p-2 bg-transparent border-none resize-none focus:outline-none text-black"
                  value={text}
                  onChange={handleTextChange}
                />
              </div>
              <button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#d4d4d4] text-black rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base hover:bg-[#c0c0c0] transition-colors shadow-md"
                onClick={handleTurnInClick}
              >
                Turn in
              </button>
              {showEmojis && (
                <div className="absolute top-[60px] right-16 w-fit bg-[#b1b1b1] rounded-lg p-2 z-20 shadow-lg border border-gray-400">
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                    {[  {emoji:'💓',name:'Love',score : 100},
                        {emoji:'😂',name:'Joy',score : 77},
                        {emoji:'😟',name:'Worry',score : 40},
                        {emoji:'😡',name:'Angry',score : 30}, 
                        {emoji:'💪',name:'Courage',score : 68},
                        {emoji:'💔',name:'Sadness',score : 20},
                        {emoji:'😏',name:'Chill',score : 50}].map(({emoji,name,score}) => (
                      <button 
                        key={emoji}
                        className="text-xl sm:text-2xl p-1 sm:m-1 hover:bg-gray-300 rounded-md transition-colors active:scale-95"
                        onClick={() => handleEmojiSelect(emoji,name,score)}
                        title={name}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Notepad;
