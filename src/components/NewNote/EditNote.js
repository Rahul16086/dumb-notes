import classes from "./NewNote.module.css";
import { useRef, useState } from "react";
import ErrorModal from "../Error/ErrorModal";

const EditNote = (props) => {
  const titleInputRef = useRef();
  const noteInputRef = useRef();
  const id = props.id;
  let title = props.title;
  let note = props.note;
  const fromWhere = props.where;
  const [error, setError] = useState("");
  const [method, setMethod] = useState("");

  const updateNoteHandler = () => {
    const idKey = localStorage.getItem("localId");
    const title = titleInputRef.current.value;
    const note = noteInputRef.current.value;
    if (title.length === 0 || note.length === 0) {
      setError("Fields cannot be empty :(");
      setMethod("nonedit");
    } else {
      const patch = {
        title: title,
        note: note,
      };
      let path;
      if (fromWhere === "allNotes") {
        path = "allnotes";
      } else {
        path = "favorites";
      }
      const url = `https://dumb-notes-default-rtdb.firebaseio.com/${idKey}/${path}/${id}.json`;

      fetch(url, { method: "PATCH", body: JSON.stringify(patch) })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          props.onDone(true);
        });
    }
  };

  const clearTextHandler = () => {
    const title = titleInputRef.current.value;
    const note = noteInputRef.current.value;

    if (title.length === 0 && note.length === 0) {
      document.getElementById("titleInput").value = "";
      document.getElementById("noteInput").value = "";
    } else {
      setError(
        "There might be some text entered. Are you sure you want to clear?"
      );
      setMethod("edit");
    }
  };

  const errorHandler = () => {
    setError(null);
    document.getElementById("titleInput").value = "";
    document.getElementById("noteInput").value = "";
  };

  const preserveText = () => {
    setError(null);
  };

  return (
    <>
      {error && (
        <ErrorModal
          method={method}
          error={error}
          hideModal={errorHandler}
          preserveText={preserveText}
        />
      )}
      {error && (
        <ErrorModal
          method={method}
          error={error}
          hideModal={errorHandler}
          preserveText={preserveText}
        />
      )}
      <section className={classes.sectionEdit}>
        <h1> Edit Note</h1>
        <div className={classes.control}>
          <label htmlFor={"title"}>Title</label>
          <input
            id={"titleInput"}
            type={"text"}
            ref={titleInputRef}
            required
            defaultValue={title}
          />
        </div>
        <div className={classes.control}>
          <label>Note here</label>
          <textarea id={"noteInput"} ref={noteInputRef} defaultValue={note} />
        </div>
        <div className={classes.actions}>
          <button onClick={updateNoteHandler}>Update Note</button>
          <button onClick={clearTextHandler}>Clear Current Note</button>
        </div>
      </section>
    </>
  );
};

export default EditNote;
