CREATE SCHEMA IF NOT EXISTS quotes_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA quotes_db;

SET search_path to quotes_db;

CREATE TABLE IF NOT EXISTS quotes_db.quote (
  id uuid PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  "from" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  "amount" DECIMAL NOT NULL,
  "rate" DECIMAL NOT NULL,
  "convertedAmount" DECIMAL NOT NULL,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes_db.auth_session (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  token TEXT NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL
);
