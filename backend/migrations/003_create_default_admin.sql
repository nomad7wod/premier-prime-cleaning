-- Create default admin user
-- Password: admin123
-- Email: adaperez@premierprime.org
-- This migration creates a default admin user for initial access

INSERT INTO users (email, password_hash, first_name, last_name, phone, role, created_at, updated_at) 
VALUES (
    'adaperez@premierprime.org',
    '$2a$10$TIpmjZY3eJ46ioo8j7qJA.p5TzrHEox8yekuGfTW/h9QlfKIvsnXC',
    'Ada',
    'Perez',
    '5551234567',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;
