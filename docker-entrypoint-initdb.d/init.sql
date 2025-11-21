CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- INSERT INTO users (username, password)
-- VALUES ('redacted', crypt('redacted', gen_salt('bf', 8)));
