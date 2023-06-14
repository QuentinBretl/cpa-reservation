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

function Actis({ formattedDate, currentDay }) {
  const [resas, setResas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actis, setActis] = useState(null);
  const [day, setDay] = useState(currentDay.replace(/ .*/, ''));
  // Activités présentes ou non
  const [hasEscaladeActivity, setHasEscaladeActivity] = useState(false);
  const [hasKayakActivity, setHasKayakActivity] = useState(false);
  const [hasTalActivity, setHasTalActivity] = useState(false);
  const [hasPahActivity, setHasPahActivity] = useState(false);
  const [hasCirqueActivity, setHasCirqueActivity] = useState(false);
  const [hasPaddleActivity, setHasPaddleActivity] = useState(false);
  const [totalPersonsByActivity, setTotalPersonsByActivity] = useState({});

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

    fetchActis();
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

      function getTotalPersonsByActivity(actis) {
        const updatedTotalPersonsByActivity = {};

        actis.forEach((activite) => {
          const { acti, nb_adultes, nb_enfants, nb_bambins } = activite.data;
          const totalPersons =
            parseInt(nb_adultes) + parseInt(nb_enfants) + parseInt(nb_bambins);
          if (acti in updatedTotalPersonsByActivity) {
            updatedTotalPersonsByActivity[acti] += totalPersons;
            console.log(updatedTotalPersonsByActivity);
          } else {
            updatedTotalPersonsByActivity[acti] = totalPersons;
          }
          return updatedTotalPersonsByActivity;
        });
      }
      setTotalPersonsByActivity(getTotalPersonsByActivity(actis));
      console.log(totalPersonsByActivity);
    }
  }, [actis, totalPersonsByActivity]);
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
              className='link-acti'
              to={`/planning?acti=kayak&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasKayakActivity ? 'present' : 'absent'
                }`}
                id='kayak'
              >
                <img id='img-pah' src={Kayak} alt='kayak' />
              </div>
            </Link>
            <p>
              Places restantes: <span>12/12</span>
            </p>
          </article>
          <article>
            <h3>ESCALADE</h3>
            <Link
              className='link-acti'
              to={`/planning?acti=escalade&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasEscaladeActivity ? 'present' : 'absent'
                }`}
                id='escalade'
              >
                <img id='img-escalade' src={Escalade} alt='escalade' />
              </div>
            </Link>
            <p>
              Places restantes: <span>/12</span>
            </p>
          </article>
          <article>
            <h3>TIR A L'ARC</h3>
            <Link
              className='link-acti'
              to={`/planning?acti=tal&date=${formattedDate}`}
            >
              <div
                className={`activity ${hasTalActivity ? 'present' : 'absent'}`}
                id='tal'
              >
                <img id='img-tal' src={Tal} alt='tal' />
              </div>
            </Link>
            <p>
              Places restantes: <span>12/12</span>
            </p>
          </article>
          <article>
            <h3>ACCROBRANCHE</h3>
            <Link
              className='link-acti'
              to={`/planning?acti=pah&date=${formattedDate}`}
            >
              <div
                className={`activity ${hasPahActivity ? 'present' : 'absent'}`}
                id='pah'
              >
                <img id='img-pah' src={Escalade} alt='pah' />
              </div>
            </Link>
            <p>
              Places restantes: <span>12/12</span>
            </p>
          </article>
          <article>
            <h3>CIRQUE</h3>
            <Link
              className='link-acti'
              to={`/planning?acti=cirque&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasCirqueActivity ? 'present' : 'absent'
                }`}
                id='cirque'
              >
                <img id='img-cirque' src={Cirque} alt='cirque' />
              </div>
            </Link>
            <p>
              Places restantes: <span>12/12</span>
            </p>
          </article>
          <article>
            <h3>PADDLE</h3>
            <Link
              className='link-acti'
              to={`/planning?acti=paddle&date=${formattedDate}`}
            >
              <div
                className={`activity ${
                  hasPaddleActivity ? 'present' : 'absent'
                }`}
                id='paddle'
              >
                <img id='img-tal' src={Paddle} alt='tal' />
              </div>
            </Link>
            <p>
              Places restantes: <span>12/12</span>
            </p>
          </article>
        </div>
      )}
    </div>
  );
}

export default Actis;
