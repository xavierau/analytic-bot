create EXTENSION IF NOT EXISTS vector;

-- Account Table
create TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    industry VARCHAR(255),
    size INT,
    country VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Campaign Table
create TABLE IF NOT EXISTS camapigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(255),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Case Table
create TABLE IF NOT EXISTS cases (
    id SERIAL PRIMARY KEY,
    account_id INT,
    Subject VARCHAR(255),
    description TEXT,
    status VARCHAR(50),
    resolution TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON delete SET NULL
);

-- Contact Table
create TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    account_id INT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(40),
    job_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON delete SET NULL
);

-- Event Table
create TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Groups Table
create TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_private BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Lead Table
create TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    interest_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Note Table
create TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Opportunity Table
create TABLE IF NOT EXISTS opportunities (
    id SERIAL PRIMARY KEY,
    account_id INT,
    naame VARCHAR(255),
    stage VARCHAR(255),
    close_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON delete SET NULL
);

-- Pricebook2 Table
create TABLE IF NOT EXISTS pricebook2 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    is_active BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Product2 Table
create TABLE IF NOT EXISTS product2 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);


create TABLE IF NOT EXISTS opportunity_product (
    opportunit_id INT,
    product_id INT,
    qty INT,
    amount DECIMAL(10, 2),
    PRIMARY KEY (opportunit_id, product_id),
    FOREIGN KEY (opportunit_id) REFERENCES opportunities(id) ON delete CASCADE,
    FOREIGN KEY (product_id) REFERENCES product2(id) ON delete CASCADE
);

-- Task Table
create TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    description TEXT,
    due_date TIMESTAMP,
    status VARCHAR(50),
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- User Table
create TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    password VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Role Table
create TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- RoleUser Table (Composite Primary Key)
create TABLE IF NOT EXISTS role_user (
    role_id INT,
    user_id INT,
    assign_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, user_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON delete CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON delete CASCADE
);

-- RoleUser Table (Composite Primary Key)
create TABLE IF NOT EXISTS group_user (
    group_id INT,
    user_id INT,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON delete CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON delete CASCADE
);

-- UserLoginLog Table
create TABLE IF NOT EXISTS user_login_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    ip VARCHAR(45),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON delete CASCADE
);


-- chat messages tables
create TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    identifiier VARCHAR(255),
    role VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- query examples table
create TABLE IF NOT EXISTS query_examples (
    id SERIAL PRIMARY KEY,
    query VARCHAR(255),
    sql TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    tokens INT NULL,
    embedding VECTOR(1536) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );