import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";


const AdminRoute = () => {
  const {
    role,
  } = useSelector(
    (state) => state.auth
  );


  if (role !== "ADMIN") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  return <Outlet />;
};

export default AdminRoute;