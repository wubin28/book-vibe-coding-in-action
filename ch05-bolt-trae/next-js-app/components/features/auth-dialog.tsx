'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

type AuthMode = 'signin' | 'signup' | 'settings';

export function AuthDialog() {
  const { language } = useLanguage();
  const t = translations[language];
  const { authDialogOpen, authDialogMode, closeAuthDialog, login, signup, updateProfile, user } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  useEffect(() => {
    if (authDialogOpen && authDialogMode === 'settings' && user) {
      setUsername(user.username);
    } else {
      resetForm();
    }
  }, [authDialogOpen, authDialogMode, user]);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authDialogMode === 'signin') {
      if (!username || !password) {
        toast.error(t.fillAllFields);
        return;
      }
      login(username, password);
    } 
    else if (authDialogMode === 'signup') {
      if (!username || !password || !confirmPassword) {
        toast.error(t.fillAllFields);
        return;
      }
      if (password !== confirmPassword) {
        toast.error(t.passwordsDoNotMatch);
        return;
      }
      signup(username, password);
    }
    else if (authDialogMode === 'settings') {
      if (newPassword || confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
          toast.error(t.passwordsDoNotMatch);
          return;
        }
        updateProfile(username, newPassword);
      } else {
        updateProfile(username);
      }
    }
  };

  const toggleAuthMode = () => {
    closeAuthDialog();
    setTimeout(() => {
      if (authDialogMode === 'signin') {
        useAuth.getState().openAuthDialog('signup');
      } else {
        useAuth.getState().openAuthDialog('signin');
      }
    }, 100);
  };

  const renderDialogContent = () => {
    switch (authDialogMode) {
      case 'signin':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.signIn}</DialogTitle>
              <DialogDescription>{t.signInDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t.username}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">{t.signIn}</Button>
              </DialogFooter>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t.dontHaveAccount} </span>
                <Button variant="link" className="p-0 h-auto" onClick={toggleAuthMode}>
                  {t.signUp}
                </Button>
              </div>
            </form>
          </>
        );
      
      case 'signup':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.signUp}</DialogTitle>
              <DialogDescription>{t.signUpDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t.username}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">{t.signUp}</Button>
              </DialogFooter>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t.alreadyHaveAccount} </span>
                <Button variant="link" className="p-0 h-auto" onClick={toggleAuthMode}>
                  {t.signIn}
                </Button>
              </div>
            </form>
          </>
        );
      
      case 'settings':
        return (
          <>
            <DialogHeader>
              <DialogTitle>{t.settings}</DialogTitle>
              <DialogDescription>{t.settingsDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">{t.username}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t.newPassword}</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.leaveBlankToKeep}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">{t.confirmNewPassword}</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder={t.leaveBlankToKeep}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">{t.saveChanges}</Button>
              </DialogFooter>
            </form>
          </>
        );
    }
  };

  return (
    <Dialog open={authDialogOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="sm:max-w-[400px]">
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}