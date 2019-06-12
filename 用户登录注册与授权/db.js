const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/express-auth', {
    useCreateIndex: true,
    useNewUrlParser: true
})

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true //用户名唯一
    },
    password: {
        type: String,
        set(val){
            return require('bcrypt').hashSync(val,10) //使用bcrypt加密，第二个参数是强度，太高影响效率，太低不安全
        }

    }
})

const User = mongoose.model('User', UserSchema)

module.exports = { User }