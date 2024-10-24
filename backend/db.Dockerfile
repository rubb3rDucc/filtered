FROM postgres:16
COPY /database/createDBs.sql /docker-entrypoint-initdb.d/createDBs.sql