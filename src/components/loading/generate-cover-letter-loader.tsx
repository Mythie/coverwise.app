import { Check, Loader } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface GenerateCoverLetterLoaderProps {
  className?: string;
  isSummarisingResume: boolean;
  isSummarisingJobDescription: boolean;
  isGeneratingCoverLetter: boolean;
}

export const GenerateCoverLetterLoader = ({
  className,
  isSummarisingResume,
  isSummarisingJobDescription,
  isGeneratingCoverLetter,
}: GenerateCoverLetterLoaderProps) => {
  return (
    <div className={className}>
      <h2 className="text-center text-xl font-semibold">We're working on it!</h2>

      <p className="mx-auto mt-2 max-w-[50ch] text-center text-sm text-slate-500">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum labore impedit ad
        necessitatibus, tempora dolore fugiat?
      </p>

      <div className="mb-4 mt-8 flex justify-center">
        <ol className="relative mx-8 inline-block border-l-2 border-orange-200">
          <li className="mb-10 ml-10 last:mb-0">
            <span
              className={cn(
                'absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white duration-200 dark:bg-green-900 dark:ring-gray-900',
                {
                  'bg-orange-200 text-orange-500': isSummarisingResume,
                  'bg-orange-500 text-white': !isSummarisingResume,
                },
              )}
            >
              {isSummarisingResume ? (
                <Loader className="h-5 w-5 animate-spin " />
              ) : (
                <Check className="h-5 w-5 " strokeWidth={3} />
              )}
            </span>

            <h3 className="font-medium leading-tight">
              {isSummarisingResume ? 'Summarising resume...' : 'Resume summarised'}
            </h3>

            <p className="text-sm">
              {isSummarisingResume
                ? 'Summarising your resume to extract the most important information.'
                : 'Your resume has been summarised.'}
            </p>
          </li>

          <li className="mb-10 ml-10 last:mb-0">
            <span
              className={cn(
                'absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white duration-200 dark:bg-green-900 dark:ring-gray-900',
                {
                  'bg-orange-200 text-orange-500': isSummarisingJobDescription,
                  'bg-orange-500 text-white': !isSummarisingJobDescription,
                },
              )}
            >
              {isSummarisingJobDescription ? (
                <Loader className="h-5 w-5 animate-spin " />
              ) : (
                <Check className="h-5 w-5 " strokeWidth={3} />
              )}
            </span>

            <h3 className="font-medium leading-tight">
              {isSummarisingJobDescription
                ? 'Summarising job description...'
                : 'Job description summarised'}
            </h3>

            <p className="text-sm">
              {isSummarisingJobDescription
                ? 'Summarising the job description to extract the most important information.'
                : 'The job description has been summarised.'}
            </p>
          </li>

          <li className="mb-10 ml-10 last:mb-0">
            <span
              className={cn(
                'absolute -left-5 flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-white duration-200 dark:bg-green-900 dark:ring-gray-900',
                {
                  'bg-orange-200 text-orange-500': isGeneratingCoverLetter,
                  'bg-orange-500 text-white': !isGeneratingCoverLetter,
                },
              )}
            >
              {isGeneratingCoverLetter ? (
                <Loader className="h-5 w-5 animate-spin " />
              ) : (
                <Check className="h-5 w-5 " strokeWidth={3} />
              )}
            </span>

            <h3 className="font-medium leading-tight">
              {isGeneratingCoverLetter ? 'Generating cover letter...' : 'Cover letter generated'}
            </h3>

            <p className="text-sm">
              {isGeneratingCoverLetter
                ? 'Generating your cover letter based on the information you provided.'
                : 'Your cover letter has been generated.'}
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};
