-- Insert default cleaning services
-- This provides initial service offerings for Premier Prime Cleaning

INSERT INTO services (name, description, base_price, duration_hours, service_type, created_at, updated_at) VALUES
('Residential Cleaning', 'Standard cleaning service including dusting, vacuuming, mopping, bathroom cleaning, and kitchen cleaning. Perfect for regular maintenance of your home.', 120.00, 3.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Office and Commercial Cleaning', 'Professional commercial cleaning for offices including trash removal, surface cleaning, vacuuming, and restroom maintenance.', 150.00, 3.0, 'commercial', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Airbnb Turnaround Cleaning', 'Fast and thorough cleaning for vacation rentals including linen changes, restocking amenities, and guest-ready preparation.', 100.00, 2.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Custom Cleaning', 'Personalized cleaning service tailored to your specific needs and requirements. Contact us for a custom quote.', 150.00, 3.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Post Renovation Cleaning', 'Specialized cleaning after construction or renovation. Removes dust, debris, and prepares the space for use.', 350.00, 5.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Move in/Move out Deep Cleaning', 'Thorough deep cleaning for moving situations. Includes detailed cleaning of all rooms, cabinets, appliances, and ensuring the property is spotless.', 300.00, 5.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Deep Cleaning', 'Comprehensive deep cleaning service including all basic services plus detailed cleaning of appliances, baseboards, windows, and hard-to-reach areas.', 250.00, 4.0, 'residential', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
