import React from 'react';
import { FaCog } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Actis from '../components/Actis';
import { toast } from 'react-toastify'
import { useAuthStatus } from '../hooks/useAuthStatus';

const Home = ({ currentDay, formattedDate }) => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  const onClick = (e) =>{
   
    if(!loggedIn){
      e.preventDefault()
      toast.error('Connectez-vous pour accéder aux paramètres.')
    }
  }

  return (
    <section className='content'>
      <div className='planning'>
        <div className='heading'>
          <h3> </h3>
          <h3>{currentDay}</h3>
          <h3>
            <Link className='settings' to='/parametres' onClick={onClick}>
              <FaCog />
            </Link>
          </h3>
        </div>
        <Actis formattedDate={formattedDate} currentDay={currentDay} />
      </div>
    </section>
  );
};

export default Home;
