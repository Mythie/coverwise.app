'use client';

import { useEffect, useMemo, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader, X } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { JOB_BOARDS, JOB_BOARD_KEYS, isJobBoardKey } from '@/data/job-boards';
import { TONES, TONE_FRIENDLY_NAMES } from '@/data/tones';
import { useToast } from '@/hooks/use-toast';
import { ZResumeSchema } from '@/lib/types';
import { useFetchJobQuery } from '@/pages/api/fetchJob/_query';

import { ResumeUpload } from '../inputs/resume-upload';
import { FormError } from './form-error';

const FORM_IDS = {
  jobBoard: 'job-board',
  jobUrl: 'job-url',
  jobDescription: 'job-description',
  tone: 'tone',
  resume: 'resume',
} as const;

export const ZGenerateCoverLetterFormValuesSchema = z
  .object({
    jobDescription: z.string().min(1),
    resume: ZResumeSchema,
    tone: z.number().min(0).max(3),
  })
  .and(
    z
      .object({
        jobBoard: z.enum(JOB_BOARD_KEYS),
        jobUrl: z.string().min(1),
      })
      .or(
        z.object({
          jobBoard: z.literal(JOB_BOARDS.OTHER.type),
          jobUrl: z.string().optional(),
        }),
      ),
  );

export type TGenerateCoverLetterFormValuesSchema = z.infer<
  typeof ZGenerateCoverLetterFormValuesSchema
>;

export type GenerateCoverLetterFormValues = TGenerateCoverLetterFormValuesSchema;

export interface GenerateCoverLetterFormProps {
  onSubmit?: (_values: GenerateCoverLetterFormValues) => void | Promise<void>;
}

