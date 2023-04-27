import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import logoSVG from '../assets/logo.svg';

function Navigation() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  let auth = getAuth();
  useEffect(() => {
    const getName = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setName(doc.data().name);
        updateProfile(auth.currentUser, {
          displayName: doc.data().name,
        })
      });
    };
    auth = getAuth();
    if (auth.currentUser) {
      setLogin(true);
      console.log(auth.currentUser);
      getName();
    }

    if (login) {
      setUser(auth.currentUser);

      getName();
    }
  }, [login, auth.currentUser]);

  const { username, password } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        username + '@cpa-lathus.asso.fr',
        password
      );

      if (userCredential.user) {
        setLogin(true);
        navigate('/');
      }
    } catch (error) {
      toast.error('Identifiant et/ou mot de passe incorrecte(s) !');
    }
  };

  return user ? (
    <>
      <div className='login'>
        <p>Bienvenue {name}.</p>
        <button type='button' className='log-out' onClick={onLogout}>
          Déconnexion
        </button>
      </div>
      <img className='logo' src={logoSVG} alt='logo' />
    </>
  ) : (
    <>
      <div className='login'>
        <form className='login-form' onSubmit={onSubmit}>
          <label>
            <input
              className='input-log'
              type='text'
              name='login'
              id='username'
              placeholder='Identifiant'
              value={username}
              onChange={onChange}
            />
          </label>
          <br />
          <label>
            <input
              className='input-log'
              type='password'
              name='password'
              id='password'
              placeholder='Mot de passe'
              value={password}
              onChange={onChange}
            />
          </label>
          <br />
          <input className='input-send' type='submit' value='Connexion' />
        </form>
      </div>
      <img className='logo' src={logoSVG} alt='logo' />
    </>
  );
}

export default Navigation;
