import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import DealListPage from "../pages/deal/DealListPage";
import CreateDealPage from "../pages/deal/CreateDealPage";
import UpdateDealPage from "../pages/deal/UpdateDealPage";

export default function DealRoutes() {
    return (
        <Routes>
            <Route path='' element={
                <PrivateRoute>
                    <DealListPage />
                </PrivateRoute>
            } />
            <Route path='/add' element={
                <PrivateRoute>
                    <CreateDealPage />
                </PrivateRoute>
            } />
            <Route path='/:id' element={
                <PrivateRoute>
                    <UpdateDealPage />
                </PrivateRoute>
            } />
        </Routes>
    );
}