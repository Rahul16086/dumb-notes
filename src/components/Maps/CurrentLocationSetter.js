import classes from "../NewNote/NewNote.module.css";
import { useRef, useState } from "react";
import ErrorModal from "../Error/ErrorModal";
import LoadingSpinnerCurrentLocation from "./LoadingSpinnerCurrentLocation";

const CurrentLocationSetter = (props) => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [manual, setManual] = useState(false);
  const [addLocation, setAddLocation] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const placeInputRef = useRef();
  const cityInputRef = useRef();
  const stateInputRef = useRef();

  const currentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        getCoordinates,
        handleLocationErrors
      );
    }
  };

  const getCoordinates = (position) => {
    setLoading(true);
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    setAddLocation(true);
    console.log(position);
    if (position.coords.latitude || position.coords.longitude)
      reverseGeocode(position.coords.latitude, position.coords.longitude);
  };

  const reverseGeocode = (lat, long) => {
    setLoading(true);
    fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=dc52f448b51944dca181cf61e26150c9`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        console.log(data);
        setAddress(data.results[0].formatted);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  const handleLocationErrors = (error) => {
    setLoading(false);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        setError("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERR:
        setError("An unknown error occurred.");
        break;
      default:
        setError("An unknown error occurred.");
    }
  };

  const manualLocation = () => {
    setManual((prev) => {
      return !prev;
    });
    setAddLocation(false);
  };

  const hideError = () => {
    setError("");
  };

  const forwardGeocode = () => {
    setLoading(true);
    const place = placeInputRef.current.value;
    const city = cityInputRef.current.value;
    const state = stateInputRef.current.value;
    if (place === "" || city === "" || state === "") {
      setError("All fields are mandatory :(");
    } else {
      const joined = place + " " + city + " " + state;
      const PLACENAME = encodeURI(joined);
      // setAddress(place + ", " + city + ", " + state);

      const url = `https://api.opencagedata.com/geocode/v1/json?q=${PLACENAME}&key=dc52f448b51944dca181cf61e26150c9`;
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setLatitude(data.results[0].geometry.lat);
          setLongitude(data.results[0].geometry.lng);
          setAddress(data.results[0].formatted);
          setManual(false);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
      setAddLocation(true);
    }
  };

  const locationAdderToNote = () => {
    props.locationAdder({
      latitude: latitude,
      longitude: longitude,
      address: address,
    });
  };

  return (
    <section className={classes.location}>
      {!manual && !loading && (
        <div>
          <p>Latitude: {latitude}</p>
          <p>Longitude: {longitude}</p>
        </div>
      )}
      {loading && <LoadingSpinnerCurrentLocation />}
      {!manual && address && !loading && <p>For Address: {address}</p>}
      {manual && !loading && (
        <div className={classes.control}>
          <label>Street Name / Place / Locality</label>
          <input type={"text"} ref={placeInputRef} />
          <label>City</label>
          <input type={"text"} ref={cityInputRef} />
          <label>State</label>
          <input type={"text"} ref={stateInputRef} />
        </div>
      )}
      <div className={classes.actions}>
        {!manual && (
          <button onClick={currentLocation}>Get Current Location</button>
        )}
        {manual && <button onClick={forwardGeocode}>Fetch Lat and Long</button>}
        <button onClick={manualLocation}>
          {!manual ? "Enter Location Manually" : "Fetch Current Location"}
        </button>
        {addLocation && (
          <button onClick={locationAdderToNote}>Add Location</button>
        )}
      </div>
      {error && <ErrorModal error={error} hideModal={hideError} />}
    </section>
  );
};

export default CurrentLocationSetter;
