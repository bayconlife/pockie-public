Built on Node version v14.16.0

# .env

There is a .env-mock file that needs to be filled out with your information and renamed .env

# Postgres

Create a database with whatever name you desire. Make sure that the PG_DATABASE name in your .env file matches the database you created.

Run the code in src/infrastructure/postgres/scripts/init.sql to create the proper tables and base server.

# Redis

Currently you need redis enterprise to use the redis json storage features. You can get a free version on https://app.redislabs.com/
just update your .env file to match the port, host and password to your redis version.