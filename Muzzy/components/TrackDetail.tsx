import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Bookmark, 
  BookmarkPlus, 
  Activity, 
  Clock,
  Volume2,
  SkipBack,
  SkipForward,
  Plus,
  List
} from 'lucide-react';

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

interface TrackDetailProps {
  track: Track;
  onBack: () => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, updatedPlaylist: Partial<Playlist>) => void;
}

export function TrackDetail({ track, onBack, playlists, onAddToPlaylist }: TrackDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [bookmarks, setBookmarks] = useState(track.bookmarks);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);

  const totalDuration = track.durationSeconds;
  const currentBpm = Math.round(track.bpm * speed);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddBookmark = () => {
    const newBookmark = {
      time: currentTime,
      note: bookmarkNote || `Bookmark at ${formatTime(currentTime)}`
    };
    setBookmarks([...bookmarks, newBookmark]);
    setBookmarkNote('');
  };

  const handleJumpToBookmark = (time: number) => {
    setCurrentTime(time);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && !playlist.tracks.some(t => t.id === track.id)) {
      onAddToPlaylist(playlistId, {
        tracks: [...playlist.tracks, track]
      });
      setShowPlaylistDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
          
          <Dialog open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add to Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add "{track.title}" to Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {playlists.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No playlists yet. Create one from the playlists page.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {playlists.map((playlist) => {
                      const isTrackInPlaylist = playlist.tracks.some(t => t.id === track.id);
                      return (
                        <Button
                          key={playlist.id}
                          variant={isTrackInPlaylist ? "secondary" : "outline"}
                          size="sm"
                          className="w-full justify-between"
                          onClick={() => handleAddToPlaylist(playlist.id)}
                          disabled={isTrackInPlaylist}
                        >
                          <div className="flex items-center space-x-2">
                            <List className="w-4 h-4" />
                            <span>{playlist.name}</span>
                          </div>
                          {isTrackInPlaylist && <span className="text-xs">Added</span>}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Track Info & Cover */}
          <div className="space-y-6">
            <div className="relative">
              <ImageWithFallback
                src={track.imageUrl}
                alt={track.title}
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl mb-2">{track.title}</h1>
                <p className="text-xl text-muted-foreground">{track.artist}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{track.genre}</Badge>
                {track.vibe.map((vibe) => (
                  <Badge key={vibe} variant="secondary">
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Controls & Info */}
          <div className="space-y-6">
            {/* BPM & Duration Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Current BPM</p>
                  <p className="text-2xl">{currentBpm}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-2xl">{track.duration}</p>
                </CardContent>
              </Card>
            </div>

            {/* Playback Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Playback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={totalDuration}
                    step={1}
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{track.duration}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="icon">
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button 
                    size="lg"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Speed Control */}
            <Card>
              <CardHeader>
                <CardTitle>Speed Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Speed: {speed.toFixed(1)}x</span>
                    <span>Original BPM: {track.bpm}</span>
                  </div>
                  <Slider
                    value={[speed]}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    onValueChange={(value) => setSpeed(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5x</span>
                    <span>1.0x</span>
                    <span>2.0x</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volume Control */}
            <Card>
              <CardHeader>
                <CardTitle>Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-4 h-4" />
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm w-12">{Math.round(volume * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bookmarks Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bookmark className="w-5 h-5 mr-2" />
              Bookmarks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Bookmark */}
            <div className="flex space-x-2">
              <Input
                placeholder="Add a note for this bookmark..."
                value={bookmarkNote}
                onChange={(e) => setBookmarkNote(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddBookmark}>
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Bookmark List */}
            <div className="space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No bookmarks yet. Add one to remember important moments!
                </p>
              ) : (
                bookmarks.map((bookmark, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                    onClick={() => handleJumpToBookmark(bookmark.time)}
                  >
                    <div>
                      <p className="font-medium">{bookmark.note}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(bookmark.time)}
                      </p>
                    </div>
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}