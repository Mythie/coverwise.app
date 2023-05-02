declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL?: string;

    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    NEXT_PRIVATE_OPENAI_API_KEY: string;
    NEXT_PRIVATE_SUPABASE_SERVICE_KEY: string;
  }
}
