// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const db = require('../database/models/user')
// // const User = db.User

// const authenticateUser = async ({ email, password }) => {
//     const user = await User.findOne({ email })
//     if (user && bcrypt.compareSync(password, user.password)) {
//         const token = jwt.sign({ sub: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' })
//         return {
//             ...user.toJSON(),
//             token
//         }
//     }
// }

const verifyAdmin = async (req, res, next) => {
    if (req.user_tole === 'admin')
    {
        next()
    }
    else {
        return res.status(401).send('you are not authorize')
    }
}