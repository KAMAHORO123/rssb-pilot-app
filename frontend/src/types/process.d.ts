// Minimal Node `process` typing for Next.js projects.
// This avoids needing `@types/node` just to use `process.env`.
declare const process: {
  env: Record<string, string | undefined>;
};
