import React, { useEffect } from "react";
import "./index.css";
import { getSpots } from "../../store/Spots";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import { NavLink } from 'react-router-dom'

/* global google */

function createCenterControl(myMap) {
  const chicago = { lat: 37.7749, lng: -122.4194 };
  const controlButton = document.createElement("button");

  controlButton.classList.add("buttonStyle");

  controlButton.textContent = "Center Map";
  controlButton.title = "Click to recenter the map";
  controlButton.type = "button";
  controlButton.addEventListener("click", () => {
    myMap.setCenter(chicago);
  });

  return controlButton;
}

function Map() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(getSpots());
  }, [dispatch]);

  useEffect(() => {
    function initMap() {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: { lat: 37.7749, lng: -122.4194 },
        styles: [
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      const bounds = new google.maps.LatLngBounds(); // Define bounds variable here

      const centerControlDiv = document.createElement("div");
      const centerControl = createCenterControl(map);
      centerControlDiv.appendChild(centerControl);
      map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
        centerControlDiv
      );

      if (Object.keys(spots).length > 0) {
        Object.values(spots).forEach((spot) => {
          if (spot && spot.lat && spot.lng) {
            const marker = new google.maps.Marker({
              position: { lat: Number(spot.lat), lng: Number(spot.lng) },
              map,
              optimized: false,
              label: {
                text: `$${spot.price}`,
                color: 'black',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial',
                className: 'marker-label',
                width: '100px',
                height: '30px',
                background: {
                  color: 'white',
                  opacity: 1
                },
                borderRadius: '50%',
                padding: '5px 8px',
                boxShadow: '0px 0px 3px #33333333',
                zIndex: '1'
              },
              icon: null // Set the icon property to null
            });
            bounds.extend(marker.getPosition()); // Extend the bounds to include the marker position

            const infowindow = new google.maps.InfoWindow({
              content: `
                <a href="/spots/${spot.id}" class="infowindow">
                  <div class="infowindow-title">${spot.name}</div>
                  <div class="infowindow-price">$${spot.price}</div>
                  <div class="infowindow-image-container">
                    <img src="${spot.previewImage}" alt="Preview Image" class="infowindow-image">
                  </div>
                </a>
              `,
            });
            marker.addListener("click", () => {
              infowindow.open(map, marker);
            });
          }
        });
        map.fitBounds(bounds);
      }
    }


    window.initMap = initMap;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&callback=initMap`;

    script.async = true;

    // append the script to the document head
    document.head.appendChild(script);

    // cleanup function to remove the script from the document head when unmounting
    return () => {
      document.head.removeChild(script);
    };
  }, [dispatch, spots]);

  return (
    <div>
      <div id="map" style={{ height: "92.2vh" }} />
      <NavLink to="/" className='showList'>
        <div>Show List</div>
        <FontAwesomeIcon icon={faList} />
      </NavLink>
    </div>
  );
}


export default Map;
