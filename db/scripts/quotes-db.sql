CREATE SCHEMA IF NOT EXISTS quotes_db;

SET search_path to quotes_db;

CREATE TABLE IF NOT EXISTS quotes_db.quote (
  id uuid PRIMARY KEY,
  "from" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  "amount" DECIMAL NOT NULL,
  "rate" DECIMAL NOT NULL,
  "convertedAmount" DECIMAL NOT NULL,
  "timestamp" TIMESTAMP NOT NULL,
  "expiresAt" Date NOT NULL
);
