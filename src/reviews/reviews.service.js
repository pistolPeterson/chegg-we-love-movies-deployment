const db = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addNestedCriticObject = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});
const tableName = "reviews";

async function destroy(reviewId) {
  return db(tableName)
    .where({ review_id: reviewId })
    .del();
}

async function list(movie_id) {
  return db(tableName)
    .join(
      "movies_theaters",
      "movies_theaters.theater_id",
      "movie.movie_id"
    )
    .join("movies", "movies.movie_id", "movies_theaters.movie_id")
    .then(reduceMovies);
}

async function read(review_id) {
   return db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.review_id": review_id })
    .first()
    .then(addNestedCriticObject);
  
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(updatedReview) {
  return db("reviews as r")
    .select("r.*")
    .where({ "r.review_id": updatedReview.review_id })
    .update(updatedReview, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
