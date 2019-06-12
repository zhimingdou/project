const express = require('express')

const app = express()
app.use(express.json())//开启express处理客户端发来的json数据
const mongoose = require('mongoose')//连接MongoDB数据库的模块

mongoose.connect('mongodb://127.0.0.1:27017/express-test', { useNewUrlParser: true })
const Product = mongoose.model('Product', new mongoose.Schema({
    title: String,
}))
// 向数据库添加数据，然后注释掉，不然会重复添加 
// Product.insertMany([
//     {title:'chanpin1'},
//     {title:'chanpin2'},
//     {title:'chanpin3'}
// ])



app.use(require('cors')())//引入并且使用cors，一句代码解决跨域

app.use(express.static('public'))
//设置路由，如果文件夹不在当前路径，可以设置第一个参数加上路径前缀
// 例如app.use('/static',express.static('public')) 路径就是localhost:3000/static/public/index.html

app.get('/', async function (req, res) {
    res.send(await Product.find())
})
//get请求根路径时向客户端返回数据，列表页借口，查询多条数据
app.get('/products', async function (req, res) {
    const data = await Product.find()
    // const data = await Product.find().limit(2) 
    //limit 取几条数据 skip 跳过几条参数结合可以做分页，
    // 比如这次limit显示20条评论，下一页跳过20条评论再limit显示20条评论

    // const data = await Product.find().limit(2).sort({_id:1})
    // 排序，1是正序，-1是倒序

    // // 条件查询
    // const data = await Product.find().where({
    //     title:'chanpin1'
    // })
    res.send(data)
})

// 详情页接口，查一条数据详细信息
app.get('/products/:id', async function (req, res) {
    const data = await Product.findById(req.params.id)
    res.send(data)
})


//写入数据
app.post('/products', async function (req, res) {
    const data = req.body
    const product = await Product.create(data)//往mongodb插入数据并且返回插入数据的结果

    res.send(product)
})

//修改数据
app.put('/products/:id', async function (req, res) {
    const product = await Product.findById(req.params.id)
    //获取请求过来的ID并且在数据库中找到对应ID

    product.title = req.body.title
    //修改数据，这里改的是title

    await product.save()
    // 新数据保存到数据库

    res.send(product)
})

// 删除数据
app.delete('/products/:id',async function (req,res){
    const product = await Product.findById(req.params.id)
    await product.remove()
    res.send({
        success:'ture'
    })
})

app.listen(3000, () => {
    console.log(' localhost:3000');//监听端口

})