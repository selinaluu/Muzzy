import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Music, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface SignUpFlowProps {
  onComplete: () => void;
}

type Step = 'welcome' | 'register' | 'preferences' | 'complete';

export function SignUpFlow({ onComplete }: SignUpFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    favoriteGenres: [] as string[],
  });

  const genres = ['Electronic', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'R&B', 'Country'];

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <Music className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl mb-4">Muzzy</h1>
        <p className="text-muted-foreground max-w-md">
          Discover music with precision. Track BPM, bookmark moments, create playlists, and customize your listening experience.
        </p>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <Button 
          onClick={() => setCurrentStep('register')} 
          className="w-full"
          size="lg"
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button variant="outline" className="w-full" size="lg">
          Sign In
        </Button>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>Join Muzzy to start exploring music</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                className="pl-10"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="pl-10"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={() => setCurrentStep('preferences')} 
            className="w-full"
            disabled={!formData.username || !formData.email || !formData.password}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPreferences = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Music Preferences</CardTitle>
          <CardDescription>Select your favorite genres to personalize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={formData.favoriteGenres.includes(genre) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleGenreToggle(genre)}
                className="justify-start"
              >
                {genre}
              </Button>
            ))}
          </div>
          
          <Button 
            onClick={() => setCurrentStep('complete')} 
            className="w-full"
            disabled={formData.favoriteGenres.length === 0}
          >
            Finish Setup
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplete = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
          <Music className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl mb-2">Welcome to Muzzy!</h2>
        <p className="text-muted-foreground">
          Your account is ready. Start exploring music with precision tools and create your first playlist.
        </p>
      </div>
      
      <Button onClick={onComplete} size="lg">
        Enter Muzzy
      </Button>
    </div>
  );

  switch (currentStep) {
    case 'welcome':
      return renderWelcome();
    case 'register':
      return renderRegister();
    case 'preferences':
      return renderPreferences();
    case 'complete':
      return renderComplete();
    default:
      return renderWelcome();
  }
}