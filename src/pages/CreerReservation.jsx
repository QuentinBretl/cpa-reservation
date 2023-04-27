import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

function CreerReservation({ currentDay }) {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const { creneau } = location.state;

  const [formData, setFormData] = useState({
    acti: searchParams.get('acti'),
    date: searchParams.get('date'),
    creneau: creneau,
    nom: '',
    mail: '',
    tel: '',
    nb_adultes: 0,
    nb_enfants: 0,
    nb_bambins: 0,
    prix: 0,
    auteur: auth.currentUser.displayName,
  });

  const { nom, mail, tel, nb_adultes, nb_enfants, nb_bambins, prix } = formData;

  
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          console.log('pas connecté');
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'resas'), formDataCopy);
    setLoading(false);
    toast.success('Réservation créée avec succès');
    navigate(
      `/planning?acti=${searchParams.get('acti')}&date=${searchParams.get(
        'date'
      )}`
    );
  };

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  if (loading) {
    return <div>CHARGEMENT</div>;
  }
  return (
    <section className='content'>
      <div className='planning'>
        <div className='heading'>
          <h3> </h3>
          <h3>{currentDay}</h3>
          <h3></h3>
        </div>
        <div className='cr-container'>
          <form onSubmit={onSubmit}>
            <div className='form-title'>
              <label className='form-label'>Ajouter une réservation</label>
            </div>
            <label className='form-label'>
              Nom <span>*</span>
            </label>
            <input
              className='form-input-name'
              type='text'
              id='nom'
              onChange={onMutate}
              value={nom}
              maxLength='20'
              minLength='0'
              required
            />

            <div className='form-input'>
              <label className='form-label'>
                Numéro de télephone<span>*</span>
              </label>
              <input
                className='form-input-phone'
                type='text'
                id='tel'
                value={tel}
                onChange={onMutate}
                maxLength='15'
                minLength='0'
                required
              />
            </div>
            <div className='form-input'>
              <label className='form-label'>Email</label>
              <input
                className='form-input-email'
                type='text'
                id='mail'
                value={mail}
                onChange={onMutate}
                maxLength='30'
                minLength='0'
                required
              />
            </div>
            <div className='form-input'>
              <label className='form-label'>
                Adultes<span>*</span>
              </label>
              <input
                className='form-input-name'
                type='number'
                id='nb_adultes'
                value={nb_adultes}
                onChange={onMutate}
                min='0'
                max='12'
                required
              />
            </div>
            <div className='form-input'>
              <label className='form-label'>
                Enfants (7-15 ans)<span>*</span>
              </label>
              <input
                className='form-input-name'
                type='number'
                id='nb_enfants'
                value={nb_enfants}
                onChange={onMutate}
                min='0'
                max='12'
                required
              />
            </div>
            {searchParams.get('acti') === 'pah' && (
              <div className='form-input'>
                <label className='form-label'>
                  Bambins (3-6 ans)<span>*</span>
                </label>
                <input
                  className='form-input-name'
                  type='number'
                  id='nb_bambins'
                  value={nb_bambins}
                  onChange={onMutate}
                  min='0'
                  max='12'
                  required
                />
              </div>
            )}
            <button type='submit' className='submit-btn'>
              Créer
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default CreerReservation;
