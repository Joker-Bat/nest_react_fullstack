import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import classes from "./Index.module.scss";
import API from "../services/api";
import { UserContext, UserContextType } from "../HOC/ContextProvider";
import { toast } from "react-toastify";

const Index = () => {
  const navigate = useNavigate();
  const { clearUser, user } = useContext(UserContext) as UserContextType;

  const handleLogout = async () => {
    try {
      await API.get("/auth/signout");
    } catch (err) {
      console.log("🚀 ~ err", err);
      toast("Something went wrong");
    }
    clearUser();
    return navigate("/auth");
  };

  return (
    <div className={classes.Container}>
      <header>
        <NavLink to="/" className={classes.Logo}>
          <span>C</span>
          ar
          <span>V</span>
          alue
          {user && user.role && (
            <span className={classes.Role}>({user.role})</span>
          )}
        </NavLink>

        <nav className={classes.NavLinks}>
          {user ? (
            <>
              <NavLink
                to="/list"
                className={({ isActive }) =>
                  `${classes.NavLink} ${isActive ? classes.Active : ""}`
                }
              >
                View all
              </NavLink>
              <button className={classes.NavLink} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                `${classes.NavLink} ${isActive ? classes.Active : ""}`
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
