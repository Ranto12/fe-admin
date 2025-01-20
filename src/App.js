import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login/Login";

import GaunPage from "./Pages/GaunPage";
import AddDress from "./Components/ManageGaun/AddDress.jsx";
import EditGaun from "./Components/ManageGaun/EditGaun";

import ManageUser from "./Pages/ManageUser";
import ManageOrders from "./Pages/ManageOrders";
import RatesPage from "./Pages/RatesPage";
import OrdersHistory from "./Pages/OrdersHistory";
import CalendarAdmin from "./Pages/Calendar";
import {
  ProtectedRoute,
  NonProtectedRoute,
} from "./middleware/ProtectedRoute.js";
import NotFound from "./NotFound.js";
import ShipmentPage from "./Pages/ShipmentPage.jsx";
import Ulasan from "./Pages/Ulasan.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <NonProtectedRoute>
              <Login />
            </NonProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gaun-page"
          element={
            <ProtectedRoute>
              <GaunPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gaun-page/add-gaun"
          element={
            <ProtectedRoute>
              <AddDress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gaun-page/edit-gaun/:id"
          element={
            <ProtectedRoute>
              <EditGaun />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-user"
          element={
            <ProtectedRoute>
              <ManageUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-orders"
          element={
            <ProtectedRoute>
              <ManageOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rates-page"
          element={
            <ProtectedRoute>
              <RatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders-history"
          element={
            <ProtectedRoute>
              <OrdersHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipment/:id"
          element={
            <ProtectedRoute>
              <ShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ulasan"
          element={
            <ProtectedRoute>
              <Ulasan />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
