import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './utils/PrivateRoute';
import AppBarMenu from './components/AppBar';
import Login from './pages/LoginPage';
import FacetPage from './pages/facet/FacetPage';
import FacetDetailPage from './pages/facet/FacetDetailPage';
import AddFacetPage from './pages/facet/AddFacetPage';
import VariationThemePage from './pages/variationTheme/VariationThemePage';
import VariationThemeDetailPage from './pages/variationTheme/VariationThemeDetailPage';
import AddVariationThemePage from './pages/variationTheme/AddVariationThemePage';
import CategoryPage from './pages/category/CategoryPage';
import CategoryDetailPage from './pages/category/CategoryDetailPage';
import AddCategoryPage from './pages/category/AddCategoryPage';
import ProductPage from './pages/product/ProductPage';
import AddProductPageChooseCategory from './pages/product/AddProductPageChooseCategory';
import CreateProductPage from './pages/product/CreateProductPage';
import UpdateProductPage from './pages/product/UpdateProductPage';
import SynonymsListPage from './pages/synonyms/SynonymListPage';
import AddSynonymsPage from './pages/synonyms/AddSynonymsPage';
import UpdateSynonymsPage from './pages/synonyms/UpdateSynonymsPage';



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
            <Route path='/variation-themes/add' element={
              <PrivateRoute>
                <AddVariationThemePage />
              </PrivateRoute>
            }/>
            <Route path='/categories' element={
              <PrivateRoute>
                <CategoryPage />
              </PrivateRoute>
            } />
            <Route path='/categories/:id' element={
              <PrivateRoute>
                <CategoryDetailPage />
              </PrivateRoute>
            } />
            <Route path='/categories/add' element={
              <PrivateRoute>
                <AddCategoryPage />
              </PrivateRoute>
            } />
            <Route path='/products' element={
              <PrivateRoute>
                <ProductPage />
              </PrivateRoute>
            } />
            <Route path='/product-classify' element={
              <PrivateRoute>
                <AddProductPageChooseCategory />
              </PrivateRoute>
            } />
            <Route path='/products/add' element={
              <PrivateRoute>
                <CreateProductPage />
              </PrivateRoute>
            } />
            <Route path='/products/:id/edit' element={
              <PrivateRoute>
                <UpdateProductPage />
              </PrivateRoute>
            } />
            <Route path='/synonyms' element={
              <PrivateRoute>
                <SynonymsListPage />
              </PrivateRoute>
            } />
            <Route path='/synonyms/add' element={
              <PrivateRoute>
                <AddSynonymsPage />
              </PrivateRoute>
            } />
            <Route path='/synonyms/:id' element={
              <PrivateRoute>
                <UpdateSynonymsPage />
              </PrivateRoute>
            } />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </>
  );
}

export default App;
