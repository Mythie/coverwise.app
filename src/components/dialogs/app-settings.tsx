'use client';

import { useState } from 'react';

import { DialogTrigger } from '@radix-ui/react-dialog';
import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { AppSettingsForm } from '../forms/app-settings';

export interface AppSettingsDialogProps {
  // TODO: Add props
  foo?: string;
}

export const AppSettingsDialog = ({ foo }: AppSettingsDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          className="text-slate-500 duration-300 hover:text-orange-500 dark:text-slate-50"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>App Settings</DialogTitle>

        <AppSettingsForm />
      </DialogContent>
    </Dialog>
  );
};
