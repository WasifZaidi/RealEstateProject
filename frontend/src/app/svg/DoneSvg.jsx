import React from 'react'

const DoneSvg = ({size="60px", color="#5758D6"}) => {
  return (
 <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill={color}
  >
    <path xmlns="http://www.w3.org/2000/svg" fill={color} d="m6.7 18l-5.65-5.65l1.425-1.4l4.25 4.25l1.4 1.4L6.7 18Zm5.65 0L6.7 12.35l1.4-1.425l4.25 4.25l9.2-9.2l1.4 1.425L12.35 18Zm0-5.65l-1.425-1.4L15.875 6L17.3 7.4l-4.95 4.95Z"/>
  </svg>
  )
}

export default DoneSvg