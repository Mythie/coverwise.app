import { AnimatePresence, Variants as MotionVariants, motion } from 'framer-motion';
import { fromUint8Array } from 'js-base64';
import { FileText, Loader, X } from 'lucide-react';
import { useMutation } from 'react-query';

import { MUTABLE_ACCEPTED_FILE_TYPES } from '@/data/resume';
import { useToast } from '@/hooks/use-toast';
import { TResumeSchema } from '@/lib/types';
import { cn, sleep } from '@/lib/utils';
import { useFetchResumeTextMutation } from '@/pages/api/fetchResume/_mutation';

import { Button } from '../ui/button';
import { FileUpload } from './file-upload';

const FIVE_MB = 1000 * 1000 * 5;

export interface ResumeUploadProps {
  id?: string;
  className?: string;
  value: TResumeSchema | undefined;
  onChange: (_value: TResumeSchema | undefined) => void;
}

export const ResumeUpload = ({ id, className, value, onChange }: ResumeUploadProps) => {
  const { toast } = useToast();

  const { mutateAsync: fetchResumeText } = useFetchResumeTextMutation();

  const onDropRejected = () => {
    toast({
      title: 'Error',
      description:
        'There was an error uploading your resume, please check that it is a valid file type and is not too large.',
      duration: 5000,
    });
  };

  const { isLoading, mutate: onDropAccepted } = useMutation(async (file: File) => {
    const promise = sleep(3000);

    const fileName = file.name;
    let [fileExtension] = fileName.split('.').reverse();

    fileExtension = `.${fileExtension}`.toLowerCase();

    const binaryData = fromUint8Array(
      await file.arrayBuffer().then((buffer) => new Uint8Array(buffer)),
    );

    const result = await fetchResumeText({
      fileName,
      fileExtension,
      binaryData,
    }).catch(() => null);

    await promise;

    if (result) {
      onChange({
        id: Math.random().toString(36).slice(2, 7),
        fileName,
        textContent: result.textContent,
      });
    } else {
      onChange(undefined);

      onDropRejected();
    }
  });

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-[9999] flex flex-col items-center justify-center rounded-md bg-transparent backdrop-blur-[8px]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Loader className="h-6 w-6 animate-spin text-orange-500" />

            <p className="mt-2 text-sm text-orange-500">Retrieving your resume text, hang tight!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!value && (
        <div>
          <FileUpload
            id={id}
            accept={MUTABLE_ACCEPTED_FILE_TYPES}
            multiple={false}
            maxSize={FIVE_MB}
            onDropAccepted={([file]) => onDropAccepted(file)}
            onDropRejected={() => onDropRejected()}
          />
        </div>
      )}

      {value && (
        <div className="flex min-h-[6rem] items-center gap-x-4 rounded-md border border-orange-200 bg-orange-50 px-6 text-orange-700">
          <FileText className="h-8 w-8" />
          <div className="flex-1">
            <p>{value.fileName.toUpperCase()}</p>

            <p className="mt-0.5 text-xs text-orange-700/70">
              {value.textContent.length} character(s)
            </p>
          </div>

          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
