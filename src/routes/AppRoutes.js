import { Routes, Route } from "react-router-dom";
import TableUsers from "../components/TableUsers";
import Home from "../components/Home";
import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}></Route>

        <Route path="/login" element={<Login />}></Route>

        <Route
          path="/users"
          element={
            <PrivateRoute>
              <TableUsers></TableUsers>
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
