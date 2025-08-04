import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Trash2, 
  Edit3, 
  Music, 
  Clock,
  Calendar
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

interface PlaylistManagerProps {
  playlists: Playlist[];
  onBack: () => void;
  onTrackSelect: (track: Track) => void;
  onCreatePlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt'>) => void;
  onUpdatePlaylist: (playlistId: string, updatedPlaylist: Partial<Playlist>) => void;
  onDeletePlaylist: (playlistId: string) => void;
}

export function PlaylistManager({
  playlists,
  onBack,
  onTrackSelect,
  onCreatePlaylist,
  onUpdatePlaylist,
  onDeletePlaylist
}: PlaylistManagerProps) {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim() || 'A new playlist',
        tracks: [],
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
      });
      setNewPlaylistName('');
      setNewPlaylistDescription('');
    }
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setEditingPlaylist(playlist);
    setEditName(playlist.name);
    setEditDescription(playlist.description);
  };

  const handleUpdatePlaylist = () => {
    if (editingPlaylist && editName.trim()) {
      onUpdatePlaylist(editingPlaylist.id, {
        name: editName.trim(),
        description: editDescription.trim()
      });
      setEditingPlaylist(null);
      setEditName('');
      setEditDescription('');
    }
  };

  const getTotalDuration = (tracks: Track[]) => {
    const totalSeconds = tracks.reduce((acc, track) => acc + track.durationSeconds, 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (selectedPlaylist) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedPlaylist(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Playlists
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditPlaylist(selectedPlaylist)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onDeletePlaylist(selectedPlaylist.id);
                  setSelectedPlaylist(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Playlist Header */}
          <div className="flex items-start space-x-6 mb-8">
            <ImageWithFallback
              src={selectedPlaylist.imageUrl}
              alt={selectedPlaylist.name}
              className="w-48 h-48 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h1 className="text-4xl mb-2">{selectedPlaylist.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{selectedPlaylist.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Music className="w-4 h-4" />
                  <span>{selectedPlaylist.tracks.length} tracks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{getTotalDuration(selectedPlaylist.tracks)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {selectedPlaylist.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {selectedPlaylist.tracks.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg mb-2">No tracks yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add tracks to this playlist from the music browser.
                </p>
                <Button onClick={onBack}>
                  Browse Music
                </Button>
              </div>
            ) : (
              selectedPlaylist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                  onClick={() => onTrackSelect(track)}
                >
                  <span className="text-muted-foreground text-sm w-6">
                    {index + 1}
                  </span>
                  
                  <ImageWithFallback
                    src={track.imageUrl}
                    alt={track.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{track.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  
                  <div className="hidden md:block text-sm text-muted-foreground">
                    {track.bpm} BPM
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {track.duration}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Playlist Dialog */}
        {editingPlaylist && (
          <Dialog open={!!editingPlaylist} onOpenChange={() => setEditingPlaylist(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Playlist name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Playlist description"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setEditingPlaylist(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdatePlaylist}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Discover
            </Button>
            <h1 className="text-2xl">My Playlists</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Enter playlist name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="Enter playlist description"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => {
                    setNewPlaylistName('');
                    setNewPlaylistDescription('');
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                    Create Playlist
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6">
        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl mb-2">No playlists yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first playlist to organize your favorite tracks.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Playlist
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Enter playlist name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newPlaylistDescription}
                      onChange={(e) => setNewPlaylistDescription(e.target.value)}
                      placeholder="Enter playlist description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                      setNewPlaylistName('');
                      setNewPlaylistDescription('');
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
                      Create Playlist
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <ImageWithFallback
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium truncate">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {playlist.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Music className="w-3 h-3" />
                        <span>{playlist.tracks.length} tracks</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{getTotalDuration(playlist.tracks)}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Created {playlist.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}