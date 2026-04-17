-- Remove legacy tables from existing backend databases after extracting
-- category, product and order into separate services.
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
