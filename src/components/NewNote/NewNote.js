import classes from "./NewNote.module.css";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorModal from "../Error/ErrorModal";
import CurrentLocationSetter from "../Maps/CurrentLocationSetter";

const NewNote = () => {
  const titleInputRef = useRef();
  const noteInputRef = useRef();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState("");
  const [showLocation, setShowLocation] = useState(true);
  const [noteLocation, setNoteLocation] = useState({});
  const [locationAdded, setLocationAdded] = useState(false);

  const addNoteHandler = () => {
    setIsLoading(true);
    const title = titleInputRef.current.value;
    const notes = noteInputRef.current.value;

    if (title.length === 0 || notes.length === 0) {
      setIsLoading(false);
      setError("Fields cannot be empty :)");
    } else if (!showLocation) {
      setError("Please click add location to add location or click hide :)");
      setIsLoading(false);
    } else {
      setIsLoading(true);

      const note = {
        title: title,
        note: notes,
        key: Math.random().toFixed(5) * 10000,
        id: Math.random().toFixed(5) * 10000,
        location: noteLocation,
      };

      const key = localStorage.getItem("localId");

      fetch(
        `https://dumb-notes-default-rtdb.firebaseio.com/${key}/allnotes.json`,
        {
          method: "POST",
          body: JSON.stringify(note),
          headers: {
            "Content-type": "application/json",
          },
        }
      ).then((res) => {
        if (res.ok) history.push("/all");
      });
      setIsLoading(false);
    }
  };

  const clearTextHandler = () => {
    setEmpty(false);
    const title = titleInputRef.current.value;
    const note = noteInputRef.current.value;
    console.log(title.length);
    if (title.length === 0 && note.length === 0) {
      document.getElementById("titleInput").value = "";
      document.getElementById("noteInput").value = "";
    } else {
      const confirm = window.confirm(
        "There might be some text entered. Are you sure you want to clear?"
      );
      if (confirm) {
        document.getElementById("titleInput").value = "";
        document.getElementById("noteInput").value = "";
      }
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  const showLocationToggler = () => {
    setShowLocation((prev) => {
      return !prev;
    });
  };

  const addLocation = (location) => {
    setNoteLocation(location);
    setShowLocation((prev) => {
      return !prev;
    });
    setLocationAdded(true);
  };
  console.log(showLocation);
  let btn = "";
  if (locationAdded) {
    btn = "Edit Location";
  } else {
    btn = "Add Location";
  }

  return (
    <>
      {error && <ErrorModal error={error} hideModal={errorHandler} />}
      <div className={classes.sectionContainer}>
        <section className={classes.section}>
          <h1> New Note</h1>
          <div className={classes.control}>
            <label>Title</label>
            <input
              id={"titleInput"}
              type={"text"}
              ref={titleInputRef}
              required
            />
          </div>
          <div className={classes.control}>
            {empty && <p style={{ color: "red" }}>Please enter some note!!!</p>}
            <label>Note here</label>
            <textarea id={"noteInput"} ref={noteInputRef} />
          </div>
          {locationAdded && (
            <div>
              <p style={{ fontWeight: "bold" }}>Location added successfully!</p>
              <p>Latitude: {noteLocation.latitude}</p>
              <p>Longitude: {noteLocation.longitude}</p>
              <p>Address: {noteLocation.address}</p>
            </div>
          )}
          <div className={classes.actions}>
            <button onClick={addNoteHandler}>Add Note</button>
            <button onClick={clearTextHandler}>Clear Current Note</button>
            <button onClick={showLocationToggler}>
              {showLocation ? btn : "Hide"}
            </button>
          </div>
          {!showLocation && (
            <CurrentLocationSetter locationAdder={addLocation} />
          )}
        </section>
      </div>

      {isLoading && (
        <p style={{ textAlign: "center" }}>Saving to database....</p>
      )}
    </>
  );
};

export default NewNote;
