import React from 'react';
import './css/BackArrow.css'; // 共通CSS

const BackArrow = ({ onClick, onPointerDown, hiding = false }) => {
  return(

  <button    
    onPointerDown={onPointerDown}
    onClick = {onClick}
    className={`arrow-button ${hiding ? 'is-hiding' : ''}`}
    aria-label="戻る"
    >
    <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
       <path style={{ fill: '#030104' }} d="M6,6V3L0,8l6,5v-3c4-1,7-0.5,10,2C14,7,10.5,6,6,6z" />
     </svg>
  </button>
  );
}

// const BackArrow = ({ onClick }) => (
//   <button onClick={onClick} className="arrow-button" aria-label="戻る">
//     <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
//       <path style={{ fill: '#030104' }} d="M6,6V3L0,8l6,5v-3c4-1,7-0.5,10,2C14,7,10.5,6,6,6z" />
//     </svg>
//   </button>
// );

export default BackArrow;
