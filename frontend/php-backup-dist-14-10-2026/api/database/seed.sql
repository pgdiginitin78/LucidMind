-- Create an initial admin user. The password is "admin@1234" hashed with PHP password_hash (bcrypt).
-- Note: It is strongly recommended to change this password or recreate the admin user in production.
INSERT IGNORE INTO users (username, password) VALUES ('admin', '$2y$10$w81o9a41V4Hq/9m.T.T//umK2GqJ.K.mZf/17P/22rT4Pq.T5lP7i');
