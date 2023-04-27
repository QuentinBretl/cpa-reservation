import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCog, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { URLSearchParams } from 'react-router-dom';
import TableResa from '../components/TableResa';

function Planning({ currentDay }) {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const [searchParams, setSearchParams] = useSearchParams();
  let nomActi = searchParams.get('acti');
  nomActi = nomActi.charAt(0).toUpperCase() + nomActi.slice(1);

  const onClickSettings = (e) => {
    if (!loggedIn) {
      e.preventDefault();
      toast.error('Connectez-vous pour accéder aux paramètres.');
    }
  };

  return (
    <section className='content'>
      <div className='planning'>
        <div className='heading'>
          <h3>
            <Link className='back' to='/'>
              <FaArrowLeft />
            </Link>
          </h3>
          <h3>{currentDay}</h3>
          <h3>
            <Link
              className='settings'
              to='/parametres'
              onClick={onClickSettings}
            >
              <FaCog />
            </Link>
          </h3>
        </div>
        <h3 className='acti-name'>{nomActi}</h3>
        <div className='planning-reservations'>
          <div className='planning-am'>
            <TableResa creneau='am' />
          </div>
          <div className='planning-pm'>
            <TableResa creneau='pm' />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Planning;
