import classes from "./StartingPage.module.css";
import { Link } from "react-router-dom";

const StartingPageAfterLogin = () => {
  let name = localStorage.getItem("username");
  if (!name) {
    name = "there";
  }
  return (
    <div className={classes.sectionContainer}>
      <section className={classes.starting}>
        <h1>Hello {name}!</h1>
        <Link to={"/addnewnote"}>
          <button>Add new note</button>
        </Link>
      </section>
    </div>
  );
};

export default StartingPageAfterLogin;
