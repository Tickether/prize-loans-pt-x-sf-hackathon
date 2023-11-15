declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_ENABLE_TESTNETS: string;
            NEXT_PUBLIC_RAINBOW_PROJECT_ID: string;
        }
    }
}
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}