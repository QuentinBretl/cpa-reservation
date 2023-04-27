import { useEffect, useState, useRef } from 'react';
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
import {useSearchParams} from 'react-router-dom';  

export const useActisInfos = () => {
    const [data,setData] = useState(null)
    const [loadingActi,setLoadingActi] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const fetchActisInfos = async () => {
        try {
          const q = query(collection(db, "actis"), where('acti', '==', searchParams.get('acti')));

          const querySnapshot = await getDocs(q);

          const actiArray = []
          
          querySnapshot.forEach((doc) => {
            return actiArray.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          setData(actiArray)
          setLoadingActi(false);
        } catch (error) {
          console.error('Impossible de charger les données...');
        }
      };
      fetchActisInfos()

  }, []);

  return { data, loadingActi };
};