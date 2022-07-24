import React, { useEffect} from 'react'
import { logout } from '../utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/authentification");
  }, [user, loading]);

  return (
    <nav id='navbar' className='p-5 flex fixed w-full'>
      <button onClick={logout} className='ml-auto'>
        <div className="image h-[50px] w-[50px] rounded-full" style={auth.currentUser ? {backgroundImage: 'url('+auth.currentUser.photoURL+')', backgroundSize: "cover", backgroundPosition: "center"} : {backgroundColor: "#F1F1F1"}}></div>
      </button>

      <button onClick={logout} className='px-5 ml-auto py-2 fixed rounded-[10px] bg-[#F65555] text-[10px] text-white'>Se déconnecter</button>
    </nav>
  )
}

export default Navbar