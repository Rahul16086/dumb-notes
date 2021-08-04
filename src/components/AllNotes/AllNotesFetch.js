import classes from "./AllNotesFetch.module.css";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EditNote from "../NewNote/EditNote";
import ConfirmModal from "../Error/ConfirmModal";

const AllNotesFetch = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editDone, setEditDone] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const key = localStorage.getItem("localId");
    const response = await fetch(
      `https://dumb-notes-default-rtdb.firebaseio.com/${key}/allnotes.json`
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addToFavorites = (key, title, note, location) => {
    setLoading(true);
    const IdKey = localStorage.getItem("localId");
    const favNote = {
      id: key,
      title: title,
      note: note,
      location: location,
    };
    const url = `https://dumb-notes-default-rtdb.firebaseio.com/${IdKey}/favorites.json`;

    fetch(url, { method: "POST", body: JSON.stringify(favNote) })
      .then((res) => {
        return res.json();
      })
      .then((data) => {});
    deleteHandler(key);
    setLoading(false);
  };

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
    const IdKey = localStorage.getItem("localId");
    const url = `https://dumb-notes-default-rtdb.firebaseio.com/${IdKey}/allnotes/${key}.json`;

    fetch(url, { method: "DELETE" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDeleting((prevState) => {
          return !prevState;
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [deleting, fetchData]);

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
    return note.title?.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <>
      <div className={classes.btn}>
        <Link to={"/addnewnote"}>
          <button>+ Add new note</button>
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
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
            {data.length === 0 && (
              <h1 className={classes.nonotes}>
                No Notes found, start adding one :)
              </h1>
            )}
            {filteredNote.map((note) => (
              <li key={note.key} className={classes.sectioncontainer}>
                <div className={classes.section}>
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
                        addToFavorites(
                          note.id,
                          note.title,
                          note.note,
                          note.location
                        )
                      }
                    >
                      Move to Favorites
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
                      where={"allNotes"}
                      onDone={onEditDone}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default AllNotesFetch;
