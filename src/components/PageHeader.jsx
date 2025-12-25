import React from 'react';

export default function PageHeader({title, actions}){
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',margin:'12px 0'}}>
      <h2>{title}</h2>
      <div>{actions}</div>
    </div>
  );
}
