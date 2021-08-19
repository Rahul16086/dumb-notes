import classes from "./StartingPage.module.css";
import { Link } from "react-router-dom";

const StartingPageAfterLogin = () => {
  let name = localStorage.getItem("username");
  if (!name) {
    name = "there";
  }
  return (
    <div className={classes.sectionContainer}>
      <h1>Hello {name}!</h1>
      <Link to={"/addnewnote"}>
        <button>Add new note</button>
      </Link>
    </div>
  );
};

export default StartingPageAfterLogin;
