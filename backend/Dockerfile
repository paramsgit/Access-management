FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

COPY . .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]