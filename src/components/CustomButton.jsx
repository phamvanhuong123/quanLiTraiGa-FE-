import React from 'react';

export default function CustomButton({children,...props}){
  return (
    <button {...props} style={{padding:'8px 12px',borderRadius:8}}>{children}</button>
  );
}
