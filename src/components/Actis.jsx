import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Escalade from '../assets/escalade.svg';
import Paddle from '../assets/paddle.svg';
import Tal from '../assets/tal.svg';
import Cirque from '../assets/cirque.svg';
import Kayak from '../assets/kayak.svg';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import moment from 'moment/moment';

function Actis({ formattedDate, currentDay }) {
  const [resas, setResas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actis, setActis] = useState(null);
  const [actisUnavailable, setActisUnavailable] = useState([]);
  const [annulations, setAnnulations] = useState([])
  // Résa d'activités présentes ou non
  const [hasEscaladeActivity, setHasEscaladeActivity] = useState(false);
  const [hasKayakActivity, setHasKayakActivity] = useState(false);
  const [hasTalActivity, setHasTalActivity] = useState(false);
  const [hasPahActivity, setHasPahActivity] = useState(false);
  const [hasCirqueActivity, setHasCirqueActivity] = useState(false);
  const [hasPaddleActivity, setHasPaddleActivity] = useState(false);
  const [totalPersonsByActivity, setTotalPersonsByActivity] = useState([]);
  // Activités présentes sur la planning ou non
  const [actiDispo, setActiDispo] = useState([]);

  //Nombres de personnes enregistrées sur créneau:
  const [capacity, setCapacity] = useState(12);

  //Créneaux annulés ou non
  const [hasEscaladeAnnul, setHasEscaladeAnnul] = useState([]);
  const [hasKayakAnnul, setHasKayakAnnul] = useState([]);
  const [hasTalAnnul, setHasTalAnnul] = useState([]);
  const [hasPahAnnul, setHasPahAnnul] = useState([]);
  const [hasCirqueAnnul, setHasCirqueAnnul] = useState([]);
  const [hasPaddleAnnul, setHasPaddleAnnul] = useState([]);

  useEffect(() => {
    const fetchActis = async () => {
      try {
        const resasRef = collection(db, 'resas');
        const q = query(resasRef, where('date', '==', formattedDate));
        const querySnap = await getDocs(q);

        const actisTemp = [];

        querySnap.forEach((doc) => {
          return actisTemp.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setActis(actisTemp);
        setLoading(false);
      } catch (error) {
        toast.error('Impossible de charger les données...');
        console.log(error);
      }
    };

    const fetchActisUnavailable = async () => {
      let actisUnavailableArray = [];
      try {
        const actisRef = collection(db, 'actis');
        const querySnapshot = await getDocs(actisRef);
        querySnapshot.forEach((doc) => {
          return actisUnavailableArray.push(doc.data());
        });

        console.log(actisUnavailableArray);
        setActisUnavailable(actisUnavailableArray);
      } catch (error) {
        toast.error('Impossible de charger les données...');
        console.log(error);
      }
    };

    const fetchAnnulations = async () => {
      let annulationsArray = [];
      try {
        const annulsRef = collection(db, 'annulations');
        const q = query(annulsRef, where('date', '==', formattedDate));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          return annulationsArray.push(doc.data());
        });
        console.log(annulationsArray)
        setAnnulations(annulationsArray);
      } catch (error) {
        toast.error('Impossible de charger les données...');
        console.log(error);
      }
    };
    fetchActis();
    fetchActisUnavailable();
    fetchAnnulations();
  }, [formattedDate]);

  useEffect(() => {
    if (actis) {
      function checkActivityPresence(actis, activity) {
        return actis.some((obj) => obj.data.acti === activity);
      }

      setHasEscaladeActivity(checkActivityPresence(actis, 'escalade'));
      setHasKayakActivity(checkActivityPresence(actis, 'kayak'));
      setHasTalActivity(checkActivityPresence(actis, 'tal'));
      setHasPahActivity(checkActivityPresence(actis, 'pah'));
      setHasCirqueActivity(checkActivityPresence(actis, 'cirque'));
      setHasPaddleActivity(checkActivityPresence(actis, 'paddle'));
    }
  }, [actis, totalPersonsByActivity]);

  useEffect(() => {
    if (actisUnavailable) {
      let actiDispoTemp = [];
      actisUnavailable.forEach((activite) => {
        const jours = Object.keys(activite.jours);
        jours.forEach((jour) => {
          if (jour === getCurrentDay(formattedDate)) {
            actiDispoTemp.push(activite.acti);
          }
          setActiDispo(actiDispoTemp);
          /*const creneau = activite.jours[jour].creneau;
          const horaires = activite.jours[jour].horaires;*/
        });
      });
    }
  }, [actisUnavailable]);

  useEffect(() => {
    if (annulations) {
      function checkAnnulations(annulations, activity) {
        const results = []
        annulations.forEach((obj) => {
          if (obj && obj.acti === activity) {
            results.push(activity);
          }
        });

        const count = annulations.filter((obj) => obj.acti === activity).length;
        if (count === 1) {
          results.push(1)
        } else if (count === 2) {
          results.push(2)
        }
        return results
      }

      setHasEscaladeAnnul(checkAnnulations(annulations, 'escalade'));
      setHasKayakAnnul(checkAnnulations(annulations, 'kayak'));
      setHasTalAnnul(checkAnnulations(annulations, 'tal'));
      setHasPahAnnul(checkAnnulations(annulations, 'pah'));
      setHasCirqueAnnul(checkAnnulations(annulations, 'cirque'));
      setHasPaddleAnnul(checkAnnulations(annulations, 'paddle'));

    }
  }, [annulations]);

  function getTotalPersonsByActivity(actis) {
    const updatedTotalPersonsByActivity = {};

    actis?.forEach((activite) => {
      const { acti, nb_adultes, nb_enfants, nb_bambins } = activite.data;

      const totalPersons =
        parseInt(nb_adultes) + parseInt(nb_enfants) + parseInt(nb_bambins);
      updatedTotalPersonsByActivity[acti] = totalPersons;
    });

    return updatedTotalPersonsByActivity;
  }
  useEffect(() => {
    if (actis) {
      setTotalPersonsByActivity(getTotalPersonsByActivity(actis));
    }
  }, [actis]);

  const getCurrentDay = (formattedDateVar) => {
    const date = moment(formattedDateVar, 'DD-MM-YYYY');
    const dayName = date.format('dddd');
    return dayName;
  };

  return (
    <div className='activities'>
      <h1 className='activities-title'>Activités</h1>
      {loading ? (
        <h1> </h1>
      ) : (
        <div className='list'>
          <article>
            <h3>KAYAK</h3>
            <Link
              className={`link-acti ${
                actiDispo.includes('kayak') ? '' : 'link-inexistant'
              }`}
              to={`/planning?acti=kayak&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasKayakActivity
                    ? 'present'
                    : hasKayakAnnul.length !== 0 
                    ? `annul`
                    : actiDispo.includes('kayak')
                    ? ''
                    : 'inexistant'
                }`}
                id='kayak'
              >
                <img id='img-kayak' src={Kayak} alt='kayak' />
              </div>
            </Link>
            {actiDispo.includes('kayak') ? (
              <p>
                Places restantes{' '}
                <span>
                  {totalPersonsByActivity['kayak']
                    ? capacity - totalPersonsByActivity['kayak']
                    : capacity}
                  /{capacity}
                </span>
              </p>
            ) :actiDispo.includes('kayak') && hasKayakAnnul.length !== 0 ? (
              <p>{hasKayakAnnul[1]} CRENEAU(X) ANNULES</p>
            ) : (
              <p>INDISPONIBLE</p>
            ) }
          </article>
          <article>
            <h3>ESCALADE</h3>
            <Link
              className={`link-acti ${
                actiDispo.includes('escalade') ? '' : 'link-inexistant'
              }`}
              to={`/planning?acti=escalade&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasEscaladeActivity
                    ? 'present'
                    : actiDispo.includes('escalade')
                    ? ''
                    : 'inexistant'
                }`}
                id='escalade'
              >
                <img id='img-escalade' src={Escalade} alt='escalade' />
              </div>
            </Link>
            {actiDispo.includes('escalade') ? (
              <p>
                Places restantes:
                <span>
                  {totalPersonsByActivity['escalade']
                    ? capacity - totalPersonsByActivity['escalade']
                    : capacity}
                  /{capacity}
                </span>
              </p>
            ) : (
              <p>INDISPONIBLE</p>
            )}
          </article>
          <article>
            <h3>TIR A L'ARC</h3>
            <Link
              className={`link-acti ${
                actiDispo.includes('tal') ? '' : 'link-inexistant'
              }`}
              to={`/planning?acti=tal&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasTalActivity
                    ? 'present'
                    : actiDispo.includes('tal')
                    ? ''
                    : 'inexistant'
                }`}
                id='tal'
              >
                <img id='img-tal' src={Tal} alt='Tir à l arc' />
              </div>
            </Link>
            {actiDispo.includes('tal') ? (
              <p>
                Places restantes{' '}
                <span>
                  {totalPersonsByActivity['tal']
                    ? capacity - totalPersonsByActivity['tal']
                    : capacity}
                  /{capacity}
                </span>
              </p>
            ) : (
              <p>INDISPONIBLE</p>
            )}
          </article>
          <article>
            <h3>ACCROBRANCHE</h3>
            <Link
              className={`link-acti ${
                actiDispo.includes('pah') ? '' : 'link-inexistant'
              }`}
              to={`/planning?acti=pah&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasPahActivity
                    ? 'present'
                    : actiDispo.includes('pah')
                    ? ''
                    : 'inexistant'
                }`}
                id='pah'
              >
                <img id='img-pah' src={Escalade} alt='accrobranche' />
              </div>
            </Link>
            {actiDispo.includes('pah') ? (
              <p>
                Places restantes{' '}
                <span>
                  {totalPersonsByActivity['pah']
                    ? capacity - totalPersonsByActivity['pah']
                    : capacity}
                  /{capacity}
                </span>
              </p>
            ) : (
              <p>INDISPONIBLE</p>
            )}
          </article>
          <article>
            <h3>CIRQUE</h3>
            <Link
              className={`link-acti ${
                actiDispo.includes('cirque') ? '' : 'link-inexistant'
              }`}
              to={`/planning?acti=cirque&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasCirqueActivity
                    ? 'present'
                    : actiDispo.includes('cirque')
                    ? ''
                    : 'inexistant'
                }`}
                id='cirque'
              >
                <img id='img-cirque' src={Cirque} alt='cirque' />
              </div>
            </Link>
            {actiDispo.includes('cirque') ? (
              <p>
                Places restantes{' '}
                <span>
                  {totalPersonsByActivity['cirque']
                    ? capacity - totalPersonsByActivity['cirque']
                    : capacity}
                  /{capacity}
                </span>
              </p>
            ) : (
              <p>INDISPONIBLE</p>
            )}
          </article>
          <article>
            <h3>PADDLE</h3>
            <Link
              className={`link-acti ${
                actiDispo.includes('paddle') ? '' : 'link-inexistant'
              }`}
              to={`/planning?acti=paddle&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasPaddleActivity
                    ? 'present'
                    : actiDispo.includes('paddle')
                    ? ''
                    : 'inexistant'
                }`}
                id='paddle'
              >
                <img id='img-paddle' src={Paddle} alt='paddle' />
              </div>
            </Link>
            {actiDispo.includes('paddle') ? (
              <p>
                Places restantes{' '}
                <span>
                  {totalPersonsByActivity['paddle']
                    ? capacity - totalPersonsByActivity['paddle']
                    : capacity}
                  /{capacity}
                </span>
              </p>
            ) : (
              <p>INDISPONIBLE</p>
            )}
          </article>
        </div>
      )}
    </div>
  );
}

export default Actis;
