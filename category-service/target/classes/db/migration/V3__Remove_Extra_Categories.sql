-- Keep only the core categories
DELETE FROM categories
WHERE name NOT IN ('Electronics', 'Clothing', 'Books');
