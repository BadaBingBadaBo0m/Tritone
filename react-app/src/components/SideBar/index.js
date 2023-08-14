import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { getUsersAlbums } from '../../store/albums';
import playlists, { getUsersPlaylists } from '../../store/playlists';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal'
import SignupFormModal from '../SignupFormModal';
import AlbumForm from '../AlbumForm';
import './sidebar.css';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
  const [albumTooltip, setAlbumTooltip] = useState(false)
  const [tooltipType, setTooltipType] = useState('')
  const dispatch = useDispatch()
  const history = useHistory();
  const user = useSelector((state) => state.session.user)
  const usersAlbums = useSelector((state) => state.albums.usersAlbums)
  const usersPlaylists = useSelector((state) => state.playlists.usersPlaylists)

  useEffect(() => {
    if (user) {
      dispatch(getUsersAlbums())
      dispatch(getUsersPlaylists())
    }
  }, [user])

  useEffect(() => {
    if (albumTooltip === true) {
      const tooltipTimeout = setTimeout(() => {
        setAlbumTooltip(false)
      }, 5000);

      return () => {
        clearTimeout(tooltipTimeout)
      }
    }
  }, [albumTooltip])

  const createAlbumTooltip = () => {
    setTooltipType('album')
    setAlbumTooltip(true)
  }

  const createPlaylistTooltip = () => {
    setTooltipType('playlist')
    setAlbumTooltip(true)
  }

  return (
    <>
      <div id='side-bar-container'>
        <ul id='home-button-container'>
          <li>
            <button onClick={() => history.push('/')}>Home</button>
          </li>
          <li>
            <button>Search</button>
          </li>
        </ul>

        <div id='playlist-albums-container'>

          <h2 id='library-heading'>Your Library</h2>

          {!user &&
            < div id='create-playlist' data-tooltip-id='create-playlist-tooltip'>
              <h2 id='first-playlist-heading'>Create your first playlist</h2>
              <p id='first-playlist-desc'>It's easy, we'll help you</p>
              <button id='dead-create-playlist-button' onClick={createPlaylistTooltip}>Create playlist</button>
            </div>
          }

          {user && (usersPlaylists && usersPlaylists.length === 0) &&
            < div id='create-playlist' data-tooltip-id='create-playlist-tooltip'>
              <h2 id='first-playlist-heading'>Create your first playlist</h2>
              <p id='first-playlist-desc'>It's easy, we'll help you</p>
              <button id='dead-create-playlist-button' onClick={() => console.log('button')}>Create playlist</button>
            </div>
          }

          {user && (usersPlaylists && usersPlaylists.length > 0) &&
            <div id='create-playlist' data-tooltip-id='create-playlist-tooltip'>
              <h2 id='playlist-list-heading'>Your Playlists</h2>
              <button id='dead-create-playlist-button' onClick={() => console.log('button')}>Create playlist</button>
              <ul id='playlist-list-container'>
                {usersPlaylists.map(playlist => (
                  <li>
                    <NavLink
                      to={`/playlists/${playlist.id}`}
                      id='owned-album'
                      activeStyle={{
                        backgroundColor: '#242424',
                      }}
                      style={{
                        color: 'white',
                        textDecoration: 'none'
                      }}
                      className='album-navLink'
                    >
                      <img id='owned-album-cover' src={playlist.picture}></img>
                      <h2 id='owned-album-name'>{playlist.name}</h2>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          }

          <div id='owned-albums-container' data-tooltip-id='create-album-tooltip'>
            {(!user || !usersAlbums || usersAlbums.length === 0) && <h2 id='owned-albums-title'>Create your first album</h2>}
            {user && usersAlbums && usersAlbums.length > 0 && <h2 id='owned-albums-title'>Your Albums</h2>}

            <div id='create-album-button-container'>
              {!user && <button id='dead-create-album' onClick={createAlbumTooltip}>Create a album</button>}
              {user && <OpenModalButton buttonText={'Create new album'} modalComponent={<AlbumForm type={'create'} />} />}
            </div>

            <ul id='user-owned-albums-container'>
              {usersAlbums && usersAlbums.map(album => (
                <li>
                  <NavLink
                    to={`/albums/${album.id}`}
                    id='owned-album'
                    activeStyle={{
                      backgroundColor: '#242424',
                    }}
                    style={{
                      color: 'white',
                      textDecoration: 'none'
                    }}
                    className='album-navLink'
                  >
                    <img id='owned-album-cover' src={album.art}></img>
                    <h2 id='owned-album-name'>{album.name}</h2>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div >
      <Tooltip
        id={`create-${tooltipType}-tooltip`}
        variant='info'
        openOnClick
        clickable
        place='right'
        className='create-album-tooltip'
        opacity={1}
        isOpen={albumTooltip}
      >
        <div id='album-tooltip-header-container'>
          {tooltipType === 'album' && < h2 id='album-tooltip-header'>Create an Album</h2>}
          {tooltipType === 'playlist' && < h2 id='album-tooltip-header'>Create a playlist</h2>}
          {tooltipType === 'album' && <p id='album-tooltip-sub-header'>Login to create an album</p>}
          {tooltipType === 'playlist' && <p id='album-tooltip-sub-header'>Login to create a playlist</p>}
        </div>

        <div id='album-tooltip-button-container'>
          <div className='login-button' onClick={() => setAlbumTooltip(false)}>
            <OpenModalButton buttonText={'Login'} modalComponent={<LoginFormModal />} />
          </div>
          <div id='album-tooltip-signUp-button' onClick={() => setAlbumTooltip(false)}>
            <OpenModalButton buttonText={'Sign up'} modalComponent={<SignupFormModal />} />
          </div>
        </div>
      </Tooltip >
    </>
  )
}

export default SideBar