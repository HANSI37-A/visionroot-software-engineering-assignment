import {
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";


import {
  getCurrentUser,
} from "./features/auth/authSlice";


import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import AppLayout from "./components/layout/AppLayout";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


import Dashboard from "./pages/user/Dashboard";
import Requests from "./pages/user/Requests";
import CreateRequest from "./pages/user/CreateRequest";
import RequestDetails from "./pages/user/RequestDetails";
import EditRequest from "./pages/user/EditRequest";


import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminRequestDetails from "./pages/admin/AdminRequestDetails";
import Users from "./pages/admin/Users";


const App = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(
      getCurrentUser()
    );
  }, [dispatch]);


  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* Authenticated */}
      <Route
        element={<ProtectedRoute />}
      >
        <Route
          element={<AppLayout />}
        >
          {/* USER */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/requests"
            element={<Requests />}
          />

          <Route
            path="/requests/new"
            element={<CreateRequest />}
          />

          <Route
            path="/requests/:id"
            element={<RequestDetails />}
          />

          <Route
            path="/requests/:id/edit"
            element={<EditRequest />}
          />


          {/* ADMIN */}
          <Route
            element={<AdminRoute />}
          >
            <Route
              path="/admin"
              element={
                <AdminDashboard />
              }
            />

            <Route
              path="/admin/requests"
              element={
                <AdminRequests />
              }
            />

            <Route
              path="/admin/requests/:id"
              element={
                <AdminRequestDetails />
              }
            />

            <Route
              path="/admin/users"
              element={<Users />}
            />
          </Route>
        </Route>
      </Route>


      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
};

export default App;