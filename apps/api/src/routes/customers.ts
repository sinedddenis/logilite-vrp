import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const customerSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
})

export async function registerCustomerRoutes(app: FastifyInstance) {
    app.post('/customers', async (req, reply) => {
        const parsed = customerSchema.safeParse(req.body)
        if (!parsed.success) {
            return reply.code(400).send({ ok: false, error: parsed.error.flatten() })
        }
        const { name, email } = parsed.data
        try {
            const created = await prisma.customer.create({ data: { name, email } })
            return reply.code(201).send({ ok: true, customer: created })
        } catch (err: any) {
            if (err.code === 'P2002') {
                return reply.code(409).send({ ok: false, error: 'Email already exists' })
            }
            app.log.error(err)
            return reply.code(500).send({ ok: false })
        }
    })
}