CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tag VARCHAR(255) DEFAULT 'MINDSET',
    category VARCHAR(255) DEFAULT 'Thought Leadership',
    author VARCHAR(255) DEFAULT 'Ravishankar Pingali',
    author_role VARCHAR(255),
    read_time VARCHAR(255) DEFAULT '3 MIN READ',
    date VARCHAR(255),
    excerpt TEXT NOT NULL,
    description TEXT,
    content LONGTEXT NOT NULL,
    image VARCHAR(255),
    cover_image VARCHAR(255),
    tags JSON,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS podcasts (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    episode VARCHAR(255) DEFAULT 'Ep. 01',
    src VARCHAR(255) NOT NULL,
    audio_url VARCHAR(255),
    thumbnail VARCHAR(255),
    cover_image VARCHAR(255),
    duration VARCHAR(255) DEFAULT '15 mins',
    host VARCHAR(255) DEFAULT 'Ravishankar Pingali',
    guest VARCHAR(255) DEFAULT '',
    description TEXT NOT NULL,
    tags JSON,
    is_published BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    subtitle VARCHAR(255),
    category VARCHAR(255) DEFAULT 'Phase 1: Getting Started',
    real_problem TEXT,
    description TEXT,
    features JSON,
    success_looks_like TEXT,
    icon VARCHAR(255) DEFAULT 'Rocket',
    image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
