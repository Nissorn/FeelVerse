import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import storyImg1 from '../assets/storyImg1.jpg';
import storyImg2 from '../assets/storyImg2.jpg';

function Story() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    // Show content for current page
    showCurrentPage();
    
    // Return to cleanup animation timeline when component unmounts
    return () => {
      // Cleanup will be handled in showCurrentPage
    };
  }, [navigate, currentPage]); // Added currentPage as dependency to re-run when page changes
  
  const handleNextPage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Fade out current content
    const tl = gsap.timeline();
    tl.to(['.loading-dot', '.story-text-1', '.story-text-2', '.story-text-3', '.story-text-4', '.next-button'], {
      opacity: 0,
      y: -20,
      duration: 0.5,
      stagger: 0.1,
      onComplete: () => {
        if (currentPage === 5) {
          navigate('/home');
        } else {
          setCurrentPage(prev => prev + 1);
          setIsTransitioning(false);
          showCurrentPage();
        }
      }
    });
  };

  const showCurrentPage = () => {
    const tl = gsap.timeline();
    
    // Reset opacity and position for all possible elements
    gsap.set(['.loading-dot', '.story-text-1', '.story-text-2', '.story-text-3', '.story-text-4', '.story-image', '.next-button'], {
      opacity: 0,
      y: -30,
      scale: currentPage > 1 ? 0.8 : 1 // Set initial scale for images
    });

    // Animate elements in
    tl.fromTo('.loading-dot', 
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, stagger: 0.3, duration: 0.5, ease: "power2.out" }
    );
    
    if (currentPage === 1) {
      tl.fromTo('.story-text-1', 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.5'
      );
      
      tl.fromTo('.story-text-2', 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=1'
      );
      
      tl.fromTo('.story-text-3', 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=1'
      );
      
      tl.fromTo('.story-text-4', 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=1'
      );
    } else if (currentPage === 2) {
      tl.fromTo('.story-image',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        '+=0.5'
      );
      
      tl.fromTo('.story-text-1',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.3'
      );
    } else if (currentPage === 3) {
      tl.fromTo('.story-text-1',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.5'
      );
      
      tl.fromTo('.story-text-2',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
        '+=0.8'
      );
      
      tl.fromTo('.story-text-3',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.8'
      );

      tl.fromTo('.story-image',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
        '+=0.5'
      );
    } else if (currentPage === 4) {
      tl.fromTo('.story-text-1',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.5'
      );
      
      tl.fromTo('.story-text-2',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.8'
      );
      
      tl.fromTo('.story-text-3',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.8'
      );
      
      tl.fromTo('.story-text-4',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.8'
      );
    } else if (currentPage === 5) {
      tl.fromTo('.story-text-1',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '+=0.5'
      );
    }

    // Animate next button
    tl.fromTo('.next-button',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '+=0.5'
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white" ref={containerRef}>
      {/* Loading dots */}
      <div className="flex flex-col space-y-2 mb-10">
        <div className="loading-dot w-1 h-1 bg-white rounded-full"></div>
        <div className="loading-dot w-1 h-1 bg-white rounded-full"></div>
        <div className="loading-dot w-1 h-1 bg-white rounded-full"></div>
      </div>
      
      {/* Story text elements */}
      <div className="flex flex-col items-center space-y-16 px-4">
        {currentPage === 1 && (
          <>
            <p className="story-text-1 text-center text-lg">คุณเดินขึ้นมา กลางอวกาศ ที่กว้างใหญ่</p>
            <p className="story-text-2 text-center text-lg">ไม่มีน้ำหนัก</p>
            <p className="story-text-3 text-center text-lg">ไม่มีจุดหมาย</p>
            <p className="story-text-4 text-center text-lg">เสียงหนึ่งดังขึ้นในจิตใจ</p>
          </>
        )}
        {currentPage === 2 && (
          <div className="flex flex-col items-center space-y-16 w-full">
            <div className="story-image w-[30vh] h-70 mb-8 relative overflow-hidden">
                <img src={storyImg1}
                     alt="Story1"
                     className='w-full h-full object-cover'
                     />
            </div>
            <p className="story-text-1 text-center text-md font-bold mb-8">ยินดีต้อนรับสู่ FeelVerse - จักรวาลแห่งความรู้สึก</p>
          </div>
        )}
        {currentPage === 3 && (
          <div className="flex flex-col items-center space-y-16 w-full">
            <p className="story-text-1 text-center text-md font-bold mb-8">จักรวาลแห่งนี้ถูกสร้างจาก</p>
            <p className="story-text-2 text-center text-md mb-8">อารมณ์</p>
            <div className="story-image w-[30vh] h-70 mb-8 relative overflow-hidden">
                <img src={storyImg2}
                     alt="Story1"
                     className='w-full h-full object-cover'
                     />
            </div>
            <p className="story-text-3 text-center text-md mb-8">ความทรงจำ และความคิดของคุณเอง</p>
          </div>
        )}
        {currentPage === 4 && (
          <div className="flex flex-col items-center space-y-16 w-full">
            <p className="story-text-1 text-center text-md font-bold mb-8">อารมณ์ของทุกอย่างเปรียบเสมือนดวงดาวในจักรวาล</p>
            <p className="story-text-2 text-center text-md mb-8">บางดวงอาจส่องสว่าง</p>
            <p className="story-text-3 text-center text-md mb-8">บางดวงอาจหลบซ่อนอยู่ในเงามืด</p>
            <p className="story-text-4 text-center text-md mb-8">แต่ทั้งหมดล้วนมีความหมาย</p>
          </div>
        )}
        {currentPage === 5 && (
          <div className="flex flex-col items-center space-y-16 w-full">
            <p className="story-text-1 text-center text-md font-bold mb-8">คุณพร้อมที่จะออกเดินทางเพื่อค้นหาความรู้สึกที่หลบซ่อนอยู่ของตัวเองหรือยัง</p>
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={handleNextPage}
        className="next-button fixed bottom-8 right-8 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        disabled={isTransitioning}
      >
        Next →
      </button>
      
      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Story;