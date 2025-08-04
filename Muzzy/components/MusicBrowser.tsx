import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { 
  Search, 
  LogOut, 
  Play, 
  Clock, 
  Activity, 
  ArrowLeft,
  ArrowUpDown,
  List,
  Plus,
  Music
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

interface MusicBrowserProps {
  onTrackSelect: (track: Track) => void;
  onPlaylistsOpen: () => void;
  onBackToDiscovery: () => void;
  onLogout: () => void;
  playlists: Playlist[];
  onCreatePlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt'>) => void;
}

const mockTracks: Track[] = [
  {
    id: '1',
    title: 'Digital Dreams',
    artist: 'Synth Master',
    duration: '3:45',
    durationSeconds: 225,
    bpm: 128,
    genre: 'Electronic',
    vibe: ['energetic', 'futuristic', 'driving'],
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    bookmarks: []
  },
  {
    id: '2',
    title: 'Midnight Groove',
    artist: 'Bass Walker',
    duration: '4:12',
    durationSeconds: 252,
    bpm: 95,
    genre: 'Hip Hop',
    vibe: ['chill', 'smooth', 'nocturnal'],
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    bookmarks: []
  },
  {
    id: '3',
    title: 'Electric Pulse',
    artist: 'Voltage',
    duration: '2:58',
    durationSeconds: 178,
    bpm: 140,
    genre: 'Electronic',
    vibe: ['intense', 'aggressive', 'pumping'],
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    bookmarks: []
  },
  {
    id: '4',
    title: 'Sunset Melody',
    artist: 'Golden Hour',
    duration: '5:23',
    durationSeconds: 323,
    bpm: 72,
    genre: 'Ambient',
    vibe: ['peaceful', 'atmospheric', 'dreamy'],
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    bookmarks: []
  },
  {
    id: '5',
    title: 'Urban Beats',
    artist: 'City Sounds',
    duration: '3:31',
    durationSeconds: 211,
    bpm: 110,
    genre: 'Hip Hop',
    vibe: ['urban', 'rhythmic', 'street'],
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    bookmarks: []
  },
  {
    id: '6',
    title: 'Cosmic Journey',
    artist: 'Space Explorer',
    duration: '6:14',
    durationSeconds: 374,
    bpm: 85,
    genre: 'Ambient',
    vibe: ['spacey', 'ethereal', 'vast'],
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    bookmarks: []
  }
];

type SortOption = 'title' | 'artist' | 'bpm' | 'duration';

export function MusicBrowser({ 
  onTrackSelect, 
  onPlaylistsOpen, 
  onBackToDiscovery, 
  onLogout,
  playlists,
  onCreatePlaylist 
}: MusicBrowserProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedTrackForPlaylist, setSelectedTrackForPlaylist] = useState<Track | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showCreatePlaylistDialog, setShowCreatePlaylistDialog] = useState(false);

  const genres = ['All', ...Array.from(new Set(mockTracks.map(track => track.genre)))];
  
  const filteredAndSortedTracks = mockTracks
    .filter(track => {
      const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           track.artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'artist':
          aValue = a.artist.toLowerCase();
          bValue = b.artist.toLowerCase();
          break;
        case 'bpm':
          aValue = a.bpm;
          bValue = b.bpm;
          break;
        case 'duration':
          aValue = a.durationSeconds;
          bValue = b.durationSeconds;
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('asc');
    }
  };

  const handleCreateNewPlaylist = () => {
    if (newPlaylistName.trim() && selectedTrackForPlaylist) {
      onCreatePlaylist({
        name: newPlaylistName.trim(),
        description: `Playlist created with ${selectedTrackForPlaylist.title}`,
        tracks: [selectedTrackForPlaylist],
        imageUrl: selectedTrackForPlaylist.imageUrl,
      });
      setNewPlaylistName('');
      setSelectedTrackForPlaylist(null);
      setShowCreatePlaylistDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToDiscovery}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Discover
            </Button>
            
            <div className="flex items-center space-x-2">
              <Music className="w-6 h-6 text-primary" />
              <h1 className="text-xl">Browse Music</h1>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tracks..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onPlaylistsOpen}>
              <List className="w-4 h-4 mr-2" />
              Playlists
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Filters and Sorting */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Genre Filter */}
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
          
          {/* Sorting Controls */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('title')}
              className={sortBy === 'title' ? 'bg-muted' : ''}
            >
              Title
              <ArrowUpDown className="ml-1 w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('artist')}
              className={sortBy === 'artist' ? 'bg-muted' : ''}
            >
              Artist
              <ArrowUpDown className="ml-1 w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('bpm')}
              className={sortBy === 'bpm' ? 'bg-muted' : ''}
            >
              BPM
              <ArrowUpDown className="ml-1 w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('duration')}
              className={sortBy === 'duration' ? 'bg-muted' : ''}
            >
              Duration
              <ArrowUpDown className="ml-1 w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedTracks.length} tracks
            {sortOrder === 'desc' && ` (sorted ${sortBy} descending)`}
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTracks.map((track) => (
            <Card
              key={track.id}
              className="cursor-pointer hover:bg-muted/50 transition-colors group"
            >
              <CardContent className="p-4">
                <div className="relative mb-4" onClick={() => onTrackSelect(track)}>
                  <ImageWithFallback
                    src={track.imageUrl}
                    alt={track.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0" onClick={() => onTrackSelect(track)}>
                      <h3 className="font-medium truncate">{track.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTrackForPlaylist(track)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add to Playlist</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Add "{track.title}" to a playlist
                          </p>
                          
                          {playlists.length > 0 && (
                            <div className="space-y-2">
                              <p className="font-medium">Existing Playlists:</p>
                              {playlists.map((playlist) => (
                                <Button
                                  key={playlist.id}
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    // Add track to existing playlist logic would go here
                                    console.log(`Adding ${track.title} to ${playlist.name}`);
                                  }}
                                >
                                  {playlist.name}
                                </Button>
                              ))}
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <p className="font-medium">Create New Playlist:</p>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Playlist name"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                              />
                              <Button onClick={handleCreateNewPlaylist}>
                                Create
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{track.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-3 h-3" />
                      <span>{track.bpm} BPM</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {track.vibe.slice(0, 2).map((vibe) => (
                      <Badge key={vibe} variant="secondary" className="text-xs">
                        {vibe}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}