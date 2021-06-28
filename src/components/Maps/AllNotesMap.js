// import ReactMapGl, { FlyToInterpolator, Marker, Popup } from "react-map-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import markerStyle from "./MarkerStyle.module.css";
import React, { useEffect, useRef, useState } from "react";
import { mapboxApiKey } from "../../APIkeys";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxWorker from "mapbox-gl/dist/mapbox-gl-csp-worker";
import * as ReactDOM from "react-dom";

const CustomMarker = ({ onClick, children, feature }) => {
  const clicked = (e) => {
    onClick(feature);
  };
  return (
    <button onClick={clicked} className={markerStyle.markerBtn}>
      {children}
      <img
        src="https://image.flaticon.com/icons/png/512/889/889648.png"
        alt={"note img"}
      />
    </button>
  );
};

const AllNotesMap = (props) => {
  const allData = props.allData;
  const title = props.title;
  // const [viewport, setViewport] = useState({
  //   latitude: 10.862259986377486,
  //   longitude: 78.68783420020513,
  //   width: "90%",
  //   height: "80vh",
  //   zoom: 6.5,
  // });
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(78.68783420020513);
  const [lat, setLat] = useState(10.862259986377486);
  const [zoom, setZoom] = useState(10);
  // const [selectedNote, setSelectedNote] = useState(null);

  mapboxgl.workerClass = MapboxWorker;
  mapboxgl.accessToken = mapboxApiKey;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/1rahul6/ckqaitpdh2a4u17u5ecps0kuh",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    //normal marker
    //     allData.map((data) =>
    //       new mapboxgl.Marker()
    //         .setLngLat({
    //           lon: data.location.longitude,
    //           lat: data.location.latitude,
    //         })
    //         .addTo(map.current)
    //     );

    allData.forEach((data) => {
      //using mapboxgl.Marker
      const ref = React.createRef();
      ref.current = document.createElement("div");

      ReactDOM.render(
        <CustomMarker onClick={markerClicked} feature={data} />,
        ref.current
      );

      new mapboxgl.Marker(ref.current)
        .setLngLat({
          lon: data.location.longitude,
          lat: data.location.latitude,
        })
        .setPopup(
          new mapboxgl.Popup({ offset: 20 })
            .setHTML(`<h3 style="text-align: center">${data.title}</h3>`)
            .on("open", () => {
              map.current.flyTo({
                center: [data.location.longitude, data.location.latitude],
                zoom: 14,
              });
            })
        )
        .addTo(map.current);
    });
  });

  const markerClicked = (data) => {};

  // useEffect(() => {
  //   const listener = (e) => {
  //     if (e.key === "Escape") setSelectedNote(null);
  //   };
  //   window.addEventListener("keydown", listener);
  //
  //   return () => {
  //     window.removeEventListener("keydown", listener);
  //   };
  // }, []);

  return (
    <>
      {allData.length === 0 ? (
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Dancing script",
            fontSize: "50px",
          }}
        >
          No notes available to show in map :(
        </h1>
      ) : (
        <>
          <div>
            <h1
              style={{
                textAlign: "center",
                fontFamily: "Dancing script",
                fontSize: "50px",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p style={{ textAlign: "center" }}>
              Click on the note to view the Title
            </p>
            {/*{noteTitle && (*/}
            {/*  <h2 style={{ textAlign: "center" }}>Note Title: {noteTitle}</h2>*/}
            {/*)}*/}
          </div>
          <div className={markerStyle.map}>
            <div ref={mapContainer} style={{ width: "90%", height: "80vh" }} />
          </div>

          {/*<div className={markerStyle.map}>*/}
          {/*  <ReactMapGl*/}
          {/*    transitionDuration={1500}*/}
          {/*    transitionInterpolator={new FlyToInterpolator()}*/}
          {/*    {...viewport}*/}
          {/*    mapboxApiAccessToken={mapboxApiKey}*/}
          {/*    onViewportChange={(viewport) => {*/}
          {/*      setViewport(viewport);*/}
          {/*    }}*/}
          {/*    mapStyle={"mapbox://styles/1rahul6/ckqaitpdh2a4u17u5ecps0kuh"}*/}
          {/*  >*/}
          {/*    {allData.map((data) => (*/}
          {/*      <Marker*/}
          {/*        key={data.key}*/}
          {/*        latitude={data.location.latitude}*/}
          {/*        longitude={data.location.longitude}*/}
          {/*      >*/}
          {/*        <button*/}
          {/*          className={markerStyle.markerBtn}*/}
          {/*          onClick={(event) => {*/}
          {/*            event.preventDefault();*/}
          {/*            setSelectedNote(data);*/}
          {/*            setViewport({*/}
          {/*              latitude: data.location.latitude,*/}
          {/*              longitude: data.location.longitude,*/}
          {/*              width: "90%",*/}
          {/*              height: "80vh",*/}
          {/*              zoom: 12,*/}
          {/*            });*/}
          {/*          }}*/}
          {/*        >*/}
          {/*          <img*/}
          {/*            src="https://image.flaticon.com/icons/png/512/889/889648.png"*/}
          {/*            alt={"note img"}*/}
          {/*          />*/}
          {/*        </button>*/}
          {/*      </Marker>*/}
          {/*    ))}*/}
          {/*    {selectedNote ? (*/}
          {/*      <Popup*/}
          {/*        longitude={selectedNote.location.longitude}*/}
          {/*        latitude={selectedNote.location.latitude}*/}
          {/*        onClose={() => {*/}
          {/*          setSelectedNote(null);*/}
          {/*          setViewport({ ...viewport, zoom: viewport.zoom - 0.5 });*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        <div>*/}
          {/*          <h4*/}
          {/*            style={{*/}
          {/*              textAlign: "center",*/}
          {/*              fontFamily: "Dancing script",*/}
          {/*              margin: 0,*/}
          {/*              fontSize: "20px",*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            Title*/}
          {/*          </h4>*/}
          {/*          <h3 style={{ margin: "5px" }}>{selectedNote.title}</h3>*/}
          {/*        </div>*/}
          {/*      </Popup>*/}
          {/*    ) : null}*/}
          {/*  </ReactMapGl>*/}
          {/*</div>*/}
        </>
      )}
    </>
  );
};

export default AllNotesMap;
