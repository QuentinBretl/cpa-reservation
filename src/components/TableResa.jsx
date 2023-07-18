import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes, FaUserPlus, FaEdit, FaMinusSquare } from 'react-icons/fa';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
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
  const { data } = useActisInfos();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [pah, setPah] = useState(false);
  const [formDataCancel, setFormDataCancel] = useState({
    acti: searchParams.get('acti'),
    date: searchParams.get('date'),
    creneau: creneau,
  });
  const [day, setDay] = useState(null);
  const [editData, setEditData] = useState(null);
  //Variable de calcul du nb total de personnes sur le créneau
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

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
        await fetchAnnulations(); // Mettre à jour les annulations
        navigate(
          `/planning?acti=${searchParams.get('acti')}&date=${searchParams.get('date')}`
        );
        console.log('Annulé!')
        toast.success('Créneau annulé avec succès')
      }
    }
  };

  const onClickMaintainSlot = async (e) => {
    if (!loggedIn) {
      e.preventDefault();
      toast.error('Connectez-vous pour pouvoiar maintenir le créneau');
    } else {
      e.preventDefault();
      let confirmation = window.confirm(
        'Etes vous sur de vouloir maintenir le créneau ?'
      );
      if (confirmation) {
        await deleteDoc(doc(db, 'annulations', annuls[0].id));
        await fetchAnnulations(); // Mettre à jour les annulations
        navigate(
          `/planning?acti=${searchParams.get('acti')}&date=${searchParams.get('date')}`
        );
        toast.success('Créneau maintenu avec succès!')
      } else {
      }
    }
  };

  const getDayDate = () => {
    const dateString = searchParams.get('date');
    const dateObj = moment(dateString, 'DD-MM-YYYY');
    const dayName = dateObj.format('dddd');
    setDay(dayName);
  };

  const handleEdit = async (resa) => {
    setEditData(resa);
  };
  
  const handleDelete = async (resa) => {
    try {
      const docRef = doc(db, 'resas', resa.id);
      if (!loggedIn) {
        toast.error('Connectez-vous pour pouvoir supprimer la réservation');
      } else {
        let confirmation = window.confirm(
          'Etes vous sur de vouloir supprimer la réservation ? Cette action est définitive'
        );
        if (confirmation) {
          await deleteDoc(docRef);
          window.location.reload(false)
        } 
      }
    } catch (error) {
      console.error()
      console.log(error)
    }
  };



  //Fetch DB
  useEffect(() => {
    if (searchParams.get('acti') === 'pah') {
      setPah(true);
      console.log(pah);
    }

    getDayDate();
    const parseObject = async () => {
      if (day) {
        data.map((acti) => {
          console.log(acti.data.jours);
        });
      } else {
        console.log('no day');
      }
    };
    parseObject();

    // Req à la bdd les annulations
    
    fetchResas();
    fetchAnnulations();
    console.log(resas);
  }, []);

  useEffect(() => {
    let calculatedTotal = 0;
    if (resas && resas.length > 0) {
      resas.forEach((resa) => {
        calculatedTotal += parseInt(resa.data.nb_adultes) + parseInt(resa.data.nb_enfants) + parseInt(resa.data.nb_bambins);
      });
    }
    setTotal(calculatedTotal);
  }, [resas]);

  const convertTimestamp = (timestamp) => {
    let firebaseDate = timestamp.toDate();
    let dd = firebaseDate.getDate(); // Declare dd here
    let mm = firebaseDate.getMonth()+1; // Declare mm here
    
    if (dd < 10) {
      dd = '0' + dd;
    }
    
    if (mm < 10) {
      mm = '0' + mm;
    }

    let yyyy = firebaseDate.getFullYear();
    firebaseDate = dd + '/' + mm + '/' + yyyy;
    return firebaseDate;
  }

  const saveChanges = async () => {
    try {
      const docRef = doc(db, 'resas', editData.id);
      await updateDoc(docRef, editData.data);
      // La réservation a été mise à jour avec succès
      setEditData(null); // Réinitialisez l'état editData pour revenir à l'affichage normal
      window.location.reload(false)
    } catch (error) {
      // Gérez les erreurs lors de la mise à jour de la réservation
      throw error
    }

};

  return (
    <div className='table-container'>
      {data && data.length > 0 && <h1>{data.map((acti) => acti.data.acti)}</h1>}

     
        {annuls && annuls.length > 0 ? (
           <div className='options'>
          <button className='maintain-slot' onClick={onClickMaintainSlot}>
            <FaTimes className='remove-slot-icon' />
            <h3>Maintenir</h3>
          </button>
          </div>
        ) : (
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
        <h3>Total : {total}/12</h3>
          <button className='remove-slot' onClick={onClickRemoveSlot}>
            <FaTimes className='remove-slot-icon' />
            <h3>Annuler</h3>
          </button>
        </div>)}
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
              <th>Le</th>
              <th className='paiement'>Reglé par ?</th>
            </tr>
          </thead>
          <tbody>
          {resas.map((resa) => (
            
  <tr key={resa.id}>
    {editData && editData.id === resa.id ? (
      <>
        <td className='edit-td'>
          <input
            className='input-td'
            type="text"
            value={editData.data.nom}
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, nom: e.target.value } })}
          />
        </td>
        <td className='edit-td'>
          <input
            className='input-td'
            type="email"
            value={editData.data.mail}
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, mail: e.target.value } })}
          />
        </td>
        <td className='edit-td'>
          <input
            className='input-td'
            type="text"
            value={editData.data.tel}
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, tel: e.target.value } })}
          />
        </td>
        <td className='edit-td'>
          <input
            className='input-td'
            type='number'
            value={editData.data.nb_adultes}
            min='0'
            max='12'
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, nb_adultes: e.target.value } })}
          />
        </td>
        <td className='edit-td'>
          <input
            className='input-td'
            type='number'
            value={editData.data.nb_enfants}
            min='0'
            max='12'
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, nb_enfants: e.target.value } })}
          />
        </td>
        <td className='edit-td'>
          <input
            className='input-td'
            type='number'
            value={editData.data.nb_bambins}
            min='0'
            max='12'
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, nb_bambins: e.target.value } })}
          />
        </td>
        <td className='edit-td'>
          <input
            className='input-td'
            type="number"
            value={editData.data.prix}
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, prix: e.target.value } })}
          />
        </td>
        <td>
        <button onClick={() => saveChanges()}>Enregistrer</button>
        </td>
        <td>
        {resa.data.auteur}
        </td>
        <td>
        {convertTimestamp(resa.data.timestamp)}
        </td>
        
        <td className='edit-td'>
        <input
            className='input-td'
            type="text"
            value={editData.data.reglement}
            onChange={(e) => setEditData({ ...editData, data: { ...editData.data, reglement: e.target.value } })}
          />
        </td>
      </>
    ) : (
      <>
        <td>{resa.data.nom}</td>
        <td>{resa.data.mail}</td>
        <td>{resa.data.tel}</td>
        <td>{resa.data.nb_adultes}</td>
        <td>{resa.data.nb_enfants}</td>
        <td>{resa.data.nb_bambins}</td>
        <td>{resa.data.prix + ' €'}</td>
        <td>
          <div className='options-td'>
            <FaEdit className='edit-icon' onClick={() => handleEdit(resa)} />
            <FaMinusSquare className='delete-icon' onClick={() => handleDelete(resa)} />
          </div>
        </td>
        <td>{resa.data.auteur}</td>
        <td>{convertTimestamp(resa.data.timestamp)}</td>
        <td>
          {resa.data.reglement === 0 ? (
            <span>Non reglé</span>
          ) : (
            <span>{resa.data.reglement}</span>
          )}
        </td>
      </>
    )}
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
