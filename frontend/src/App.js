import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormModal from "./components/SignupFormModal";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/SpotsShow"
import SingleSpotShow from "./components/SingleSpotShow";
import CreateNewSpotForm from "./components/CreateNewSpotForm";


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
          <Route path="/signup">
            <SignupFormModal />
          </Route>
          <Route exact path ="/">
            <Spots />
          </Route>
          <Route exact path ="/spots/:spotId">
            <SingleSpotShow />
          </Route>
          <Route exact path ="/spots">
            <CreateNewSpotForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
