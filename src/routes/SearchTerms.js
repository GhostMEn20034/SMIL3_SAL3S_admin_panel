import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../utils/PrivateRoute";
import SearchTermsPage from "../pages/searchTerm/SearchTermListPage";
import AddSearchTermPage from "../pages/searchTerm/AddSearchTermPage";
import UpdateSearchTermPage from "../pages/searchTerm/UpdateSearchTermPage";


export default function SearchTermsRoutes() {
    return (
        <Routes>
            <Route path='' element={
                <PrivateRoute>
                    <SearchTermsPage />
                </PrivateRoute>
            } />
            <Route path='/add' element={
                <PrivateRoute>
                    <AddSearchTermPage />
                </PrivateRoute>
            } />
            <Route path='/:id' element={
                <PrivateRoute>
                    <UpdateSearchTermPage />
                </PrivateRoute>
            } />
        </Routes>
    );
}