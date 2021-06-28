import PasswordChanger from "./PasswordChanger";
import classes from "./UserProfile.module.css";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const UserProfile = () => {
  const [show, setShow] = useState(false);
  const [allData, setAllData] = useState([]);
  const [favData, setFavData] = useState([]);
  const [loading, setLoading] = useState(false);
  const signInMethod = localStorage.getItem("signinmethod");

  let truthy = false;
  if (!signInMethod) {
    truthy = true;
  }

  const showPasswordChanger = () => {
    setShow((prevstate) => {
      return !prevstate;
    });
  };

  const fetchAllData = useCallback(async () => {
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
        author: responseData[key].author,
        note: responseData[key].note,
        key: key,
        location: responseData[key].location,
      });
    }
    setAllData(loadedData);
    setLoading(false);
    let count = loadedData.length.toString();
    if (count === null) {
      count = "0";
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchFavData = useCallback(async () => {
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
        author: responseData[key].author,
        note: responseData[key].note,
        key: key,
        location: responseData[key].location,
      });
    }
    setFavData(loadedData);
    setLoading(false);

    let count = loadedData.length.toString();
    if (count === null) {
      count = "0";
    }
  }, []);

  useEffect(() => {
    fetchFavData();
  }, [fetchFavData]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {truthy && !loading && (
        <section className={classes.section}>
          <h1>Hey There! Wanna change password?</h1>
          <button onClick={showPasswordChanger}>
            {!show ? "Change Password" : "Hide Password Changer"}
          </button>
          {show && <PasswordChanger />}
        </section>
      )}
      {!loading && (
        <section className={classes.stats}>
          <h1>Profile stats</h1>
          <ul>
            <li>All Notes: {allData.length}</li>
            <li>Favorite Notes: {favData.length}</li>
          </ul>
        </section>
      )}
    </>
  );
};

export default UserProfile;
