import classes from "./PasswordChanger.module.css";
import { useRef, useState } from "react";
import ErrorModal from "../Error/ErrorModal";
import firebase from "../../config/firebase";

const PasswordChanger = () => {
  const newPasswordInputRef = useRef();
  const currentPassword = useRef();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredCurrentPassword = currentPassword.current.value;
    const enteredNewPassword = newPasswordInputRef.current.value;

    if (enteredCurrentPassword === enteredNewPassword) {
      setError("New password cannot be the same as the old one!!");
    } else {
      const user = firebase.auth().currentUser;
      user
        .updatePassword(enteredNewPassword)
        .then(() => {
          setSuccess(true);
          document.getElementById("oldpass").value = "";
          document.getElementById("newpass").value = "";
        })
        .catch((error) => {
          const message = error.message;
          setError(message);
        });
    }
  };

  const afterError = () => {
    setError(null);
  };

  return (
    <>
      <section className={classes.section}>
        <form onSubmit={submitHandler}>
          <h1>Password Changer</h1>
          <label>Current Password</label>
          <input
            type={"password"}
            id={"oldpass"}
            required
            ref={currentPassword}
          />
          <label>New Password</label>
          <input
            type={"password"}
            id={"newpass"}
            required
            ref={newPasswordInputRef}
          />
          <button>Change Password</button>
        </form>
        {success && <p>Password changed successfully!!</p>}
      </section>
      {error && <ErrorModal error={error} hideModal={afterError} />}
    </>
  );
};

export default PasswordChanger;
