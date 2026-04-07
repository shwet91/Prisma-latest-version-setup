# ---- Base Layer -----
FROM node:alpine AS base
WORKDIR /app 

# ---- Dependencies Layer (cached) ----
FROM base AS deps 
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build Layer ----
FROM base AS builder
COPY --from=deps /app/node_modules  ./node_modules
COPY . .

ENV DATABASE_URL="postgresql://dummy"

RUN npx prisma generate
RUN npm run build

# ---- Production Layer ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]