import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import LoadingSpinner from "../common/LoadingSpinner";


const ProtectedRoute = () => {
  const {
    isAuthenticated,
    authChecked,
  } = useSelector(
    (state) => state.auth
  );


  if (!authChecked) {
    return <LoadingSpinner />;
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return <Outlet />;
};

export default ProtectedRoute;