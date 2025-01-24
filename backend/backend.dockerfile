FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY src ./src
COPY tsconfig.json ./

EXPOSE 4000

CMD ["npm", "run", "dev"]
