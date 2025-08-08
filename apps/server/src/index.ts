import { Hono } from "hono";

import { type Envronment, parseEnv } from "@/lib/env";

const app = new Hono<{
  Bindings: Envronment;
}>();

app.use((c, next) => {
  c.env = parseEnv(Object.assign(c.env || {}, process.env));
  return next();
});

app.get("/", (c) => {
  return c.text(c.env.SECRET);
});

app.get("/wtf", (c) => {
  return c.text("WTF, dude!");
});

export default app;
