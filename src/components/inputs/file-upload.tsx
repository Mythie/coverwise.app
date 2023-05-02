import { useMemo } from 'react';

import prettyBytes from 'pretty-bytes';
import { DropzoneOptions, useDropzone } from 'react-dropzone';

import { cn } from '@/lib/utils';

const ONE_MB = 1000 * 1000;

export interface FileUploadProps extends DropzoneOptions {
  id?: string;
  className?: string;
}

export const FileUpload = ({
  id,
  className,
  accept,
  maxSize = ONE_MB,
  ...props
}: FileUploadProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    maxSize,
    ...props,
  });

  const acceptedFileExtensions = useMemo(() => {
    if (!accept) {
      return [];
    }

    return Object.values(accept).flat();
  }, [accept]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex min-h-[6rem] flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-4 transition-all duration-300 hover:border-orange-300',
        className,
      )}
    >
      <p className="text-center text-sm text-slate-500">
        Drag and drop your file here, or{' '}
        <span className="cursor-pointer text-orange-500 hover:underline">select a file</span>
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {acceptedFileExtensions.length > 0 && (
          <span className="uppercase">{acceptedFileExtensions.join(', ')}</span>
        )}{' '}
        up to {prettyBytes(maxSize)}
      </p>

      <input id={id} className="sr-only" {...getInputProps()} />
    </div>
  );
};
