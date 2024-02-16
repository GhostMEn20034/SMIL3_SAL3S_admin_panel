import React from "react";
import { Route, Routes } from "react-router-dom";

import AddSynonymsPage from "../pages/synonyms/AddSynonymsPage";
import SynonymsListPage from "../pages/synonyms/SynonymListPage";
import UpdateSynonymsPage from "../pages/synonyms/UpdateSynonymsPage";
import PrivateRoute from "../utils/PrivateRoute";

export default function SynonymRoutes () {
    return (
        <Routes>
            <Route path='' element={
              <PrivateRoute>
                <SynonymsListPage />
              </PrivateRoute>
            } />
            <Route path='/add' element={
              <PrivateRoute>
                <AddSynonymsPage />
              </PrivateRoute>
            } />
            <Route path='/:id' element={
              <PrivateRoute>
                <UpdateSynonymsPage />
              </PrivateRoute>
            } />
        </Routes>
    )
}