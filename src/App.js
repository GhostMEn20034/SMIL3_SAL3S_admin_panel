import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './utils/PrivateRoute';
import AppBarMenu from './components/AppBar';
import { ResetPasswordEnterEmail } from './components/ResetPasswordComponents';
import Login from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FacetPage from './pages/FacetPage';
import FacetDetailPage from './pages/FacetDetailPage';


function App() {

  const location = useLocation();

  const authRoutes = ['/signin', '/reset-password', '/reset-password/confirm'];

  return (
    <>
      <AuthProvider>
        <UserProvider>
          {!authRoutes.includes(location.pathname) && <AppBarMenu />}
          <Routes>
            <Route path='/signin' element={<Login />} />
            <Route path='/reset-password' element={
              <ResetPasswordEnterEmail />
            } />
            <Route path='/reset-password/confirm' element={
              <ResetPasswordPage />
            } />
            <Route path='/facets' element={
              <PrivateRoute>
                <FacetPage />
              </PrivateRoute>
            } />
            <Route path='/facets/:id' element={
              <PrivateRoute>
                <FacetDetailPage />
              </PrivateRoute>
            }/>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
