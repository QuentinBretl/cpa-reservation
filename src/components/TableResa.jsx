import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaUserPlus } from 'react-icons/fa';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { useActisInfos } from '../hooks/useActisInfos';
import moment from 'moment/moment';
import 'moment/locale/fr';
import Paiement from './Paiement';


function TableResa({ creneau }) {
  const [currentActi, setCurrentActi] = useState(null);
  const [annuls, setAnnuls] = useState(null);
  const [resas, setResas] = useState(null);
  const { loggedIn, checkingStatus } = useAuthStatus();
  const {data} = useActisInfos()
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [pah, setPah] = useState(false);
  const [formDataCancel, setFormDataCancel] = useState({
    acti: searchParams.get('acti'),
    date: searchParams.get('date'),
    creneau: creneau,
  });
  const [nbAdultes, setNbAdultes] = useState(0)
  const [day, setDay] = useState(null)

  const navigate = useNavigate();

  const onClick = (e) => {
    if (!loggedIn) {
      e.preventDefault();
      toast.error('Connectez-vous pour pouvoir créer une réservation');
    }
  };

  const onClickRemoveSlot = async (e) => {
    if (!loggedIn) {
      e.preventDefault();
      toast.error('Connectez-vous pour annuler un créneau');
    } else {
      e.preventDefault();
      let confirmation = window.confirm(
        'Etes vous sur de vouloir annuler le creneau ?'
      );
      if (confirmation) {
        const docRef = await addDoc(
          collection(db, 'annulations'),
          formDataCancel
        );
        window.location.reload(false);
      } else {
      }
    }
  };

  const onClickMaintainSlot = async (e) => {
    if (!loggedIn) {
      e.preventDefault();
      toast.error('Connectez-vous pour pouvoir maintenir le créneau');
    } else {
      e.preventDefault();
      let confirmation = window.confirm(
        'Etes vous sur de vouloir maintenir le créneau ?'
      );
      if (confirmation) {
        await deleteDoc(doc(db, 'annulations', annuls[0].id));
        window.location.reload(false);
      } else {
      }
    }
  };

  const getDayDate = () => {
    const dateString = searchParams.get('date');
    const dateObj = moment(dateString, 'DD-MM-YYYY');
    const dayName = dateObj.format('dddd');
    setDay(dayName)
  }


  //Fetch DB
  useEffect(() => {
    if (searchParams.get('acti') === 'pah') {
      setPah(true);
      console.log(pah);
    }

    getDayDate()
    const parseObject = async () => {
      
      if (day){
        data.map((acti)=>{
          console.log(acti.data.jours)
        })
      } else {
        console.log("no day")
      }
    }
    parseObject()

    // Req à la bdd les annulations
    const fetchAnnulations = async () => {
      try {
        const annulRef = collection(db, 'annulations');
        const q = query(
          annulRef,
          where('acti', '==', searchParams.get('acti')),
          where('date', '==', searchParams.get('date')),
          where('creneau', '==', creneau)
        );
        const querySnap = await getDocs(q);

        const annuls = [];

        querySnap.forEach((doc) => {
          return annuls.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setAnnuls(annuls);
        setLoading(false);
        console.log(annuls);
      } catch (error) {
        toast.error('Impossible de charger les données...');
      }
    };

    //Req à la bdd les résas
    const fetchResas = async () => {
      try {
        const resasRef = collection(db, 'resas');
        const q = query(
          resasRef,
          where('acti', '==', searchParams.get('acti')),
          where('date', '==', searchParams.get('date')),
          where('creneau', '==', creneau)
        );
        const querySnap = await getDocs(q);

        const resas = [];

        querySnap.forEach((doc) => {
          return resas.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setResas(resas);
        setLoading(false);
      } catch (error) {
        toast.error('Impossible de charger les données...');
      }
    };
    fetchResas();
    fetchAnnulations();
    console.log(resas);
  
  }, []);

  return (
    <div className='table-container'>
      {data && data.length > 0 && (
        <h1>{data.map((acti)=>(
          acti.data.acti
        ))}</h1>
        )}
      
      <div className='options'>
        <Link
          onClick={onClick}
          className='add-button'
          to={`/creer-reservation?acti=${searchParams.get(
            'acti'
          )}&date=${searchParams.get('date')}`}
          state={{ creneau: creneau }}
        >
          <button className='add'>
            <FaPlus className='add-icon' />
            <h3>Ajouter</h3>
          </button>
        </Link>
        {annuls && annuls.length > 0 ? (
          <button className='maintain-slot' onClick={onClickMaintainSlot}>
            <FaTimes className='remove-slot-icon' />
            <h3>Maintenir</h3>
          </button>
        ) : (
          <button className='remove-slot' onClick={onClickRemoveSlot}>
            <FaTimes className='remove-slot-icon' />
            <h3>Annuler</h3>
          </button>
        )}
      </div>
      {loading ? (
        <h1> </h1>
      ) : annuls && annuls.length > 0 ? (
        <div>CRENEAU ANNULE</div>
      ) : resas && resas.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Mail</th>
              <th>Téléphone</th>
              <th>16+ ans</th>
              <th>7 - 15 ans</th>
              <th>3-6 ans</th>
              <th>Prix</th>
              <th>Actions</th>
              <th>Créée par</th>
              <th>A</th>
              <th className='paiement'>Reglé par ?</th>
            </tr>
          </thead>
          <tbody>
            {resas.map((resa) => (
              <tr key={resa.id}>
                <td>{resa.data.nom}</td>
                <td>{resa.data.mail}</td>
                <td>{resa.data.tel}</td>
                <td>{resa.data.nb_adultes}</td>
                <td>{resa.data.nb_enfants}</td>
                <td>{resa.data.nb_bambins}</td>
                <td>{resa.data.prix + " €"}</td>
                <td></td>
                <td>{resa.data.auteur}</td>
                <td></td>
                <td><Paiement /></td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1>Pas de réservations</h1>
      )}
    </div>
  );
}

export default TableResa;
