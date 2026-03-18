FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install --ignore-scripts

RUN npx turbo run build --filter=webapp --only


FROM nginx:alpine

COPY --from=builder /app/webapp/dist /usr/share/nginx/html

EXPOSE 80