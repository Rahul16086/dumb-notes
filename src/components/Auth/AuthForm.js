import classes from "./AuthForm.module.css";
import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import { Link, useHistory } from "react-router-dom";
import { googleProvider } from "../../config/googleProvider";
import GoogleAuth from "../../services/GoogleAuth";
import ErrorModal from "../Error/ErrorModal";
import GoogleButton from "react-google-button";
import firebase from "../../config/firebase";

const AuthForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const userNameInputRef = useRef();

  const loginStateChanger = () => {
    setIsLoggedIn((prevState) => !prevState);
  };

  const signInHandler = () => {
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);

    return firebase
      .auth()
      .signInWithEmailAndPassword(enteredEmail, enteredPassword)
      .then((userCredential) => {
        setIsLoading(false);
        // Signed in
        let user = userCredential.user;

        if (user.emailVerified) {
          authCtx.login(user.refreshToken);
          localStorage.setItem("localId", user.uid);
          history.replace("/");
        } else {
          setError("Please verify your email before logging in :)");
        }
        // ...
      })
      .catch((error) => {
        setIsLoading(false);
        const errorMessage = error.message;
        setError(errorMessage);
      })
      .then((data) => {});
  };

  const signUpHandler = () => {
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    return firebase
      .auth()
      .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
      .then((res) => {
        return res;
      })
      .then((data) => {
        setIsLoading(false);
        console.log(data);
        runVerification();
      })
      .catch(function (error) {
        setIsLoading(false);
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  const runVerification = () => {
    setIsLoading(true);

    return firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        setSuccess(true);
        setIsLoading(false);
        console.log("Verification sent");
        // Email verification sent!
        // ...
      });
  };

  const googleSignIn = async (provider) => {
    const res = await GoogleAuth(provider);
    if (res) {
      authCtx.login(res.credential.idToken);
      localStorage.setItem("localId", res.user.uid);
      history.replace("/");
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
      {error && <ErrorModal error={error} hideModal={errorHandler} />}
      <section className={classes.auth}>
        <h1>{!isLoggedIn ? "Login" : "Sign Up"}</h1>
        <form>
          {!isLoading && isLoggedIn && (
            <div className={classes.control}>
              <label>Username</label>
              <input type={"text"} required ref={userNameInputRef} />
            </div>
          )}
          <div className={classes.control}>
            <label>Email</label>
            <input type={"text"} required ref={emailInputRef} />
          </div>
          <div className={classes.control}>
            <label>Password</label>
            <input type={"password"} required ref={passwordInputRef} />
          </div>
          <div className={classes.actions}>
            {!isLoading && !isLoggedIn && (
              <button onClick={signInHandler}>Login</button>
            )}
            {!isLoading && isLoggedIn && (
              <button onClick={signUpHandler}>Sign Up</button>
            )}
            {isLoading && <p>Sending request, wait....</p>}
            <button
              type="button"
              className={classes.toggle}
              onClick={loginStateChanger}
            >
              {!isLoggedIn
                ? "Create new account"
                : "Login with existing account"}
            </button>
            {success && isLoggedIn && (
              <p>
                SignUp success. A verification link has been sent to your email,
                please verify and login :)
              </p>
            )}
          </div>
        </form>
        {!isLoggedIn && (
          <Link to={"/forgotpassword"}>
            <button className={classes.forgotbutton}>Forgot Password</button>
          </Link>
        )}
        <div className={classes.actions}>
          <Link to={"/login/phone"}>
            <button>Sign In using Phone</button>
          </Link>
        </div>

        <h1 className={classes.ortext}>Or</h1>

        <div className={classes.actions}>
          <GoogleButton onClick={() => googleSignIn(googleProvider)} />
        </div>
      </section>
    </>
  );
};

export default AuthForm;
