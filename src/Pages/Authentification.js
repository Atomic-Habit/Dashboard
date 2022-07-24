import React from 'react'
import { useState, useEffect } from 'react'
import uiux from '../images/uiux.jpg'
import { auth, logInWithEmailAndPassword } from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const Authentification = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, loading, error] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) navigate("/");
  }, [user, loading]);


  const handlerSubmit = () => {
    logInWithEmailAndPassword(email, password)
  }

  return (
    <section id='authentification' className='flex h-[100vh]'>
      <div className="left-container h-full flex-1">
        <div className="image h-full" style={{ backgroundImage: 'url(' + uiux + ')', backgroundSize: "cover", backgroundPosition: "center" }}></div>
      </div>
      <div className="right-container flex-1 p-40 flex flex-col justify-center items-start">
        <input className='outline-none' type="email" placeholder='Votre email...' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className='outline-none' type="password" placeholder='Votre mot de passe...' value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className='text-['>{error}</p>}
        <button className='px-10 py-2 mt-10 bg-[#6B11FF] ml-auto rounded-[10px] text-white' onClick={handlerSubmit} >Se connecter</button>
      </div>
    </section>
  )
}

export default Authentification