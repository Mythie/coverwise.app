import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { sleep } from '@/lib/utils';

import { Button } from '../ui/button';
import { FormError } from './form-error';

const FORM_IDS = {
  licenseKey: 'license-key',
  openAiKey: 'open-ai-key',
} as const;

export const ZAppSettingsFormValuesSchema = z
  .object({
    licenseKey: z.string().min(1),
    openAiKey: z.string().min(1),
  })
  .or(
    z.object({
      licenseKey: z.string().min(1),
    }),
  );

export type TAppSettingsFormValues = z.infer<typeof ZAppSettingsFormValuesSchema>;

export type AppSettingsFormValues = TAppSettingsFormValues;

export interface AppSettingsFormProps {
  onSubmit?: (_values: AppSettingsFormValues) => void;
}

export const AppSettingsForm = ({ onSubmit: onFormSubmit }: AppSettingsFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TAppSettingsFormValues>({
    defaultValues: {
      licenseKey: '',
      openAiKey: undefined,
    },
    resolver: zodResolver(ZAppSettingsFormValuesSchema),
  });

  const onSubmit = async (values: TAppSettingsFormValues) => {
    await sleep(10_000);
    await onFormSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col">
        <label htmlFor={FORM_IDS.licenseKey} className="text-sm font-medium text-slate-500">
          License Key
        </label>

        <Input id={FORM_IDS.licenseKey} className="mt-2" {...register('licenseKey')} />

        <FormError message={errors?.licenseKey?.message} />
      </div>

      <div className="mt-4 flex flex-col">
        <label htmlFor={FORM_IDS.openAiKey} className="text-sm font-medium text-slate-500">
          Open AI Key
        </label>

        <Input id={FORM_IDS.openAiKey} className="mt-2" {...register('openAiKey')} />

        {'openAiKey' in errors && <FormError message={errors?.openAiKey?.message} />}
      </div>

      <div className="mt-6 flex flex-row-reverse">
        <Button className="">
          {isSubmitting && <Loader className="mr-2 h-5 w-5 animate-spin" />}
          {isSubmitting ? 'Saving Settings...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};
