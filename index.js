const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.nhw8ipw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersCollection = client.db('brandTec').collection('users')
        const productsCollection = client.db('brandTec').collection('products')
        const shippingsCollection = client.db('brandTec').collection('shippings')
        const cartsCollection = client.db('brandTec').collection('carts')



        // users post 
        app.post('/users', async (req, res) => {
            const userinfo = req.body
            const query = { email: userinfo?.email }
            const existingUser = await usersCollection.findOne(query)
            if (existingUser) {
                return
            }
            const result = await usersCollection.insertOne(userinfo)
            res.send(result)
        })

        // users get 
        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray()
            res.send(result)
        })

        // user get by email 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email 
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // user get by id 
        app.get('/users/user/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.findOne(query)
            res.send(result)
        })

        // update user data by id 
        app.patch('/users/user/:id', async (req, res) => {
            const id = req.params.id
            const currentUser = req.body
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: currentUser.name,
                    photo: currentUser.photo,
                    email: currentUser.email,
                    role: currentUser.role,
                    userCreateTime: currentUser.userCreateTime
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // post shippings Method 
        app.post('/shippings', async(req, res)=>{
            const data = req.body 
            const result = await shippingsCollection.insertOne(data)
            res.send(result)
        })

        // get shipping method 
        app.get('/shippings', async(req, res) =>{
            const result = await shippingsCollection.find().toArray()
            res.send(result)
        })

        // get shippings method by id 
        app.get('/shippings/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await shippingsCollection.findOne(query)
            res.send(result)
        })

        // delete shippings method by id 
        app.delete('/shippings/:id', async(req, res)=>{
            const id = req.params.id 
            const query = {_id: new ObjectId(id)}
            const result = await shippingsCollection.deleteOne(query)
            res.send(result)
        })

        // product post 
        app.post('/products', async (req, res) => {
            const data = req.body
            const result = await productsCollection.insertOne(data)
            res.send(result)
        })

        // all product get 
        app.get('/products', async (req, res)=>{
            const result = await productsCollection.find().toArray()
            res.send(result)
        })

        // all product get for search #rout: watch, mobile, laptop
        app.get('/products/pp', async (req, res) => {
            const filter = req.query 
            const query = {
                productName: {
                    $regex: filter.search,
                    $options: 'i'
                }
            }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        // all product get for pagination #rout: allProduct
        app.get('/products/product', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const result = await productsCollection.find().skip(page * size).limit(size).toArray()
            res.send(result)
        })

        //  product count 
        app.get('/productsCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount()
            res.send({ count })
        })

        //product get by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        //product get by brand
        app.get('/products/br/:brand', async (req, res) => {
            const brand = req.params.brand
            const query = { productBrand: brand }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })

        //stock product get 
        app.get('/products/st/stock', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = { productQuantity: { $gt: 0 } };
            const result = await productsCollection.find(query).skip(page * size).limit(size).toArray();
            res.send(result);
        })

        //stockOut product get 
        app.get('/products/st/stockOut', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = { productQuantity: { $lt: 1 } };
            const result = await productsCollection.find(query).skip(page * size).limit(size).toArray();
            res.send(result);
        });


        //product delete by id
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

        // product update by id 
        app.patch('/products/:id', async (req, res) => {
            const id = req.params.id
            const data = req.body
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    productName: data.productName,
                    productBrand: data.productBrand,
                    oldPrice: data.oldPrice,
                    newPrice: data.newPrice,
                    productQuantity: data.productQuantity,
                    productImage: data.productImage,
                    productDetails: data.productDetails,
                    productType: data.productType,
                    productAddDate: data.productAddDate
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })



        //  post cart 
        app.post('/carts', async (req, res) => {
            const data = req.body
            const result = await cartsCollection.insertOne(data)
            res.send(result)
        })

        // get carts 
        app.get('/carts', async (req, res) => {
            const result = await cartsCollection.find().toArray()
            res.send(result)
        })

        // get carts items by email 
        app.get('/carts/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await cartsCollection.find(query).toArray()
            res.send(result)
        })

        // get carts items by id 
        app.get('/carts/id/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.findOne(query)
            res.send(result)
        })

        // delete cart by id 
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Brand tac is running..........')
})
app.listen(port, () => {
    console.log(`Brand tac server is running on port : ${port}`)
})