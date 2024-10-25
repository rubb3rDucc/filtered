FROM postgres:16
COPY /src/database/createDBs.sql /docker-entrypoint-initdb.d/createDBs.sql