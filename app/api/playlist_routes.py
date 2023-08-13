from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..forms import AlbumForm, UpdateAlbumForm
from app.models import db, playlist_songs, Playlist, Song
from .AWS_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3

playlist_routs = Blueprint('playlists', __name__)

@playlist_routs.route('/current')
@login_required
def get_users_playlists():
    """
    Gets all of the current user's playlists
    """
    playlists = Playlist.query.filter(Playlist.owner_id == current_user.id).all()

    user_playlists = []

    for playlist in playlists:
        user_playlists.append(playlist.to_dict())

    return { 'playlists': user_playlists }

@playlist_routs.route('/<int:id>/songs')
@login_required
def get_songs_in_playlist(id):
    """
    Gets all of the songs in a playlist
    """
    playlist = Playlist.query.get(id)

    if playlist is None:
        return { 'errors': 'Playlist not found' }, 404
    
    if playlist.owner_id != current_user.id:
        return { 'error': 'Unauthorized' }

    songs = [song for song in playlist.songs]

    song_list = []

    for song in songs:
        song_list.append(song.to_dict())

    return { 'songs': song_list }