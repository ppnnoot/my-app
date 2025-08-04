# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Environment Variables for the application

ENV STRIPE_SECRET_KEY=sk_test_51RjdNmFQHy0umtP4Ab4SByRGugeIXNI4kwJP0KZ1CspTWMlEUWKuSNzr10Gig5F8s5Qc6M0H1sZq4XhddYz8ikJS00KqcBuOis
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RjdNmFQHy0umtP4AlXx2sc8uInGhWXgH6ij91Hvd5lYD61oKwmMGowY8kkYwuJT2coDwYVpaLVcqy0SSfpYnUaI00edDmornC
ENV STRIPE_WEBHOOK_SECRET=whsec_FMMOM00XortTAAEcdbWvaS7cFuONMU7O
ENV NEXT_PUBLIC_BASE_API=https://uapi.rg.in.th/uapi/rantcar/
ENV NEXT_PUBLIC_BASE_URL=http://vanko.rg.in.th
ENV RESEND_API_KEY=re_YNWxh6cj_LVG9RrkUmBjXCvtCb2NZxS5k

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"] 