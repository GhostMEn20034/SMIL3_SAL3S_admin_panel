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
import AddFacetPage from './pages/AddFacetPage';
import VariationThemePage from './pages/VariationThemePage';
import VariationThemeDetailPage from './pages/VariationThemeDetailPage';


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
            <Route path='/facets/add' element={
              <PrivateRoute>
                <AddFacetPage />
              </PrivateRoute>
            }/>
            <Route path='/variation-themes' element={
              <PrivateRoute>
                <VariationThemePage />
              </PrivateRoute>
            } />
            <Route path='/variation-themes/:id' element={
              <PrivateRoute>
                <VariationThemeDetailPage />
              </PrivateRoute>
            }/>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
