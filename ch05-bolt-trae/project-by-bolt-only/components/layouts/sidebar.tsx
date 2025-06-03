'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, User, Settings, LogOut, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { useAuth } from '@/hooks/use-auth';
import { useHistory } from '@/hooks/use-history';
import { HistoryItem } from '@/types';
import { formatHistoryDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Sidebar() {
  const { language } = useLanguage();
  const t = translations[language];
  const { user, isAuthenticated, logout, openAuthDialog } = useAuth();
  const { history, selectedHistory, setSelectedHistory, newOptimization, editHistoryTitle, deleteHistory } = useHistory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (item: HistoryItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleSaveEdit = (id: string) => {
    if (editTitle.trim()) {
      editHistoryTitle(id, editTitle);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteHistory(deleteId);
      setDeleteId(null);
    }
  };

  const groupedHistory = history.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const date = formatHistoryDate(item.timestamp, language);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <aside className="w-72 border-r h-full flex flex-col bg-background overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Promptyoo-1</h1>
      </div>
      <div className="p-4">
        <Button
          onClick={newOptimization}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {t.newOptimization}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">{t.history}</h2>
          {Object.keys(groupedHistory).length === 0 ? (
            <p className="text-sm text-muted-foreground p-2">{t.noHistoryYet}</p>
          ) : (
            Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="mb-4">
                <h3 className="text-xs font-medium text-muted-foreground mb-1 px-2">{date}</h3>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`relative group flex items-center rounded-md px-2 py-1.5 text-sm ${
                        selectedHistory?.id === item.id
                          ? 'bg-muted'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      {editingId === item.id ? (
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleSaveEdit(item.id)}
                          onKeyDown={(e) => handleKeyDown(e, item.id)}
                          className="h-6 py-1 px-2 text-xs"
                          autoFocus
                        />
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="truncate text-left w-full"
                                onClick={() => setSelectedHistory(item)}
                              >
                                {item.title.length > 16
                                  ? `${item.title.substring(0, 16)}...`
                                  : item.title}
                              </button>
                            </TooltipTrigger>
                            {item.title.length > 16 && (
                              <TooltipContent side="right" className="max-w-xs">
                                <p>{item.title.substring(0, 30)}{item.title.length > 30 ? '...' : ''}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {editingId !== item.id && (
                        <div className="absolute right-2 hidden group-hover:flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 p-0 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="p-4 border-t mt-auto">
        {!isAuthenticated ? (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openAuthDialog('signin')}
            >
              {t.signIn}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => openAuthDialog('signup')}
            >
              {t.signUp}
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="truncate">{t.myProfile}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openAuthDialog('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                {t.settings}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                {t.logOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteConfirmation}
              {': '}
              {deleteId && history.find(h => h.id === deleteId)?.title}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}