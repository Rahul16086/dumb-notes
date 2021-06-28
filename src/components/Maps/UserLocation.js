import { useState } from "react";
import classes from "../Auth/AuthForm.module.css";
import ReactMapGl, { Marker } from "react-map-gl";
import markerStyle from "./MarkerStyle.module.css";

const UserLocation = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [viewport, setViewport] = useState({
    latitude: 10.862259986377486,
    longitude: 78.68783420020513,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  });

  const mapBoxApi =
    "pk.eyJ1IjoiMXJhaHVsNiIsImEiOiJja3FhaGk4ZXowY2h1Mm5vdm95bWcyZXF0In0.8yxXjSmML5a2tWMqz3npXw";

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        handleLocationErrors
      );
    }
  };

  const getCoordinates = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    console.log(position);
    reverseGeocode(position.coords.latitude, position.coords.longitude);
  };

  const reverseGeocode = (lat, long) => {
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=dc52f448b51944dca181cf61e26150c9`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setAddress(data.results[0].formatted);
      });
  };

  const handleLocationErrors = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERR:
        alert("An unknown error occurred.");
        break;
      default:
        alert("An unknown error occurred.");
    }
  };

  return (
    <>
      <section className={classes.auth}>
        <h1>User Location</h1>
        <button onClick={getLocation}>Get coordinates</button>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
        {latitude && longitude && address && <p>Address: {address}</p>}
      </section>
      {latitude && longitude ? (
        <div>
          <ReactMapGl
            {...viewport}
            mapboxApiAccessToken={mapBoxApi}
            onViewportChange={(viewport) => {
              setViewport(viewport);
            }}
            mapStyle={"mapbox://styles/1rahul6/ckqaitpdh2a4u17u5ecps0kuh"}
          >
            <Marker latitude={latitude} longitude={longitude}>
              <button className={markerStyle.markerBtn}>
                <img
                  src="https://image.flaticon.com/icons/png/512/889/889648.png"
                  alt={"note img"}
                />
              </button>
            </Marker>
          </ReactMapGl>
        </div>
      ) : null}
    </>
  );
};

export default UserLocation;
