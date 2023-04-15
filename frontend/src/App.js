import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/SpotsShow"
import SingleSpotShow from "./components/SingleSpotShow";
import SpotForm from "./components/SpotForm";
import ManageSpots from "./components/ManageSpots";
import EditSpotForm from "./components/EditSpotForm";
import Map from "./components/MapPage";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path ="/">
            <Spots />
          </Route>
          <Route exact path="/signup">
            <SignupFormModal />
          </Route>
          <Route exact path ="/spots/new">
            <SpotForm />
          </Route>
          <Route exact path ="/spots/current">
            <ManageSpots />
          </Route>
          <Route exact path ="/spots/:spotId/edit">
            <EditSpotForm />
          </Route>
          <Route exact path ="/spots/:spotId">
            <SingleSpotShow />
          </Route>
          <Route exact path ="/map">
            <Map />
          </Route>
          <Route>Page not found</Route>
        </Switch>
      )}
    </>
  );
}

export default App;
