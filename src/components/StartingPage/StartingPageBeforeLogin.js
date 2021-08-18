import classes from "./StartingPage.module.css";
import { Link } from "react-router-dom";

const StartingPageBeforeLogin = () => {
  return (
    <div className={classes.sectionContainer}>
      <h1>Please Login or SignUp to continue :)</h1>
      <Link to={"/login"}>
        <button>Login / SignUp</button>
      </Link>
    </div>
  );
};

export default StartingPageBeforeLogin;
