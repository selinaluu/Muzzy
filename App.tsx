import React, { useState } from 'react';
import { SignUpFlow } from './components/SignUpFlow';
import { DiscoveryPage } from './components/DiscoveryPage';
import { MusicBrowser } from './components/MusicBrowser';
import { TrackDetail } from './components/TrackDetail';
import { PlaylistManager } from './components/PlaylistManager';

type Screen = 'signup' | 'discovery' | 'browser' | 'track-detail' | 'playlists';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  bpm: number;
  genre: string;
  vibe: string[];
  imageUrl: string;
  bookmarks: Array<{ time: number; note: string }>;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  imageUrl: string;
  createdAt: Date;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signup');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignUpComplete = () => {
    setIsLoggedIn(true);
    setCurrentScreen('discovery');
  };

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    setCurrentScreen('track-detail');
  };

  const handleBackToBrowser = () => {
    setCurrentScreen('browser');
    setSelectedTrack(null);
  };

  const handleBackToDiscovery = () => {
    setCurrentScreen('discovery');
  };

  const handleGenreSelect = () => {
    setCurrentScreen('browser');
  };

  const handlePlaylistsOpen = () => {
    setCurrentScreen('playlists');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('signup');
    setSelectedTrack(null);
    setPlaylists([]);
  };

  const handleCreatePlaylist = (playlist: Omit<Playlist, 'id' | 'createdAt'>) => {
    const newPlaylist: Playlist = {
      ...playlist,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const handleUpdatePlaylist = (playlistId: string, updatedPlaylist: Partial<Playlist>) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId ? { ...playlist, ...updatedPlaylist } : playlist
      )
    );
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'signup' && (
        <SignUpFlow onComplete={handleSignUpComplete} />
      )}
      
      {currentScreen === 'discovery' && (
        <DiscoveryPage
          onGenreSelect={handleGenreSelect}
          onPlaylistsOpen={handlePlaylistsOpen}
          onLogout={handleLogout}
        />
      )}
      
      {currentScreen === 'browser' && (
        <MusicBrowser 
          onTrackSelect={handleTrackSelect}
          onPlaylistsOpen={handlePlaylistsOpen}
          onBackToDiscovery={handleBackToDiscovery}
          onLogout={handleLogout}
          playlists={playlists}
          onCreatePlaylist={handleCreatePlaylist}
        />
      )}
      
      {currentScreen === 'track-detail' && selectedTrack && (
        <TrackDetail 
          track={selectedTrack}
          onBack={handleBackToBrowser}
          playlists={playlists}
          onAddToPlaylist={handleUpdatePlaylist}
        />
      )}

      {currentScreen === 'playlists' && (
        <PlaylistManager
          playlists={playlists}
          onBack={handleBackToDiscovery}
          onTrackSelect={handleTrackSelect}
          onCreatePlaylist={handleCreatePlaylist}
          onUpdatePlaylist={handleUpdatePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
        />
      )}
    </div>
  );
}