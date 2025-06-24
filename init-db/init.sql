-- Create database and user for auth-service
CREATE DATABASE ihms_auth;
CREATE USER auth_user WITH ENCRYPTED PASSWORD 'secret';
GRANT ALL PRIVILEGES ON DATABASE ihms_auth TO auth_user;

-- Create database and user for inventory-service
CREATE DATABASE ihms_inventory;
CREATE USER inventory_user WITH ENCRYPTED PASSWORD 'secret';
GRANT ALL PRIVILEGES ON DATABASE ihms_inventory TO inventory_user;
