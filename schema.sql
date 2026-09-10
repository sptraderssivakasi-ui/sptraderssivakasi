-- =====================================================================
-- SP TRADERS SIVAKASI - DATABASE SCHEMA & INITIAL SEED (Best Practices)
-- Supports PostgreSQL and MySQL (with minor dialect compatibility)
-- =====================================================================

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_desc VARCHAR(255),
    description TEXT,
    meta VARCHAR(100) NOT NULL DEFAULT '1 Box',
    mrp NUMERIC(10, 2) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 3. PRODUCT IMAGES (Optional multi-image gallery support)
CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_images FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 4. ENQUIRIES / LEADS TABLE (Tracks incoming customer enquiries & WhatsApp leads)
CREATE TABLE IF NOT EXISTS enquiries (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(150),
    customer_phone VARCHAR(30) NOT NULL,
    customer_city VARCHAR(100),
    total_estimated_amount NUMERIC(12, 2) DEFAULT 0.00,
    enquiry_channel VARCHAR(50) DEFAULT 'whatsapp', -- 'whatsapp', 'web_form', 'call'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'contacted', 'confirmed', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ENQUIRY ITEMS (Line items included in a bulk celebration order)
CREATE TABLE IF NOT EXISTS enquiry_items (
    id BIGSERIAL PRIMARY KEY,
    enquiry_id BIGINT NOT NULL,
    product_id VARCHAR(50),
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_enquiry_items_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE,
    CONSTRAINT fk_enquiry_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- 6. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON enquiries(customer_phone);
CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at);

-- =====================================================================
-- SEED DATA (SP Traders Sivakasi Catalog)
-- =====================================================================

INSERT INTO categories (id, name, slug, image_url, display_order) VALUES
('cat-1', 'Sparklers', 'sparklers', 'images/categories/sparklers.jpg', 1),
('cat-2', 'Ground Chakkars', 'ground', 'images/categories/ground.jpg', 2),
('cat-3', 'Flower Pots', 'flowerpots', 'images/categories/flowerpots.jpg', 3),
('cat-4', 'Aerial Shots', 'aerial', 'images/categories/aerial.jpg', 4),
('cat-5', 'Rockets', 'rockets', 'images/categories/rockets.jpg', 5),
('cat-6', 'Sound Crackers', 'sound', 'images/categories/sound.jpg', 6),
('cat-7', 'Kids Special', 'kids', 'images/categories/kids.jpg', 7),
('cat-8', 'Gift Boxes', 'giftbox', 'images/categories/giftbox.jpg', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, category_id, name, slug, short_desc, description, meta, mrp, price, is_featured) VALUES
('sp1', 'cat-1', '7cm Electric Sparklers (Box of 10)', '7cm-electric-sparklers', 'Classic electric sparklers safe for all ages.', 'Premium quality 7cm electric sparklers from Sivakasi. Each box contains 10 sparklers that burn bright with a clean, steady flame. Ideal for children under adult supervision. Made from high-quality raw materials ensuring safe and vibrant sparks.', 'Box · 10 pieces', 60.00, 42.00, TRUE),
('sp2', 'cat-1', '12cm Colour Sparklers (Box of 10)', '12cm-colour-sparklers', 'Multi-colour sparklers with vibrant effects.', 'Stunning 12cm colour sparklers that produce mesmerizing multi-coloured sparks. Perfect for Diwali celebrations, these sparklers create beautiful patterns in the air. Each box contains 10 pieces of premium Sivakasi-made sparklers.', 'Box · 10 pieces', 90.00, 63.00, FALSE),
('gc1', 'cat-2', 'Ground Chakkar – Deluxe', 'ground-chakkar-deluxe', 'Spinning ground display with multi-colour effects.', 'The Deluxe Ground Chakkar spins rapidly on the ground producing stunning multi-colour sparks in concentric circles. A classic Diwali favourite, this chakkar is made from premium materials for consistent performance. Place on flat ground, light the fuse, and enjoy the spinning display.', 'Pack of 5', 150.00, 105.00, TRUE),
('gc2', 'cat-2', 'Twin Colour Chakkar', 'twin-colour-chakkar', 'Dual-colour spinning ground chakkar.', 'Experience the magic of two colours spinning simultaneously with our Twin Colour Chakkar. This premium ground spinner alternates between golden and silver sparks creating a mesmerizing visual treat. Each pack contains 4 pieces.', 'Pack of 4', 180.00, 126.00, FALSE),
('fp1', 'cat-3', 'Flower Pot – Small', 'flower-pot-small', 'Compact fountain with golden sparks.', 'A compact yet powerful flower pot that shoots golden sparks upward like a fountain. Perfect for small celebrations and safe to use in open areas. The small flower pot produces a steady stream of beautiful golden sparks lasting about 30 seconds.', 'Pack of 5', 200.00, 140.00, FALSE),
('fp2', 'cat-3', 'Flower Pot – Deluxe Fountain', 'flower-pot-deluxe-fountain', 'Premium fountain with multi-stage effects.', 'Our Deluxe Fountain Flower Pot is a showstopper. It features multiple stages of colourful sparks — starting with silver, transitioning to gold, and finishing with a spectacular colour burst. Each pot lasts approximately 45 seconds.', 'Pack of 3', 350.00, 245.00, TRUE),
('ar1', 'cat-4', '30-Shot Colour Cake', '30-shot-colour-cake', '30 consecutive aerial colour shots.', 'Light up the sky with our 30-Shot Colour Cake! This spectacular aerial firework launches 30 consecutive shots of vibrant colours into the night sky. Each shot bursts into beautiful patterns at height. Perfect for creating a grand celebration atmosphere.', '1 piece', 900.00, 630.00, TRUE),
('ar2', 'cat-4', '60-Shot Sky Shot', '60-shot-sky-shot', 'Premium 60-shot aerial display.', 'The ultimate celebration centrepiece — our 60-Shot Sky Shot delivers a breathtaking aerial display with 60 consecutive colourful bursts. Features multiple colour combinations including red, green, blue, gold, and silver. Best used in open grounds with clear sky visibility.', '1 piece', 1800.00, 1260.00, FALSE),
('rk1', 'cat-5', 'Whistling Rocket', 'whistling-rocket', 'Classic whistling rockets with trail.', 'Traditional Sivakasi whistling rockets that soar high with a distinctive whistling sound before bursting into colourful sparks. Each rocket is fitted with a stabilizing stick for straight flight. Light the fuse from a secure bottle launcher.', 'Pack of 10', 250.00, 175.00, FALSE),
('rk2', 'cat-5', 'Colour Burst Rocket', 'colour-burst-rocket', 'Rockets with colourful sky burst.', 'These premium colour burst rockets fly high and explode into a spectacular display of multiple colours. Each rocket delivers a powerful burst visible from a great distance. Ideal for open ground celebrations.', 'Pack of 10', 320.00, 224.00, FALSE),
('sc1', 'cat-6', 'Bijili Crackers (2-sound)', 'bijili-crackers', 'Classic double-bang crackers.', 'The quintessential Diwali cracker — Bijili Crackers produce two sharp, satisfying bangs. Made from premium materials in Sivakasi, these crackers are reliable and consistent. Each bundle contains 10 individual crackers.', 'Bundle of 10', 80.00, 56.00, FALSE),
('sc2', 'cat-6', 'Chorsa Crackers', 'chorsa-crackers', 'Powerful single-bang crackers.', 'Chorsa Crackers are known for their powerful single bang. These classic crackers from Sivakasi are a Diwali tradition. Each bundle contains 5 premium-quality crackers made from carefully selected materials.', 'Bundle of 5', 150.00, 105.00, FALSE),
('ks1', 'cat-7', 'Kids Novelty Pack', 'kids-novelty-pack', 'Safe, low-noise fun for young ones.', 'A carefully curated assortment of low-noise, child-friendly fireworks. Includes mini sparklers, snake tablets, colour smoke, and ground flowers. All items are designed with child safety in mind — low noise and gentle effects.', 'Assorted, low-noise', 220.00, 154.00, TRUE),
('ks2', 'cat-7', 'Ground Spinner – Junior', 'ground-spinner-junior', 'Small spinning ground display for kids.', 'Miniature ground spinners designed specifically for children. These junior spinners produce gentle, colourful sparks with minimal noise. Perfect for young celebrants to enjoy under adult supervision.', 'Pack of 6', 120.00, 84.00, FALSE),
('gb1', 'cat-8', 'Family Gift Box – Silver', 'family-gift-box-silver', '42-item assorted family celebration pack.', 'The Silver Family Gift Box is the perfect all-in-one Diwali pack. Contains 42 assorted items including sparklers, flower pots, ground chakkars, and small aerial shots. Beautifully packaged and ready to gift. Ideal for a complete family celebration.', '42 items assorted', 2000.00, 1400.00, TRUE),
('gb2', 'cat-8', 'Family Gift Box – Gold', 'family-gift-box-gold', '65-item premium assorted celebration pack.', 'Our premium Gold Family Gift Box features 65 carefully selected items covering every category — from kid-safe sparklers to grand aerial shots. Premium packaging makes it perfect for gifting. The ultimate Diwali celebration in a single box.', '65 items assorted', 3500.00, 2450.00, TRUE)
ON CONFLICT (id) DO NOTHING;
