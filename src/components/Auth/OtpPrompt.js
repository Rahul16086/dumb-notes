import { useRef } from "react";
import classes from "../Error/ErrorModal.module.css";

const OtpPrompt = (props) => {
  const otpRef = useRef();

  const sendOtp = () => {
    const receivedOtp = otpRef.current.value;
    props.received(receivedOtp);
  };
  return (
    <>
      <div className={classes.backdrop} />
      <section className={classes.errorsection}>
        <h1 style={{ color: "black", marginBottom: "10px" }}>Enter OTP</h1>
        <div className={classes.div}>
          <input type={"text"} ref={otpRef} />
        </div>
        <div className={classes.div}>
          <button onClick={sendOtp}>Submit</button>
          <button onClick={props.hideModal}>Cancel</button>
        </div>
      </section>
    </>
  );
};

export default OtpPrompt;
