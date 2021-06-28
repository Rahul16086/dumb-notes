import classes from "./MainNavigation.module.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <>
      <header className={classes.header}>
        <div className={classes.logoLink}>
          <Link to={"/"}>
            {/*<div className={classes.logo}>Dumb Notes</div>*/}
            Dumb Notes
          </Link>
        </div>
        <div className={classes.rightSideContainer}>
          <ul>
            {isLoggedIn && (
              <Link to={"/profile"}>
                <li>My Profile</li>
              </Link>
            )}
            {isLoggedIn && (
              <Link to={"/notemap"}>
                <li>View Note Map</li>
              </Link>
            )}
            {isLoggedIn && (
              <Link to={"/all"}>
                <li>All Notes</li>
              </Link>
            )}

            {isLoggedIn && (
              <Link to={"/favorites"}>
                <li>Favorites</li>
              </Link>
            )}
            {isLoggedIn && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default MainNavigation;
