const CACHED_RATINGS_KEY = 'cachedRatings'

function getUserDeltas(rankedUsers) {
  const cachedRatings = getCachedRatings()
  if (!cachedRatings) {
    return []
  }

  return cachedRatings
    .map((cachedRating) => {
      const leaderboardUser = rankedUsers.find((user) => user.id === cachedRating.userID)
      return leaderboardUser && (leaderboardUser.rating !== cachedRating.rating) ? { userID: cachedRating.userID, delta: leaderboardUser.rating - cachedRating.rating } : null
    })
    .filter(Boolean)
}

function update(rankedUsers) {
  const ratings = rankedUsers.map((user) => {
    return {
      userID: user.id,
      rating: user.rating
    }
  })
  window.localStorage.setItem(CACHED_RATINGS_KEY, JSON.stringify(ratings))
}

function getCachedRatings() {
  const ratingsStr = window.localStorage.getItem(CACHED_RATINGS_KEY)
  if (ratingsStr) {
    return JSON.parse(ratingsStr)
  }
}

const ratingsCache = {
  getUserDeltas,
  update
}

export default ratingsCache
