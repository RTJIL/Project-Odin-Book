export function isAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({ user: req.user })
  } else {
    res.status(401).json({ error: 'Not authenticated' })
  }
}
