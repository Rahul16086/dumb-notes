import classes from "./NoteMapDisplay.module.css";
import AllNotesMap from "../Maps/AllNotesMap";
import { useCallback, useEffect, useState } from "react";

const NoteMapDisplay = () => {
  const [showAllMap, setShowAllMap] = useState(false);
  const [showFavMap, setShowFavMap] = useState(false);
  const [allDataForMap, setAllDataForMap] = useState([]);
  const [favDataForMap, setFavDataForMap] = useState([]);

  const fetchAllData = useCallback(async () => {
    const key = localStorage.getItem("localId");
    const response = await fetch(
      `https://dumb-notes-default-rtdb.firebaseio.com/${key}/allnotes.json`
    );
    const responseData = await response.json();

    const mapData = [];
    for (const key in responseData) {
      if (responseData[key].location) {
        mapData.push({
          key: key,
          location: responseData[key].location,
          title: responseData[key].title,
        });
      }
    }
    setAllDataForMap(mapData);

    let count = mapData.length.toString();
    if (count === null) {
      count = "0";
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchFavData = useCallback(async () => {
    const key = localStorage.getItem("localId");
    const response = await fetch(
      `https://dumb-notes-default-rtdb.firebaseio.com/${key}/favorites.json`
    );
    const responseData = await response.json();

    const mapFavData = [];
    for (const key in responseData) {
      if (responseData[key].location) {
        mapFavData.push({
          key: key,
          location: responseData[key].location,
          title: responseData[key].title,
        });
      }
    }
    setFavDataForMap(mapFavData);
    let count = mapFavData.length.toString();
    if (count === null) {
      count = "0";
    }
  }, []);

  useEffect(() => {
    fetchFavData();
  }, [fetchFavData]);

  const showAllMapToggle = () => {
    setShowAllMap((prev) => {
      return !prev;
    });
    setShowFavMap(false);
  };
  const showFavMapToggle = () => {
    setShowFavMap((prev) => {
      return !prev;
    });
    setShowAllMap(false);
  };

  return (
    <>
      <div className={classes.blur} />
      <div className={classes.section}>
        <h1>View your note map</h1>
        <button onClick={showAllMapToggle}>
          {showAllMap ? "Hide All Notes Map" : "All Notes Map"}
        </button>
        <button onClick={showFavMapToggle}>
          {showFavMap ? "Hide Favorites Map" : "Favorites Map"}
        </button>
      </div>
      {showAllMap && (
        <AllNotesMap allData={allDataForMap} title={"All Notes Map"} />
      )}
      {showFavMap && (
        <AllNotesMap allData={favDataForMap} title={"Favorite Notes Map"} />
      )}
    </>
  );
};

export default NoteMapDisplay;
