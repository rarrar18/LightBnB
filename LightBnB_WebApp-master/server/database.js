const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('../node_modules/pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

pool.connect()
  .then(() => {
    console.log("Successful connection!");
  })
  .catch(e => {
    console.log('Connection error: ', e.message);
  })
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email LIKE $1`, [email])
    // return user's name if email matches
    .then((res) => res.rows[0])
    .catch((err) => console.log("query error: ", err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    // return user's name if id matches
    .then((res) => res.rows[0])
    .catch((err) => console.log("query error: ", err.message));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const values = [user.name, user.email, user.password];
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  return pool
    .query(queryString, values)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => console.error("query error: ", err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  HAVING end_date < now()::date
  ORDER BY reservations.start_date
  LIMIT $2;
  `;
  return pool
    .query(queryString, values)
    .then((res) => res.rows)
    .catch((err) => err.message);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
*/
    
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  // check for cities that match
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length}`;
  }
  // check if owner ID is added
  if (options.owner_id) {
    // use array length to append query clauses to query string
    queryParams.push(options.owner_id);
    if (queryParams.length === 1) {
      queryString += `WHERE owner_id = $${queryParams.length}`;
    } else {
      queryString += `AND owner_id = $${queryParams.length}`;
    }
  }
  // check if properties fall within price range (integer = price as cents)
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryParams.push(options.maximum_price_per_night * 100);
    //check to see if its the only parms sent
    if (queryParams.length === 2) {
      queryString += `WHERE cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += `AND cost_per_night >= $${
        queryParams.length - 1
      } AND cost_per_night <= $${queryParams.length}`;
    }
  }
  // check for ratings equal to or higher than minimum rating
  if (options.minimum_rating) {
    if (queryParams.length === 0) {
      queryString += 'WHERE';
    }
    if (queryParams.length > 0) {
      queryString += 'AND';
    }
    queryParams.push(`${options.minimum_rating}`);
    queryString += ` property_reviews.rating >= $${queryParams.length}`;
  }
  // append more filtering clauses to query string
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  // return final query string with passed in params as a promise
  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
 const addProperty = function (property) {
  // when creating a new listing, the form translates these values into the database
  const values = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code,
  ];
  // this adds a new row of a single property with matching input values
  const queryString = `
  INSERT INTO properties(owner_id, title, description, thumbnail_photo_url,
  cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms,
  number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  return pool
    .query(queryString, values)
    .then((res) => {
      console.log('property: ', res.rows[0]);
      return res.rows[0];
    })
    .catch((err) => console.error("query error", err.stack));
};
exports.addProperty = addProperty;
