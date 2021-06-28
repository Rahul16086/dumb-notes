import classes from "../Auth/AuthForm.module.css";
import { useRef, useState } from "react";
import ErrorModal from "../Error/ErrorModal";
import { Link } from "react-router-dom";
import firebase from "../../config/firebase";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef();
  const [success, setSuccess] = useState(false);

  const emailEntered = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const enteredEmailInput = emailInputRef.current.value;

    return firebase
      .auth()
      .sendPasswordResetEmail(enteredEmailInput)
      .then(() => {
        setIsLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        setIsLoading(false);
        const errorMessage = error.message;
        setError(errorMessage);
        // ..
      });
    // const url =
    //   "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyAQ-f2ETosOTOr2ni8nkGQqGUG2_C22zAQ";
    //
    // fetch(url, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     requestType: "PASSWORD_RESET",
    //     email: enteredEmailInput,
    //   }),
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     setIsLoading(false);
    //     if (res.ok) {
    //       setSuccess(true);
    //       return res.json();
    //     } else {
    //       return res.json().then((data) => {
    //         console.log(data);
    //         let errorMessage;
    //         if (data && data.error && data.error.message)
    //           errorMessage = data.error.message;
    //         throw new Error(errorMessage);
    //       });
    //     }
    //   })
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     setError(err.message);
    //   });
  };

  const errorHide = () => {
    setError(null);
  };

  if (error === "EMAIL_NOT_FOUND") {
    setError(
      "The entered email doesn't exist. Please continue by creating new account"
    );
  }

  if (success) {
    document.getElementById("email").value = "";
  }
  return (
    <>
      {error && <ErrorModal hideModal={errorHide} error={error} />}
      <section>
        <form className={classes.auth} onSubmit={emailEntered}>
          <h1>Reset Password</h1>
          <div className={classes.control}>
            <label>Enter your Email</label>
            <input type={"text"} required ref={emailInputRef} id={"email"} />
          </div>
          <div className={classes.actions}>
            <button>Submit</button>
            <Link to={"/login"}>
              <button style={{ marginTop: "10px" }}>Back to Login</button>
            </Link>
            {isLoading && <p>Sending request, wait....</p>}
            {success && (
              <p>
                A Password reset link has been sent to your Email. Please check
                :)
              </p>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default ForgotPassword;
