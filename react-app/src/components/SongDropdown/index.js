import React, { useRef, useState, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from "react-redux";
import OpenModalButton from '../OpenModalButton'
import ConfirmModal from '../ConfirmModal';
import { useModal } from '../../context/Modal';
import { SongContext } from '../../context/Song';
import { useHistory } from 'react-router-dom';
import { deleteSong, getSongsForAlbum } from '../../store/albums';
import { addSongToPlaylist } from '../../store/playlists';
import SongForm from '../SongForm';
import { Tooltip } from 'react-tooltip'
import './songdropdown.css'

const SongDropdown = ({ song, album }) => {
  const user = useSelector((state) => state.session.user);
  const playlists = useSelector((state) => state.playlists.usersPlaylists)
  const songList = useSelector((state) => state.albums.albumSongs)
  const { closeModal } = useModal()
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlistConfirmTooltip, setPlaylistConfirmTooltip] = useState(false)
  const [playlistMessage, setPlaylistMessage] = useState(null)
  const { setContextSongList } = useContext(SongContext)
  const songDropdownRef = useRef();

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (songDropdownRef.current && !songDropdownRef.current.contains(e.target)) {
        setShowPlaylistMenu(false)
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu); //close menu on click anywhere on document exept menu or button

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, song]);

  useEffect(() => {
    if (playlistConfirmTooltip) {
      const tooltipTimeout = setTimeout(() => {
        setPlaylistConfirmTooltip(false)
      }, 1200)

      return () => {
        clearTimeout(tooltipTimeout)
      }
    }
  }, [playlistConfirmTooltip])

  const ToggleMenu = () => {
    if (!showMenu) setShowMenu(true);
    else setShowMenu(false)
  }

  const handleSongDelete = async (id) => {
    const confirm = await dispatch(deleteSong(song.id))

    if (confirm.ok) {
      const songs = await dispatch(getSongsForAlbum(album.id))
      setContextSongList(songs)
      closeModal()
    }
  }

  const handleAddSongToPlaylist = async (playlistId, songId, name) => {
    const res = await dispatch(addSongToPlaylist(playlistId, songId))
    if (res.ok) {
      setPlaylistMessage(`added to ${name}`)
      setPlaylistConfirmTooltip(true)
    }

    if (res.status > 200) {
      const { errors } = await res.json()
      setPlaylistMessage(errors)
      setPlaylistConfirmTooltip(true)
    }
  }

  const classShowMenu = showMenu ? "song-dropdown-container" : "song-dropdown-container hidden"
  const showPlaylistDropdown = showPlaylistMenu ? 'song-add-to-playlist-list-dropdown' : 'song-add-to-playlist-list-dropdown hidden'

  return (
    <>
      <div ref={songDropdownRef} id='song-dropdown-ref-div'>
        {user &&
          <i className="fa-solid fa-ellipsis" id='song-dropdown-button' onClick={ToggleMenu}></i>}

        <div className={classShowMenu}>
          <ul className='song-dropdown'>

            <li className='song-dropdown-li'>
              {user && user.id === song.created_by && <div className='song-dropdown-button'>
                <OpenModalButton
                  buttonText={'Delete song'}
                  modalComponent={
                    <ConfirmModal
                      modalTitle={`Are you sure you want to delete ${song.name}`}
                      yesHandler={handleSongDelete}
                    />}
                />
              </div>}
            </li>

            <li className='song-dropdown-li'>
              {user && user.id === song.created_by && <div className='song-dropdown-button'>
                <OpenModalButton
                  buttonText={'Edit song'}
                  modalComponent={
                    <SongForm type={'edit'} albumId={album.id} song={song} />}
                />
              </div>}
            </li>

            <li className='song-dropdown-li'>
              {user && playlists && playlists.length > 0 && <div className='song-dropdown-button'>
                <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}>Add to playlist</button>
              </div>}
            </li>

          </ul>

          <ul className={showPlaylistDropdown}>
            <h2 className='playlists-list-dropdown-header'>Playlists</h2>
            {user && playlists && playlists.map(playlist => (
              <li>
                <button className='song-playlist-dropdown-button' onClick={() => handleAddSongToPlaylist(playlist.id, song.id, playlist.name)}>{playlist.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Tooltip
        id={`playlist-dropdown-message-${song.id}`}
        variant='info'
        openOnClick
        place='top'
        delayHide={500}
        isOpen={playlistConfirmTooltip}
        style={{ position: 'fixed', zIndex: '0' }}
      >
        <h1 id='playlist-tooltip-message'>{playlistMessage}</h1>
      </Tooltip>
    </>
  )
}

export default SongDropdown;