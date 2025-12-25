import React, {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import authApi from '../../api/authApi';

export default function RegisterForm(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const submit = async (e)=>{
    e.preventDefault();
    try{ await authApi.register({email,password}); }
    catch(err){console.error(err)}
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <CustomButton type="submit">Register</CustomButton>
    </form>
  )
}
