import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import FacetPage from "../pages/facet/FacetPage";
import FacetDetailPage from "../pages/facet/FacetDetailPage";
import AddFacetPage from "../pages/facet/AddFacetPage";

export default function FacetRoutes() {
    return (
        <Routes>
            <Route path='' element={
                <PrivateRoute>
                    <FacetPage />
                </PrivateRoute>
            } />
            <Route path='/:id' element={
                <PrivateRoute>
                    <FacetDetailPage />
                </PrivateRoute>
            } />
            <Route path='/add' element={
                <PrivateRoute>
                    <AddFacetPage />
                </PrivateRoute>
            } />
        </Routes>    
    );
}