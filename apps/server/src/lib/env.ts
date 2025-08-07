import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .prefault("development"),
  SECRET: z.string(),
});

export type Envronment = z.infer<typeof EnvSchema>;

// biome-ignore lint/suspicious/noExplicitAny: Required for dynamic parsing
export const parseEnv = (data: any): Envronment => {
  const { data: env, error } = EnvSchema.safeParse(data);

  if (error) {
    throw new Error(z.prettifyError(error));
  }

  return env;
};
