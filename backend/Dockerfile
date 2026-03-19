FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]