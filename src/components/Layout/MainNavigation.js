import classes from "./MainNavigation.module.css";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../../store/auth-context";
import Hamburger from "hamburger-react";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    setHamClicked(() => !hamClicked);
  };

  const [hamClicked, setHamClicked] = useState(false);

  const hamClickHandler = () => {
    setHamClicked(() => !hamClicked);
  };

  return (
    <>
      <header className={classes.header}>
        <div className={classes.leftSideContainer}>
          <div className={classes.logoLink}>
            <Link to={"/"}>
              {/*<div className={classes.logo}>Dumb Notes</div>*/}
              Dumb Notes
            </Link>
          </div>
          {isLoggedIn && (
            <div className={classes.hamContainer}>
              <Hamburger toggled={hamClicked} toggle={setHamClicked} />
            </div>
          )}
        </div>

        <div className={classes.rightSideContainer}>
          <ul className={classes.ulStyle}>
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
        {hamClicked && (
          <div className={classes.menuContainer}>
            <ul className={classes.ulStyleMobile}>
              {isLoggedIn && (
                <Link to={"/profile"}>
                  <li onClick={hamClickHandler}>My Profile</li>
                </Link>
              )}
              {isLoggedIn && (
                <Link to={"/notemap"}>
                  <li onClick={hamClickHandler}>View Note Map</li>
                </Link>
              )}
              {isLoggedIn && (
                <Link to={"/all"}>
                  <li onClick={hamClickHandler}>All Notes</li>
                </Link>
              )}

              {isLoggedIn && (
                <Link to={"/favorites"}>
                  <li onClick={hamClickHandler}>Favorites</li>
                </Link>
              )}
              {isLoggedIn && (
                <li>
                  <button onClick={logoutHandler}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>
    </>
  );
};

export default MainNavigation;
