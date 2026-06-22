FROM nginx:alpine
LABEL maintainer=""

# Limpiar contenido por defecto y copiar sitio estático
RUN rm -rf /usr/share/nginx/html/*
COPY . /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
