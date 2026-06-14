import React from 'react'

/*
  Logo Component
  This is a reusable React functional component. It returns an SVG (Scalable Vector Graphic) which creates a coding-style logo.
*/

function Logo() {
  return (
    /*
      <svg>: Container element for SVG graphics
      viewBox="0 0 24 24" → Defines internal SVG coordinate system
      fill="none" → No default inside color filling
      xmlns: Tells browser this is SVG format
    */
    <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8 8L4 12L8 16"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round" 
        />
        <path
            d="M16 8L20 12L16 16"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13 4L11 20"
            stroke="#F8F8F2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
  )
}

export default Logo
