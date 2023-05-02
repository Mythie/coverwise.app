'use client';

import { useMemo, useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { WindupChildren } from 'windups';

import {
  GenerateCoverLetterForm,
  GenerateCoverLetterFormValues,
} from '@/components/forms/generate-cover-letter';
import { GenerateCoverLetterLoader } from '@/components/loading/generate-cover-letter-loader';
import { Button } from '@/components/ui/button';
import { TONES, Tone } from '@/data/tones';
import { useToast } from '@/hooks/use-toast';
import { useGenerateCoverLetterMutation } from '@/pages/api/generateCoverLetter/_mutation';
import { useSummariseJobDescriptionMutation } from '@/pages/api/summariseJobDescription/_mutation';
import { useSummariseResumeMutation } from '@/pages/api/summariseResume/_mutation';

export default function PageContainer() {
  const [tone, setTone] = useState<Tone>(TONES[0]);

  const { toast } = useToast();

  const {
    data: { summarisedResume } = {},
    mutateAsync: summariseResume,
    isLoading: isSummarisingResume,
    reset: resetSummarisedResume,
  } = useSummariseResumeMutation();

  const {
    data: { summarisedJobDescription } = {},
    mutateAsync: summariseJobDescription,
    isLoading: isSummarisingJobDescription,
    reset: resetSummarisedJobDescription,
  } = useSummariseJobDescriptionMutation();

  const {
    data: { coverLetter: generatedCoverLetter } = {},
    mutateAsync: generateCoverLetter,
    isLoading: isGeneratingCoverLetter,
    reset: resetGeneratedCoverLetter,
  } = useGenerateCoverLetterMutation();

  const onGenerateCoverLetterFormSubmit = async (values: GenerateCoverLetterFormValues) => {
    const { jobDescription, resume } = values;
    const tone = TONES[values.tone] ?? TONES[0];

    setTone(tone);

    const resumeResult = await summariseResume({
      resume: resume.textContent,
    })
      .then((r) => r.summarisedResume)
      .catch((err: Error) => {
        toast({
          title: 'Error',
          description: `There was an error summarising your resume. ${err.message}`,
          duration: 5000,
        });

        return null;
      });

    if (!resumeResult) {
      return;
    }

    const jobDescriptionResult = await summariseJobDescription({
      jobDescription,
    })
      .then((r) => r.summarisedJobDescription)
      .catch((err: Error) => {
        toast({
          title: 'Error',
          description: `There was an error summarising the job description. ${err.message}`,
          duration: 5000,
        });

        return null;
      });

    if (!jobDescriptionResult) {
      return;
    }

    const coverLetterResult = await generateCoverLetter({
      tone,
      summarisedResume: resumeResult,
      summarisedJobDescription: jobDescriptionResult,
    })
      .then((r) => r.coverLetter)
      .catch((err: Error) => {
        toast({
          title: 'Error',
          description: `There was an error generating the cover letter. ${err.message}`,
          duration: 5000,
        });

        return null;
      });

    if (!coverLetterResult) {
      return;
    }
  };

  const onStartAgainClicked = () => {
    resetSummarisedResume();
    resetSummarisedJobDescription();
    resetGeneratedCoverLetter();
  };

  const onRegenerateCoverLetterClicked = () => {
    if (!summarisedResume || !summarisedJobDescription) {
      return;
    }

    generateCoverLetter({
      summarisedResume,
      summarisedJobDescription,
      tone,
    });
  };

  const isLoading = useMemo(
    () => isSummarisingResume || isSummarisingJobDescription || isGeneratingCoverLetter,
    [isGeneratingCoverLetter, isSummarisingJobDescription, isSummarisingResume],
  );

  const shouldShowCoverLetterForm = useMemo(() => {
    return (
      !isSummarisingResume &&
      !summarisedResume &&
      !isSummarisingJobDescription &&
      !summarisedJobDescription &&
      !isGeneratingCoverLetter &&
      !generatedCoverLetter
    );
  }, [
    isSummarisingResume,
    summarisedResume,
    isSummarisingJobDescription,
    summarisedJobDescription,
    isGeneratingCoverLetter,
    generatedCoverLetter,
  ]);

  return (
    <AnimatePresence>
      {shouldShowCoverLetterForm && (
        <div className="w-full">
          <GenerateCoverLetterForm onSubmit={onGenerateCoverLetterFormSubmit} />
        </div>
      )}

      {isLoading && (
        <GenerateCoverLetterLoader
          isSummarisingResume={isSummarisingResume || !summarisedResume}
          isSummarisingJobDescription={isSummarisingJobDescription || !summarisedJobDescription}
          isGeneratingCoverLetter={isGeneratingCoverLetter || !generatedCoverLetter}
        />
      )}

      {generatedCoverLetter && (
        <div className="w-full">
          <h2 className="text-2xl font-bold">Your Cover Letter</h2>

          <div className="mt-4">
            <WindupChildren>
              {generatedCoverLetter.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </WindupChildren>
          </div>

          <div className="mt-4">
            <Button
              className="w-full"
              size="lg"
              disabled={isLoading}
              onClick={() => onStartAgainClicked()}
            >
              Start Again
            </Button>

            <Button
              className="mt-2 w-full"
              size="lg"
              variant="ghost"
              disabled={isLoading || !summarisedResume || !summarisedJobDescription}
              onClick={() => onRegenerateCoverLetterClicked()}
            >
              Regenerate Cover Letter
            </Button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
