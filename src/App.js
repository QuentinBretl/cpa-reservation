import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './Calendar.css';
import moment from 'moment/moment';
import 'moment/locale/fr';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import NoMatch from './components/NoMatch';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Planning from './pages/Planning';
import Params from './pages/Params';
import CreerReservation from './pages/CreerReservation';

function App() {
  const [value, setValue] = useState(new Date());
  let redirection = false;
  let currentDay =
    moment(value).locale('fr').format('dddd') +
    ' ' +
    moment(value).locale('fr').format('LL');

  let formattedDate = moment(value).format('DD-MM-YYYY');

  useEffect(() => {
    currentDay =
      moment(value).locale('fr').format('dddd') +
      ' ' +
      moment(value).locale('fr').format('LL');
    console.log(currentDay);
  }, [value]);

  function onChange(nextValue) {
    setValue(nextValue);
    redirection = true;
  }

  return (
    <>
      <BrowserRouter>
        <div className='container'>
          <main>
            <section className='navigation'>
              <Calendar value={value} onChange={onChange} />
              <Navigation />
            </section>
            {redirection && <Navigate replace to='/' />}
            <Routes>
              <Route
                path='/'
                element={
                  <Home currentDay={currentDay} formattedDate={formattedDate} />
                }
              ></Route>
              <Route
                path='/planning'
                element={<Planning currentDay={currentDay} />}
              ></Route>
               <Route
                path='/creer-reservation'
                element={<CreerReservation currentDay={currentDay} />}
              ></Route>
              <Route path='/parametres' element={<PrivateRoute />}>
                <Route path='/parametres' element={<Params />}></Route>
              </Route>
              <Route path='*' element={<NoMatch />}></Route>
            </Routes>
          </main>
        </div>
      </BrowserRouter>
      <ToastContainer position='bottom-right' theme='dark' />
    </>
  );
}

export default App;
