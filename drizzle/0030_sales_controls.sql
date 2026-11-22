-- Sales account onboarding credits are configured by the platform owner.
-- Bot links require a second, explicit approval even though the page activates instantly.
ALTER TABLE marketers ADD COLUMN initial_credits INTEGER NOT NULL DEFAULT 10;
ALTER TABLE marketer_salons ADD COLUMN bot_link_approved INTEGER NOT NULL DEFAULT 0;
CREATE INDEX marketer_salons_bot_approval ON marketer_salons(bot_link_approved,created_at);
