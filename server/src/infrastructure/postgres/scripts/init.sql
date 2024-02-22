CREATE TABLE IF NOT EXISTS accounts (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
	password TEXT NOT NULL,
	permission INT DEFAULT 0,
	muted BOOLEAN DEFAULT FALSE,
	unique(username)
);

CREATE TABLE IF NOT EXISTS server (
	id INT PRIMARY KEY,
	name TEXT NOT NULL
);

INSERT INTO server(id, name) VALUES (1, 'Mainland');

CREATE TABLE IF NOT EXISTS characters (
	account_id SERIAL REFERENCES accounts(id),
	server_id INT REFERENCES server(id),
	data JSONB,
	reset BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (account_id, server_id)
);

CREATE TABLE IF NOT EXISTS locked_names (
	name TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS market (
	id SERIAL PRIMARY KEY,
	account_id SERIAL REFERENCES accounts(id),
	server_id INT REFERENCES server(id),
	data JSONB,
	price BIGINT NOT NULL,
	expiration TIMESTAMP NOT NULL
);