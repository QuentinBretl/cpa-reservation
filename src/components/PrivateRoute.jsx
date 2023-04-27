import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
//hook permettant de savoir si connecté ou pas...
import { useAuthStatus } from '../hooks/useAuthStatus';

const PrivateRoute = () => {
  //importation des variables
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <h3>Chargement...</h3>;
  };

  return loggedIn ? <Outlet /> : <Navigate to='/'/>;
};

export default PrivateRoute;
