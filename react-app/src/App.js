import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, StaticRouter } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import UploadPicture from "./components/AWSForm";
import HomePage from "./components/Homepage";
import Recommended from './components/Recommended'
import AlbumForm from "./components/AlbumForm";
import AlbumInfo from "./components/AlbumInfo";
import PlaylistInfo from "./components/Playlist";
import LikedSongs from "./components/LikedSongs";
import PageNotFound from "./components/PageNotFound";
import { authenticate } from "./store/session";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Loading from "./components/Loading";
// import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      {isLoaded && (
        <Switch>
          <Route exact path='/' >
            <HomePage Content={Recommended} />
          </Route>
          <Route path='/albums/:albumId' >
            <HomePage Content={AlbumInfo} />
          </Route>
          <Route path='/playlists/:playlistId'>
            <HomePage Content={PlaylistInfo} />
          </Route>
          <Route path='/likedSongs'>
            <HomePage Content={LikedSongs} />
          </Route>
          <Route path='/loading'>
            <HomePage Content={Loading} />
          </Route>
          <Route path='*'>
            <PageNotFound />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
