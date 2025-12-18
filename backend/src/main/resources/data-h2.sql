-- ========= ROLES =========
INSERT INTO roles (id, name) VALUES
                                 (1, 'ROLE_USER'),
                                 (2, 'ROLE_ADMIN');

-- ========= USERS =========
-- Пароли:
-- admin@example.com / password
-- user@example.com  / password

INSERT INTO users (id, email, password, first_name, last_name, is_active, created_at, updated_at)
VALUES
    (
        1,
        'admin@example.com',
        '$2a$10$Y7/RAbodvYe518ViiHEKoujvYoC4CnAaOLXQn7B9u5uJfBsNOsM16',
        'Admin',
        'User',
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        2,
        'user@example.com',
        '$2a$10$Abd/fxdjfr2fOKMEYzf5d.yy1Xl9zXvUqQg6ZsNnQy.8TPaodVNy.',
        'Regular',
        'User',
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- ========= USER_ROLES =========
-- Admin: ROLE_ADMIN + ROLE_USER
-- User:  ROLE_USER

INSERT INTO user_roles (user_id, role_id) VALUES
                                              (1, 2),  -- admin -> ROLE_ADMIN
                                              (1, 1),  -- admin -> ROLE_USER
                                              (2, 1);  -- user  -> ROLE_USER

-- ========= CATEGORIES =========
INSERT INTO categories (id, name, description) VALUES
                                                   (1, 'Electronics', 'Electronic devices and accessories'),
                                                   (2, 'Clothing', 'Apparel and fashion items'),
                                                   (3, 'Books', 'Books, e-books, and publications');

-- ========= PRODUCTS =========
INSERT INTO products (
    id,
    name,
    description,
    price,
    currency,
    stock_quantity,
    image_url,
    category_id,
    is_active,
    created_at,
    updated_at
) VALUES
      (
          1,
          'Smartphone X1',
          'Powerful smartphone for everyday use',
          799.90,
          'EUR',
          10,
          'https://example.com/images/smartphone-x1.jpg',
          1,
          TRUE,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
      ),
      (
          2,
          'Cotton T-Shirt',
          'Comfortable unisex cotton T-shirt',
          19.99,
          'EUR',
          50,
          'https://example.com/images/cotton-tshirt.jpg',
          2,
          TRUE,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
      ),
      (
          3,
          'Fantasy Novel',
          'Bestselling fantasy novel',
          14.50,
          'EUR',
          30,
          'https://example.com/images/fantasy-novel.jpg',
          3,
          TRUE,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
      );
