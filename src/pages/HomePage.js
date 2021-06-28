import StartingPageBeforeLogin from "../components/StartingPage/StartingPageBeforeLogin";
import { useContext } from "react";
import AuthContext from "../store/auth-context";
import StartingPageAfterLogin from "../components/StartingPage/StartingPageAfterLogin";

const HomePage = () => {
  const authContext = useContext(AuthContext);
  let page;
  if (authContext.isLoggedIn) {
    page = <StartingPageAfterLogin />;
  } else {
    page = <StartingPageBeforeLogin />;
  }
  return page;
};

export default HomePage;
