CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medications (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  no_pos BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  medication_id BIGINT NOT NULL REFERENCES medications(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  order_number VARCHAR(50),
  address VARCHAR(200),
  phone VARCHAR(30),
  contact_email VARCHAR(120)
);

CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON requests(created_at);
