function appleMusicApiURLWithTokens(url, token1, token2) {
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token1}`,
      'Music-User-Token': `${token2}`,
      'Accept': "application/json",
    }
  })
    .then(response => response.json())
    .catch(err => {
      console.error(err)
    })
}

module.exports = { appleMusicApiURLWithTokens };