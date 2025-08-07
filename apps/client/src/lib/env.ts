import type { ZodError } from "zod";
import { z } from "zod";

const EnvSchema = z.object({
  SECRET: z.string(),
  API_URL: z.url(),
});

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as ZodError;
  console.error(z.prettifyError(error));
  process.exit(1);
}

export default env;
