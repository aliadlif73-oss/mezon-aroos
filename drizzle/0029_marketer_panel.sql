-- Isolated field-sales users and their scoped boutique assignments.
-- The sales role never inherits the owner role or access to customer leads/credits.
CREATE TABLE marketers(
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 username TEXT NOT NULL UNIQUE,
 password_salt TEXT NOT NULL,
 password_hash TEXT NOT NULL,
 active INTEGER NOT NULL DEFAULT 1,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE TABLE marketer_sessions(
 token_hash TEXT PRIMARY KEY,
 marketer_id TEXT NOT NULL REFERENCES marketers(id),
 expires_at INTEGER NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX marketer_sessions_actor ON marketer_sessions(marketer_id,expires_at);
CREATE TABLE marketer_salons(
 salon_id TEXT PRIMARY KEY REFERENCES salons(id),
 marketer_id TEXT NOT NULL REFERENCES marketers(id),
 stage TEXT NOT NULL DEFAULT 'new',
 contact_name TEXT NOT NULL DEFAULT '',
 contact_phone TEXT NOT NULL DEFAULT '',
 note TEXT NOT NULL DEFAULT '',
 next_followup_at INTEGER,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX marketer_salons_actor ON marketer_salons(marketer_id,updated_at);
