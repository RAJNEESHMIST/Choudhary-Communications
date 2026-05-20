export function login(req, res) {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    return res.json({ success: true, username });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
}
