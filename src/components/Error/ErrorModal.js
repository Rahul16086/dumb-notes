import classes from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  return (
    <>
      <div className={classes.backdrop} onClick={props.hideModal} />
      <section className={classes.errorsection}>
        <header>{props.method !== "edit" && <h1>Error occurred :(</h1>}</header>
        <div>
          <p>{props.error}</p>
        </div>
        <div className={classes.div}>
          <button onClick={props.hideModal}>Okay!</button>
          {props.method === "edit" && (
            <button onClick={props.preserveText}>Cancel</button>
          )}
        </div>
      </section>
    </>
  );
};

export default ErrorModal;
