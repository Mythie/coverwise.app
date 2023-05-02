import { AnimatePresence, motion } from 'framer-motion';

export interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          className="mt-2 text-xs text-red-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
};