export const GenerateCoverLetterForm = ({
  onSubmit: onFormSubmit,
}: GenerateCoverLetterFormProps) => {
  const [showJobDescription, setShowJobDescription] = useState(false);

  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValid, errors },
  } = useForm<TGenerateCoverLetterFormValuesSchema>({
    defaultValues: {
      jobBoard: undefined,
      jobUrl: undefined,
      jobDescription: undefined,
      tone: 0,
      resume: undefined,
    },
    resolver: zodResolver(ZGenerateCoverLetterFormValuesSchema),
  });

  const jobBoard = watch('jobBoard');
  const jobUrl = watch('jobUrl');
  const tone = watch('tone');

  const {
    data: fetchJobData,
    isLoading: isFetchJobLoading,
    isError: isFetchJobError,
  } = useFetchJobQuery({
    url: jobUrl ?? '',
    jobBoard: isJobBoardKey(jobBoard) ? jobBoard : 'OTHER',
  });

  const isBoardOther = useMemo(() => jobBoard === JOB_BOARDS.OTHER.type, [jobBoard]);

  const shouldShowJobUrl = useMemo(
    () => isBoardOther || showJobDescription || isFetchJobError,
    [isBoardOther, isFetchJobError, showJobDescription],
  );

  const onSubmit = (values: TGenerateCoverLetterFormValuesSchema) => {
    onFormSubmit?.(values);
  };

  useEffect(() => {
    if (jobBoard) {
      setValue('jobUrl', '');
    }
  }, [jobBoard, setValue]);

  useEffect(() => {
    if (fetchJobData) {
      setValue('jobDescription', fetchJobData.textContent);
    }
  });

  useEffect(() => {
    if (isFetchJobError) {
      toast({
        title: 'Error fetching job description',
        description:
          'An error occurred while attempting to fetch the job description, please enter it manually instead.',
        variant: 'destructive',
        duration: 5000,
      });

      setShowJobDescription(true);
    }
  }, [isFetchJobError, toast]);

  return (
    <form className="relative" onSubmit={handleSubmit(onSubmit)}>
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 z-[9999] -m-4 flex flex-col items-center justify-center bg-transparent backdrop-blur-[8px]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Loader className="h-10 w-10 animate-spin text-orange-500" />

            <p className="mt-6 text-orange-400">We're generating your cover letter hang tight!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col">
        <label htmlFor={FORM_IDS.jobBoard} className="text-sm font-medium text-slate-500">
          Job Board
        </label>

        <Controller
          control={control}
          name="jobBoard"
          render={({ field: { value, onChange } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger id={FORM_IDS.jobBoard} className="mt-2">
                <SelectValue
                  placeholder={<span className="text-slate-500">Select a Job Board</span>}
                />

                <SelectContent className="mt-2" position="popper" align="start">
                  {Object.values(JOB_BOARDS).map((board) => (
                    <SelectItem key={board.type} value={board.type} className="w-[280px]">
                      {board.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          )}
        />

        <FormError message={errors?.jobBoard?.message} />
      </div>

      <motion.div
        className="mt-4 flex flex-col"
        initial="visible"
        animate={isBoardOther ? 'invisible' : 'visible'}
        variants={{
          visible: { opacity: 1, height: 'auto', marginTop: '1rem' },
          invisible: { opacity: 0, height: 0, marginTop: 0 },
        }}
      >
        <label htmlFor={FORM_IDS.jobUrl} className="text-sm font-medium text-slate-500">
          Job URL
        </label>

        <div className="relative mt-2">
          <Input id={FORM_IDS.jobUrl} type="text" {...register('jobUrl')} disabled={!jobBoard} />

          <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-2">
            {isFetchJobLoading && <Loader className="h-5 w-5 animate-spin text-slate-500" />}
            {isFetchJobError && <X className="h-5 w-5 text-red-500" />}
            {fetchJobData && <Check className="h-5 w-5 text-green-500" />}
          </div>
        </div>

        {errors.jobUrl && <p className="mt-2 text-xs text-red-500">{errors.jobUrl.message}</p>}
      </motion.div>

      {!isBoardOther && !isFetchJobError && (
        <div className="mt-1">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="m-0 h-auto w-auto p-0 text-xs "
            onClick={() => setShowJobDescription((v) => !v)}
          >
            {showJobDescription ? 'Hide' : 'Show'} Job Description
          </Button>
        </div>
      )}

      <motion.div
        className="mt-4 flex flex-col"
        initial="invisible"
        animate={shouldShowJobUrl ? 'visible' : 'invisible'}
        variants={{
          visible: { opacity: 1, height: 'auto', marginTop: '1rem' },
          invisible: { opacity: 0, height: 0, marginTop: 0 },
        }}
      >
        <label htmlFor={FORM_IDS.jobDescription} className="text-sm font-medium text-slate-500">
          Job Description
        </label>

        <Textarea
          id={FORM_IDS.jobDescription}
          className="mt-2 max-h-[10rem] min-h-[10rem]"
          {...register('jobDescription')}
        />

        <FormError message={errors?.jobDescription?.message} />
      </motion.div>

      <div className="mt-4 flex flex-col">
        <label htmlFor={FORM_IDS.tone} className="text-sm font-medium text-slate-500">
          Tone
        </label>

        <div className="mt-2">
          <p
            className="inline-block w-1/4 rounded bg-orange-100 px-3 py-1 text-center text-sm text-orange-500"
            style={{
              marginLeft: `${tone * 25}%`,
            }}
          >
            {TONE_FRIENDLY_NAMES[TONES[tone]]}
          </p>
        </div>

        <Controller
          control={control}
          name={FORM_IDS.tone}
          render={({ field: { value, onChange } }) => (
            <Slider
              id="tone"
              className="mb-2 mt-4"
              value={[value]}
              max={3}
              onValueChange={([v]) => onChange(v)}
            />
          )}
        />

        <FormError message={errors?.tone?.message} />
      </div>

      <div className="mt-4 flex flex-col">
        <label htmlFor={FORM_IDS.resume} className="text-sm font-medium text-slate-500">
          Resume
        </label>

        <Controller
          control={control}
          name="resume"
          render={({ field: { value, onChange } }) => {
            return (
              <ResumeUpload
                id={FORM_IDS.resume}
                className="mt-2"
                value={value}
                onChange={onChange}
              />
            );
          }}
        />

        <FormError message={errors?.resume?.message} />
      </div>

      <div className="mt-6">
        <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
          Get my Cover Letter
        </Button>
      </div>
    </form>
  );
};
