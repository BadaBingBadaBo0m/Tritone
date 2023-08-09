import React from 'react'
import './sidebar.css'

const SideBar = () => {

  return (
    <div id='side-bar-container'>
      <ul id='home-button-container'>
        <li>
          <button>Home</button>
        </li>
        <li>
          <button>Search</button>
        </li>
      </ul>
      <div id='playlist-container'>
        <div id='library-container'>
          <h2 id='library-heading'>Your Library</h2>
          <div id='create-first-playlist'>
            <h2 id='first-playlist-heading'>Create your first playlist</h2>
            <p id='first-playlist-desc'>It's easy, we'll help you</p>
            <span id='create-playlist-button'>Create playlist</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideBar