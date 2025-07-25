-- Medical Logbook Database Setup Script
-- Run this script to create the database and user (optional)

-- Create database
CREATE DATABASE IF NOT EXISTS medlogbook;

-- Create a dedicated user (optional - you can use root)
-- UNCOMMENT the lines below if you want to create a dedicated user
-- CREATE USER IF NOT EXISTS 'medlogbook_user'@'localhost' IDENTIFIED BY 'medlogbook_password';
-- GRANT ALL PRIVILEGES ON medlogbook.* TO 'medlogbook_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Use the database
USE medlogbook;

-- The tables will be created by the Knex migrations
-- Run: npm run migrate

-- To populate with initial data, run: npm run seed

SELECT 'Database setup complete! Run npm run migrate and npm run seed to finish setup.' as message;