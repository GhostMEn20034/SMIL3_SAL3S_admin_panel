import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AppBarMenu from './components/AppBar';
import PrivateRoute from './utils/PrivateRoute';
import Login from './pages/LoginPage';
import AddProductPageChooseCategory from './pages/product/AddProductPageChooseCategory';
import FacetRoutes from './routes/Facets';
import VariationThemeRoutes from './routes/VariationThemes';
import CategoryRoutes from './routes/Categories';
import ProductRoutes from './routes/Products';
import SynonymRoutes from './routes/Synonyms';
import EventRoutes from './routes/Events';
import DealRoutes from './routes/Deals';

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
            <Route path='/facets/*' element={<FacetRoutes />}/>
            <Route path='/categories/*' element={<CategoryRoutes/>}/>
            <Route path='/variation-themes/*' element={<VariationThemeRoutes />} />
            <Route path='/products/*' element={<ProductRoutes />}/>
            <Route exact path='/product-classify' element={
                <PrivateRoute>
                    <AddProductPageChooseCategory />
                </PrivateRoute>
            } />
            <Route path='/synonyms/*' element={<SynonymRoutes/>}/>
            <Route path='/events/*' element={<EventRoutes/>}/>
            <Route path='/deals/*' element={<DealRoutes/>}/>
          </Routes>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
