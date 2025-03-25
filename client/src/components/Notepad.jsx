import React, { useState, useRef,useContext } from 'react';
import { gsap } from 'gsap';
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
    setText('');
    setShowSquare(false);
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

    try {
      const {data} = await axios.post(backendUrl+'/api/note/insertnote', {
          date: datevalue,
          note: text,
          emoji: selectedEmoji
        },{ withCredentials: true });

        console.log("Response:", data);

      if (data.success) {
        alert("Note saved successfully!");
        setValue(null);
        setSelectedEmoji('');
        setText('');
        setShowSquare(false);
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

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmojis(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
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
              <div ref={squareRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-3/4 bg-[#d4d4d4] border border-black flex flex-col items-center justify-center">
                <textarea //Text area
                  className="w-full h-full p-2 bg-transparent border-none resize-none focus:outline-none text-black"
                  value={text}
                  onChange={handleTextChange}
                />
              </div>
            <div className='absolute top-[20px] left-1/3 ml-8 w-1/5 bg-purple-100 rounded-md'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={datevalue}
                  onChange={(newValue) => setValue(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  />
              </LocalizationProvider>
            </div>
              <button
                className="absolute top-4 right-1/2 mr-24 transform -translate-x-1/2 bg-[#d4d4d4] text-black rounded px-4 py-2"
                onClick={handleCloseClick}
              >
                Close
              </button>

              <button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#d4d4d4] text-black rounded px-4 py-2"
                onClick={handleTurnInClick}
              >
                Turn in
              </button>

              <button
                className="absolute top-[20px] left-1/2 ml-16 w-[50px] h-[55px] bg-purple-300 rounded-mdright-0 rounded p-2"
                onClick={handleEmojiClick}
              >
                {selectedEmoji || 'Emoji'}
              </button>

              {showEmojis && (
                <div className="top-[20px]  ml-8 w-1/5 bg-purple-100 rounded-mdright-0 rounded p-2">
                  {['💓', '❤️‍🔥', '🔥', '😀', '😨', '💔'].map((emoji) => (
                    <button
                      key={emoji}
                      className="text-2xl m-1"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
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
