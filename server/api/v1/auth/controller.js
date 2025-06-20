const express = require('express');
const router = express.Router();
const { User } = require(`${__serverRoot}/models`);
const { comparePassword } = require('../utils/account');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    attributes: { include: ['password'] }
  });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // check for user.password
  if (!user.password)
    return res.status(500).json({ error: 'User has no password set' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  const isValid = await comparePassword(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

  
  res.json({
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role
  });
});

module.exports = router;
