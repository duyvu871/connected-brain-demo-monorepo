FROM node:18

WORKDIR /app

COPY . .

WORKDIR /app/connected-brain-demo-monorepo/apps/web/
RUN npm install
WORKDIR /app/connected-brain-demo-monorepo/apps/server/
RUN npm install

RUN npm install -g pm2

EXPOSE 3000
EXPOSE 3001

CMD ["pm2-runtime", "start", "ecosystem.config.js"]