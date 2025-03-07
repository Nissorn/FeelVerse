import React from 'react'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full py-2 rounded-[0] glass-card">
        <p className="text-white text-center text-[10px]">
          &copy; {new Date().getFullYear()} Feel Verse. All rights reserved.
        </p>
    </footer>
  )
}

export default Footer