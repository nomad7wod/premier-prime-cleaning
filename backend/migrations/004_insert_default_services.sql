-- Insert default cleaning services
-- This provides initial service offerings for Premier Prime Cleaning

INSERT INTO services (name, description, base_price, duration_hours, service_type, created_at, updated_at) VALUES
('Basic Residential Cleaning', 'Standard cleaning service including dusting, vacuuming, mopping, bathroom cleaning, and kitchen cleaning. Perfect for regular maintenance of your home.', 120.00, 2.5, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Deep Residential Cleaning', 'Comprehensive deep cleaning service including all basic services plus detailed cleaning of appliances, baseboards, windows, and hard-to-reach areas.', 250.00, 5.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Move In/Out Cleaning', 'Thorough cleaning for moving situations. Includes deep cleaning of all rooms, cabinets, appliances, and ensuring the property is spotless.', 300.00, 6.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Post-Construction Cleaning', 'Specialized cleaning after construction or renovation. Removes dust, debris, and prepares the space for use.', 350.00, 8.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Basic Office Cleaning', 'Standard commercial cleaning for offices including trash removal, surface cleaning, vacuuming, and restroom maintenance.', 150.00, 3.0, 'commercial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Deep Office Cleaning', 'Comprehensive commercial cleaning including carpet shampooing, window cleaning, and detailed sanitization of all areas.', 400.00, 6.0, 'commercial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Retail Space Cleaning', 'Specialized cleaning for retail environments including floor care, display cleaning, and customer area maintenance.', 200.00, 4.0, 'commercial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Restaurant Cleaning', 'Commercial kitchen and dining area cleaning meeting health code standards. Includes degreasing and sanitization.', 350.00, 5.0, 'commercial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
