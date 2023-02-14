import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/SpotsShow"
import SingleSpotShow from "./components/SingleSpotShow";
import SpotForm from "./components/SpotForm";


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
          <Route exact path ="/spots/:spotId">
            <SingleSpotShow />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
