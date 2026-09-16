PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  home_airport_iata TEXT NOT NULL,
  nearby_airports_json TEXT NOT NULL DEFAULT '[]',
  currency TEXT NOT NULL DEFAULT 'USD',
  timezone TEXT NOT NULL,
  default_cabin TEXT NOT NULL DEFAULT 'economy',
  default_passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (default_passenger_count > 0),
  default_maximum_stops INTEGER NOT NULL DEFAULT 1 CHECK (default_maximum_stops BETWEEN 0 AND 2),
  default_stay_minimum_nights INTEGER NOT NULL DEFAULT 7,
  default_stay_maximum_nights INTEGER NOT NULL DEFAULT 14,
  daily_report_time TEXT NOT NULL DEFAULT '08:00',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trip_watches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  origins_json TEXT NOT NULL,
  destinations_json TEXT NOT NULL,
  travel_window_json TEXT NOT NULL,
  trip_types_json TEXT NOT NULL,
  stay_minimum_nights INTEGER NOT NULL DEFAULT 7,
  stay_maximum_nights INTEGER NOT NULL DEFAULT 14,
  cabin TEXT NOT NULL DEFAULT 'economy',
  passenger_count INTEGER NOT NULL DEFAULT 1 CHECK (passenger_count > 0),
  maximum_stops INTEGER NOT NULL DEFAULT 1 CHECK (maximum_stops BETWEEN 0 AND 2),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  next_refresh_at TEXT,
  booked_at TEXT,
  paid_amount REAL,
  post_booking_eligible INTEGER NOT NULL DEFAULT 0 CHECK (post_booking_eligible IN (0, 1))
);

CREATE TABLE IF NOT EXISTS normalized_search_keys (
  hash TEXT PRIMARY KEY,
  serialized_request TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS watch_search_keys (
  watch_id TEXT NOT NULL REFERENCES trip_watches(id) ON DELETE CASCADE,
  search_key_hash TEXT NOT NULL REFERENCES normalized_search_keys(hash) ON DELETE CASCADE,
  PRIMARY KEY (watch_id, search_key_hash)
);

CREATE TABLE IF NOT EXISTS price_observations (
  id TEXT PRIMARY KEY,
  search_key_hash TEXT NOT NULL REFERENCES normalized_search_keys(hash) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  currency TEXT NOT NULL,
  lowest_total REAL NOT NULL,
  lowest_nonstop_total REAL,
  representative_offer_json TEXT NOT NULL,
  offer_count INTEGER NOT NULL,
  source_freshness TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS provider_attempts (
  id TEXT PRIMARY KEY,
  search_key_hash TEXT NOT NULL,
  provider TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  failure_category TEXT,
  budget_units INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS trend_events (
  id TEXT PRIMARY KEY,
  watch_id TEXT NOT NULL REFERENCES trip_watches(id) ON DELETE CASCADE,
  observation_id TEXT NOT NULL REFERENCES price_observations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  observed_price REAL NOT NULL,
  baseline_price REAL,
  explanation TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  watch_id TEXT NOT NULL REFERENCES trip_watches(id) ON DELETE CASCADE,
  trend_event_id TEXT REFERENCES trend_events(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  deduplication_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  delivered_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_trip_watches_due
ON trip_watches(status, next_refresh_at)
WHERE status IN ('active', 'throttled', 'booked_monitoring');

CREATE INDEX IF NOT EXISTS idx_price_observations_history
ON price_observations(search_key_hash, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_provider_attempts_key_started
ON provider_attempts(search_key_hash, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_pending
ON notifications(status, created_at)
WHERE status = 'pending';

PRAGMA optimize;
