const script = `CREATE TABLE "user" (
  id SERIAL NOT NULL PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50),
  contact VARCHAR(15),
  accounts TEXT[],
  password TEXT,
  country TEXT,
  default_currency CHAR(3) NOT NULL DEFAULT 'USD',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE currency (
  code CHAR(3) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(5),
  exchange_rate DECIMAL(19, 6) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT 
  INTO 
    currency (code, name, symbol, exchange_rate)
  VALUES
    ('USD', 'United States Dollar', '$', 1.000000),
    ('CAD', 'Canadian Dollar', 'C$', 0.696223),
    ('INR', 'Indian Rupee', '₹', 0.011728)

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, description)
VALUES
    ('Food', 'Expenses related to food and dining'),
    ('Transportation', 'Expenses related to travel and transport'),
    ('Utilities', 'Monthly bills such as electricity, water, internet'),
    ('Entertainment', 'Expenses for leisure activities and entertainment'),
    ('Health', 'Medical expenses and health-related costs');

CREATE TABLE mode_of_payment (
    id SERIAL PRIMARY KEY,
    user_id INT,  -- Nullable for default modes
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);

INSERT INTO mode_of_payment (name, description)
VALUES
    ('Cash', 'Payment made using cash'),
    ('Credit Card', 'Payment made using a credit card'),
    ('Debit Card', 'Payment made using a debit card'),
    ('Bank Transfer', 'Payment made via bank transfer'),
    ('Mobile Payment', 'Payment made using mobile payment apps');
    
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    user_id INT,
    amount DECIMAL(19,4),
    currency CHAR(3),
    converted_amount DECIMAL(19,4),
    base_currency CHAR(3),
    category_id INT,
    mode_of_payment_id INT,
    transaction_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user"(id),
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (mode_of_payment_id) REFERENCES mode_of_payment(id)
);



`