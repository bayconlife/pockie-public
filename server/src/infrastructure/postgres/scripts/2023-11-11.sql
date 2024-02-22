CREATE TABLE IF NOT EXISTS market (
	id SERIAL PRIMARY KEY,
	account_id SERIAL REFERENCES accounts(id),
	server_id INT REFERENCES server(id),
	data JSONB,
	price BIGINT NOT NULL,
	expiration TIMESTAMP NOT NULL
);