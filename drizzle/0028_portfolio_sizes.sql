-- Available physical sizes of each dress; JSON array of canonical sizes, independent of AI body settings.
ALTER TABLE portfolio ADD COLUMN sizes TEXT NOT NULL DEFAULT '[]';
