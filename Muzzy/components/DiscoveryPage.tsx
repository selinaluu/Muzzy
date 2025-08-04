import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, LogOut, Music, Users, Headphones, List, Play } from 'lucide-react';

interface DiscoveryPageProps {
  onGenreSelect: () => void;
  onPlaylistsOpen: () => void;
  onLogout: () => void;
}

const genres = [
  {
    name: 'Electronic',
    description: 'Digital beats and synthesized sounds',
    trackCount: 1247,
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Hip Hop',
    description: 'Urban rhythms and powerful vocals',
    trackCount: 892,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Ambient',
    description: 'Atmospheric and meditative sounds',
    trackCount: 634,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    color: 'from-blue-500 to-teal-500'
  },
  {
    name: 'Pop',
    description: 'Catchy melodies and mainstream appeal',
    trackCount: 1532,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    color: 'from-pink-500 to-purple-500'
  },
  {
    name: 'Rock',
    description: 'Guitar-driven and energetic',
    trackCount: 967,
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    color: 'from-gray-500 to-gray-700'
  },
  {
    name: 'Jazz',
    description: 'Smooth improvisations and complex rhythms',
    trackCount: 445,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    color: 'from-yellow-500 to-orange-500'
  }
];

const featuredArtists = [
  {
    name: 'Synth Master',
    genre: 'Electronic',
    trackCount: 23,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    verified: true
  },
  {
    name: 'Bass Walker',
    genre: 'Hip Hop',
    trackCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
    verified: true
  },
  {
    name: 'Golden Hour',
    genre: 'Ambient',
    trackCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop',
    verified: false
  },
  {
    name: 'Voltage',
    genre: 'Electronic',
    trackCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    verified: true
  }
];

const featuredAlbums = [
  {
    id: '1',
    name: 'Neon Dreams',
    artist: 'Synth Master',
    year: 2024,
    trackCount: 12,
    genre: 'Electronic',
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Urban Stories',
    artist: 'Bass Walker',
    year: 2023,
    trackCount: 14,
    genre: 'Hip Hop',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Cosmic Waves',
    artist: 'Golden Hour',
    year: 2024,
    trackCount: 10,
    genre: 'Ambient',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop'
  }
];

export function DiscoveryPage({ onGenreSelect, onPlaylistsOpen, onLogout }: DiscoveryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Music className="w-8 h-8 text-primary" />
              <h1 className="text-2xl">Muzzy</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for music, artists, or genres..."
                className="pl-10 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onPlaylistsOpen}>
              <List className="w-4 h-4 mr-2" />
              My Playlists
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Welcome back to Muzzy</h2>
          <p className="text-muted-foreground">Discover new music, create playlists, and explore different genres.</p>
        </div>

        {/* Featured Albums */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl">Featured Albums</h3>
            <Button variant="outline" onClick={onGenreSelect}>
              View All Albums
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAlbums.map((album) => (
              <Card
                key={album.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors group overflow-hidden"
                onClick={onGenreSelect}
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    <ImageWithFallback
                      src={album.imageUrl}
                      alt={album.name}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-medium">{album.name}</h4>
                    <p className="text-muted-foreground">{album.artist}</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {album.genre}
                      </Badge>
                      <span>•</span>
                      <span>{album.year}</span>
                      <span>•</span>
                      <span>{album.trackCount} tracks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Browse by Genre */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl">Browse by Genre</h3>
            <Button variant="outline" onClick={onGenreSelect}>
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {genres.map((genre) => (
              <Card
                key={genre.name}
                className="cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
                onClick={onGenreSelect}
              >
                <div className="relative">
                  <ImageWithFallback
                    src={genre.imageUrl}
                    alt={genre.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-75`} />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end">
                    <h4 className="text-white text-xl mb-1">{genre.name}</h4>
                    <p className="text-white/80 text-sm">{genre.trackCount} tracks</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-sm">{genre.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Artists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl">Featured Artists</h3>
            <Button variant="outline" onClick={onGenreSelect}>
              View All Artists
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtists.map((artist) => (
              <Card
                key={artist.name}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={onGenreSelect}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative mb-4">
                    <ImageWithFallback
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    {artist.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="font-medium mb-1">{artist.name}</h4>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {artist.genre}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {artist.trackCount} tracks
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}