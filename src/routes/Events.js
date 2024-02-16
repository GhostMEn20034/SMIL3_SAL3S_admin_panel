import React from "react";
import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import EventListPage from "../pages/event/EventListPage";
import AddEventPage from "../pages/event/AddEventPage";
import UpdateEventPage from "../pages/event/UpdateEventPage";

export default function EventRoute () {
    return (
        <Routes>
            <Route path='' element={
              <PrivateRoute>
                <EventListPage />
              </PrivateRoute>
            } />
            <Route path='/add' element={
              <PrivateRoute>
                <AddEventPage />
              </PrivateRoute>
            } />
            <Route path='/:id' element={
              <PrivateRoute>
                <UpdateEventPage />
              </PrivateRoute>
            } />
        </Routes>
    );
}