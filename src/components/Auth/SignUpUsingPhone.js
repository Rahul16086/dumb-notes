import classes from "./AuthForm.module.css";
import { useContext, useRef, useState } from "react";
import firebase from "../../config/firebase";
import ErrorModal from "../Error/ErrorModal";
import AuthContext from "../../store/auth-context";
import { Link, useHistory } from "react-router-dom";
import OtpPrompt from "./OtpPrompt";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const SignUpUsingPhone = () => {
  const phoneInputRef = useRef();
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResultObject, setConfirmationResultObject] = useState({});
  const [loading, setLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const recaptchaVerifier = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "captchaContainer",
      {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      }
    );
  };

  const onSignInSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    recaptchaVerifier();
    firebase.auth().settings.appVerificationDisabledForTesting = true;
    let phoneNumber = phoneInputRef.current.value;
    if (phoneNumber === "") {
      setError("Please enter phone number");
      setLoading(false);
    } else {
      phoneNumber = "+91" + phoneInputRef.current.value;

      const appVerifier = window.recaptchaVerifier;

      firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setOtpSent(true);
          setConfirmationResultObject(confirmationResult);
          localStorage.setItem("signinmethod", "phone");
        })
        .catch((error) => {
          setLoading(false);
          setError(error.message);
          console.log(error);
        });
    }
  };

  const otpOnConfirm = (otpFromReceived) => {
    confirmationResultObject
      .confirm(otpFromReceived)
      .then((result) => {
        setLoading(false);
        const user = result.user;
        authCtx.login(user.refreshToken);
        localStorage.setItem("localId", user.uid);
        history.replace("/");
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  const otpReceived = (otp) => {
    setOtpSent(false);
    otpOnConfirm(otp);
  };

  const hideError = () => {
    setError("");
  };

  const hidePrompt = () => {
    setOtpSent(false);
    window.location.reload();
  };

  return (
    <>
      <div className={classes.mainContainer}>
        {loading && <LoadingSpinner />}
        <div className={classes.auth}>
          <div className={classes.container}>
            <h1>SignIn with your Phone</h1>
            <form>
              <div className={classes.control}>
                <label>Enter your Phone Number(IN only)</label>
                <input type={"text"} ref={phoneInputRef} />
              </div>
              <div className={classes.actions}>
                <button onClick={onSignInSubmit}>Sign In</button>
                <Link to={"/login"}>
                  <button style={{ marginTop: "10px" }}>Back to login</button>
                </Link>
              </div>
              <div id={"captchaContainer"}></div>
            </form>
            {error && <ErrorModal error={error} hideModal={hideError} />}
            {otpSent && (
              <OtpPrompt received={otpReceived} hideModal={hidePrompt} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpUsingPhone;
