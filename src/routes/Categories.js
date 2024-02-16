import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import CategoryPage from "../pages/category/CategoryPage";
import CategoryDetailPage from "../pages/category/CategoryDetailPage";
import AddCategoryPage from "../pages/category/AddCategoryPage";

export default function CategoryRoutes() {
  return (
    <Routes>
      <Route path='' element={
        <PrivateRoute>
          <CategoryPage />
        </PrivateRoute>
      } />
      <Route path='/:id' element={
        <PrivateRoute>
          <CategoryDetailPage />
        </PrivateRoute>
      } />
      <Route path='/add' element={
        <PrivateRoute>
          <AddCategoryPage />
        </PrivateRoute>
      } />
    </Routes>
  );
}