
const { User } = require('./db')
const express = require('express')
const SECRET = 'dkjfbkj32r2fd' //秘钥
const jwt = require('jsonwebtoken')

const app = express()

app.use(require('cors')())

app.use(express.json())//express接收处理json数据

app.get('/', async (req, res) => {
    const data = await User.find()
    res.send(data)
})

//注册
app.post('/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.send(user)
})

//登录验证
app.post('/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username
    })
    if (!user) {
        return res.status(422).send({
            message: '用户名不存在'
        })
    }
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordValid) {
        return res.status(422).send({
            message: '密码无效'
        })
    }

    //生成token
    const jwt = require('jsonwebtoken')
    const token = jwt.sign({
        id:String(user._id),
    },SECRET)

    res.send({
        user,
        token 
    })

})
const auth = async (req,res,next)=>{
    const raw = String(req.headers.authorization).split(' ').pop()
    const {id} = jwt.verify(raw,SECRET)//第一个是token，第二参数是生成token加密用的数值，给token解密
    req.user= await User.findById(id)
    next()
}

app.get('/profile',auth,async (req,res)=>{
    res.send(req.user)
})



app.listen(3033, () => {
    console.log("请访问localhost：3033");

})