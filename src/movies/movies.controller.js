const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
 
   const movie = await service.read(request.params.movieId);
  if (movie) {
    response.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}


 const readReviewsByMovie = async (req, res, next) => {
  const movie = res.locals.movie.movie_id;
   const result = await service.readReviewsByMovie(movie);
   console.log(result);
  res.json({ data: result });
};

 
async function getTheatersFromMovie(request, response){
    const movie = response.locals.movie.movie_id;
  response.json({ data: await service.theatersFromMovie(movie) })
}
async function read(request, response) {
  // TODO: Add your code here
  const { movie: data } = response.locals;
  response.json({ data });
}

async function list(request, response, next) {
  // TODO: Add your code here.
  
   service
    .list(true)
    .then((data) => response.json({ data }))
    .catch(next);
}



module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  getTheatersFromMovie: [asyncErrorBoundary(movieExists), getTheatersFromMovie],
  readReviewsByMovie: [asyncErrorBoundary(movieExists), readReviewsByMovie],
};
