import Fastify from "fastify";
import cors from "@fastify/cors";

async function bootstrap() {
  const app = Fastify({
    logger: {
      transport: { target: "pino-pretty", options: { colorize: true } },
      level: "info",
    },
  });

  await app.register(cors, { origin: true });
  app.get("/ping", async () => ({ ok: true, ts: new Date().toISOString() }));

  const port = Number(process.env.PORT ?? 3001);
  const host = "0.0.0.0";
  try {
    const addr = await app.listen({ port, host });
    app.log.info(`API listening on ${addr}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
bootstrap();