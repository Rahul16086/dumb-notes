import classes from "../AllNotes/AllNotesFetch.module.css";
import classess from "./FavoriteNotes.module.css";
import { useState, useEffect, useCallback } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EditNote from "../NewNote/EditNote";
import ConfirmModal from "../Error/ConfirmModal";

const FavoriteNotes = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState("");
  const [move, setMove] = useState(false);
  const [editDone, setEditDone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const key = localStorage.getItem("localId");
    const response = await fetch(
      `https://dumb-notes-default-rtdb.firebaseio.com/${key}/favorites.json`
    );
    const responseData = await response.json();

    const loadedData = [];
    for (const key in responseData) {
      loadedData.push({
        id: key,
        title: responseData[key].title,
        note: responseData[key].note,
        key: key,
        location: responseData[key].location,
      });
    }
    setData(loadedData);
    setLoading(false);
    let count = loadedData.length.toString();
    if (count === null) {
      count = "0";
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteHandlerBefore = (key) => {
    localStorage.setItem("itemtodelete", key);
    setDeleteConfirm(true);
  };

  const setFinalDeleteTrue = () => {
    setDeleteConfirm(false);
    deleteHandler(localStorage.getItem("itemtodelete"));
  };

  const setFinalDeleteFalse = () => {
    setDeleteConfirm(false);
  };

  const deleteHandler = (key) => {
    const idKey = localStorage.getItem("localId");
    const url = `https://dumb-notes-default-rtdb.firebaseio.com/${idKey}/favorites/${key}.json`;

    fetch(url, { method: "DELETE" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMove((prevState) => {
          return !prevState;
        });
      });
  };

  const removeHandler = (key, title, note, location) => {
    const IdKey = localStorage.getItem("localId");
    const allNote = {
      id: key,
      title: title,
      note: note,
      location: location,
    };
    const url = `https://dumb-notes-default-rtdb.firebaseio.com/${IdKey}/allnotes.json`;

    fetch(url, { method: "POST", body: JSON.stringify(allNote) })
      .then((res) => {
        return res.json();
      })
      .then((data) => {});
    deleteHandler(key);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, move]);

  const editNoteHandler = (id) => {
    setEditMode((prevState) => {
      return !prevState;
    });
    setEditNoteId(id);
  };

  const onEditDone = (done) => {
    if (done) {
      setEditDone((prevState) => {
        return !prevState;
      });
      setEditMode(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, editDone]);

  const filteredNote = data.filter((note) => {
    return note.title.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {data.length === 0 ? (
            <h1 className={classess.heading}>No Favorites yet :(</h1>
          ) : (
            <h1 className={classess.heading}>Favorites❤️</h1>
          )}
          <>
            {data.length > 1 && (
              <div className={classes.searchInputContainer}>
                <input
                  type={"text"}
                  placeholder={"Search For Note"}
                  onChange={(e) => setSearchText(e.target.value)}
                  className={classes.searchInput}
                />
              </div>
            )}
            <ul className={classes.sectioncontainer}>
              {filteredNote.map((note) => (
                <li key={note.id} className={classes.sectioncontainer}>
                  <section className={classes.section}>
                    <h1>{note.title}</h1>
                    <p>{note.note}</p>

                    <div>
                      <button onClick={() => editNoteHandler(note.id)}>
                        {editMode && editNoteId === note.id
                          ? "Hide editor"
                          : "Edit"}
                      </button>
                      <button
                        onClick={() =>
                          removeHandler(
                            note.id,
                            note.title,
                            note.note,
                            note.location
                          )
                        }
                      >
                        Move to All
                      </button>
                      <button onClick={() => deleteHandlerBefore(note.id)}>
                        Delete
                      </button>
                      {deleteConfirm && (
                        <ConfirmModal
                          confirmdelete={setFinalDeleteTrue}
                          notdelete={setFinalDeleteFalse}
                        />
                      )}
                    </div>
                    {editMode && editNoteId === note.id && (
                      <EditNote
                        id={note.id}
                        title={note.title}
                        note={note.note}
                        where={"favorites"}
                        onDone={onEditDone}
                      />
                    )}
                  </section>
                </li>
              ))}
            </ul>
          </>
        </div>
      )}
    </>
  );
};

export default FavoriteNotes;
