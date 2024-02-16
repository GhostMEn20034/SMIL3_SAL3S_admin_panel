import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import ProductPage from "../pages/product/ProductPage";
import CreateProductPage from "../pages/product/CreateProductPage";
import UpdateProductPage from "../pages/product/UpdateProductPage";

export default function ProductRoutes() {
    return (
        <Routes>
            <Route path='' element={
                <PrivateRoute>
                    <ProductPage />
                </PrivateRoute>
            } />
            <Route path='/add' element={
                <PrivateRoute>
                    <CreateProductPage />
                </PrivateRoute>
            } />
            <Route path='/:id/edit' element={
                <PrivateRoute>
                    <UpdateProductPage />
                </PrivateRoute>
            } />
        </Routes>
    );
}
