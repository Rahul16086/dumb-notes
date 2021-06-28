import classes from "./ErrorModal.module.css";

const ConfirmModal = (props) => {
  return (
    <>
      <div className={classes.backdrop} onClick={props.hideModal} />
      <section className={classes.errorsection}>
        <header>
          <h1
            style={{
              color: "black",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Delete?! Are you sure?
          </h1>
        </header>

        <div className={classes.div}>
          <button onClick={props.confirmdelete}>Yes!</button>
          <button onClick={props.notdelete}>No...</button>
        </div>
      </section>
    </>
  );
};

export default ConfirmModal;
