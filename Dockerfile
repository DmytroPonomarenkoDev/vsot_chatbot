FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/

# Copy frontend files
COPY frontend/package*.json ./frontend/
COPY frontend/app ./frontend/app
COPY frontend/public ./frontend/public
COPY frontend/tsconfig.json ./frontend/
COPY frontend/next.config.js ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install
RUN npx prisma generate

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install --legacy-peer-deps
RUN npm run build

# Start both services
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

EXPOSE 3000 4000

CMD ["./start.sh"] 