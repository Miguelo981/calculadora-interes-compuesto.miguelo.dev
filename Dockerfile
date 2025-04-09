FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install -g pnpm
RUN pnpm i
RUN pnpm build

FROM nginx:latest

COPY --from=build /usr/local/app/dist/calculadora-interes-compuesto/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]