const db = require("../db/connection");
const table = 'movies';
const reduceProperties = require("../utils/reduce-properties");
async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  // TODO: Add your code here
 
  return db(table).select('movies.*').where({movie_id: movie_id}).first();
  
}

const reduceCritics = reduceProperties("review_id", {
  critic_id: ["critic", "critic_id"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
});

async function readReviewsByMovie(movie_id){

  return db("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movie_id })
    .then(reduceCritics);
}

async function theatersFromMovie(movie_id){
    return db("movies_theaters as mt")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({ "mt.movie_id": movie_id, "mt.is_showing": true });
}

module.exports = {
  list,
  read,
  theatersFromMovie,
  readReviewsByMovie
};
