import cors from '@fastify/cors'
import Fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { registerCustomerRoutes } from './routes/customers.js'

const prisma = new PrismaClient()
const isProd = process.env.NODE_ENV === 'production'

async function bootstrap() {
  const app = Fastify({
    logger: isProd
      ? { level: 'info' }
      : {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      },
  })

  await app.register(cors, { origin: true })

  app.get('/ping', async () => ({ ok: true, ts: new Date().toISOString() }))

  await registerCustomerRoutes(app)

  app.get('/db/health', async () => {
    const result = await prisma.$queryRaw<Array<{ value: number }>>`SELECT 1 as value`
    return { ok: true, result }
  })

  const port = Number(process.env.PORT ?? 3001)
  const host = '0.0.0.0'
  try {
    const addr = await app.listen({ port, host })
    app.log.info(`API listening on ${addr}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

bootstrap()