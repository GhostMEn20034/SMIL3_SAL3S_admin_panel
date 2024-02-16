import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import VariationThemePage from "../pages/variationTheme/VariationThemePage";
import VariationThemeDetailPage from "../pages/variationTheme/VariationThemeDetailPage";
import AddVariationThemePage from "../pages/variationTheme/AddVariationThemePage";


export default function VariationThemeRoutes() {
    return (
        <Routes>
            <Route path='' element={
                <PrivateRoute>
                    <VariationThemePage />
                </PrivateRoute>
            } />
            <Route path='/:id' element={
                <PrivateRoute>
                    <VariationThemeDetailPage />
                </PrivateRoute>
            } />
            <Route path='/add' element={
                <PrivateRoute>
                    <AddVariationThemePage />
                </PrivateRoute>
            } />
        </ Routes>
    );
}