import Layout from "./components/Layout/Layout";
import { Redirect, Route, Switch } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AllNotes from "./pages/AllNotes";
import Favorites from "./pages/Favorites";
import ProfilePage from "./pages/ProfilePage";
import { useContext } from "react";
import AuthContext from "./store/auth-context";
import AddNewNote from "./pages/AddNewNote";
import PasswordReset from "./pages/PasswordReset";
import SignUpUsingPhone from "./components/Auth/SignUpUsingPhone";
import UserLocation from "./components/Maps/UserLocation";
import NoteMap from "./pages/NoteMap";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <Layout>
      <Switch>
        <Route path={"/"} exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path={"/login"} exact>
            <AuthPage />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path={"/all"}>
            <AllNotes />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path={"/favorites"}>
            <Favorites />
          </Route>
        )}
        <Route path={"/profile"}>
          {authCtx.isLoggedIn && <ProfilePage />}
          {!authCtx.isLoggedIn && <Redirect to={"login"} />}
        </Route>
        {authCtx.isLoggedIn && (
          <Route path={"/addnewnote"}>
            <AddNewNote />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path={"/userlocation"}>
            <UserLocation />
          </Route>
        )}
        {authCtx.isLoggedIn && (
          <Route path={"/notemap"}>
            <NoteMap />
          </Route>
        )}
        <Route path={"/forgotpassword"}>
          <PasswordReset />
        </Route>
        <Route path={"/login/phone"}>
          <SignUpUsingPhone />
        </Route>
        <Route path={"*"}>
          <Redirect to={"/"} />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
