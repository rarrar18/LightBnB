-- Add values into users table
INSERT INTO users (name, email, password)
VALUES('Andy Lindsay', 'al@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Christian Nally', 'cn@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Bradley Fung', 'bf@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
('Gabriela Ciliberto', 'cb@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- Add values into properties table
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,
country, street, city, province, post_code, active)
VALUES(1, 'Beach House', 'description', 'https://thumb.com/beach_house.png', 'https://cover.com/beach_house.png',
140, 2, 3, 4, 'Philippines', 'Mango Street', 'Manila', 'Luzon', '1000', TRUE),
(2, 'Downtown Apartment', 'description', 'https://thumb.com/dt_apt.png', 'https://cover.com/dt_apt.png',
120, 1, 1, 1, 'Canada', 'Robson Street', 'Vancouver', 'BC', 'V5K OA3', FALSE),
(3, 'Suburban Home', 'description', 'https://thumb.com/sub_home.png', 'https://cover.com/sub_home.png',
90, 2, 2, 2, 'Canada', 'Pine Street', 'Coquitlam', 'BC', 'V3B OA7', FALSE);

-- Add values into reservations table
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2021-09-10', '2021-09-14', 2, 4), ('2021-12-20', '2021-12-25', 3, 1), ('2021-12-21', '2021-12-31', 1, 2);

-- Add values into property_reviews table
-- INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
INSERT INTO property_reviews
VALUES (DEFAULT, 4, 2, 1, 5, 'message'), (DEFAULT, 1, 3, 2, 8, 'message'), (DEFAULT, 2, 1, 3, 9, 'message');