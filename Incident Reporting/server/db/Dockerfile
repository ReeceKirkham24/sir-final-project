FROM postgres
ENV POSTGRES_PASSWORD docker
ENV POSTGRES_DB sir-project-db
COPY setup.sql /docker-entrypoint-initdb.d/
