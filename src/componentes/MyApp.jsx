import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { Acceso } from "./Acceso/Acceso";
import { Menu } from "./Menu/Menu";

function MyApp() {
  const { state } = useContext(UserContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={state.isAuthenticated ? <Menu /> : <Acceso />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export { MyApp };
