const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const SSLCommerzPayment = require('sslcommerz-lts')
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

// SSLCommerz secret 
const store_id = process.env.store_id
const store_passwd = process.env.store_passwd
const is_live = false //true for live, false for sandbox

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const usersCollection = client.db('brandTec').collection('users')
        const productsCollection = client.db('brandTec').collection('products')
        const shippingsCollection = client.db('brandTec').collection('shippings')
        const cartsCollection = client.db('brandTec').collection('carts')
        const ordersCollection = client.db('brandTec').collection('orders')
        const completeOrdersCollection = client.db('brandTec').collection('completeOrders')
        const reviewsCollection = client.db('brandTec').collection('reviews')
        const productReviewsCollection = client.db('brandTec').collection('productReviews')





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
                    userCreateTime: currentUser.userCreateTime,
                    phone: currentUser.phone,
                    userLocation: currentUser.userLocation
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // post review 
        app.post('/reviews', async (req, res) => {
            const data = req.body
            const result = await reviewsCollection.insertOne(data)
            res.send(result)
        })

        // get reviews 
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray()
            res.send(result)
        })

        // get review by id  
        app.get('/reviews', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await reviewsCollection.findOne(query)
            res.send(result)
        })

        // delete review by id 
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query)
            res.send(result)
        })

        // post product review 
        app.post('/productReviews', async (req, res) => {
            const data = req.body
            const result = await productReviewsCollection.insertOne(data)
            res.send(result)
        })

        // get product review 
        app.get('/productReviews', async (req, res) => {
            const result = await productReviewsCollection.find().toArray()
            res.send(result)
        })

        // get product reviews by prodId 
        app.get('/productReviews/:prodId', async (req, res) => {
            const prodId = req.params.prodId
            const query = { prodId: prodId }
            const result = await productReviewsCollection.find(query).toArray()
            res.send(result)
        })

        // delete product review 
        app.delete('/productReviews/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productReviewsCollection.deleteOne(query)
            res.send(result)
        })

        // post shippings Method 
        app.post('/shippings', async (req, res) => {
            const data = req.body
            const result = await shippingsCollection.insertOne(data)
            res.send(result)
        })

        // get shipping method 
        app.get('/shippings', async (req, res) => {
            const result = await shippingsCollection.find().toArray()
            res.send(result)
        })

        // get shippings method by id 
        app.get('/shippings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await shippingsCollection.findOne(query)
            res.send(result)
        })

        // delete shippings method by id 
        app.delete('/shippings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
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
        app.get('/products', async (req, res) => {
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

        // all products get for pagination and search 
        app.get('/products/all', async (req, res) => {
            const filter = req.query
            const query = {
                productName: {
                    $regex: filter.search,
                    $options: 'i'
                }
            }
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const result = await productsCollection.find(query).skip(page * size).limit(size).toArray()
            res.send(result)
        })

        //  product count 
        app.get('/productsCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount()
            res.send({ count })
        })

        // get all collection count 
        app.get('/allCount', async (req, res)=>{
            const userCount = await usersCollection.estimatedDocumentCount()
            const productCount = await productsCollection.estimatedDocumentCount()
            const orderCount = await ordersCollection.estimatedDocumentCount()
            const completeOrderCount = await completeOrdersCollection.estimatedDocumentCount()
            const appReviewCount = await reviewsCollection.estimatedDocumentCount()
            const productReviewCount = await productReviewsCollection.estimatedDocumentCount()
            res.send({userCount, productCount, orderCount, completeOrderCount, appReviewCount, productReviewCount})
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

        // order post 
        app.post('/orders', async (req, res) => {
            const body = req.body
            const products = await cartsCollection.find({ email: body?.email }).toArray()
            const price = products.map(product => product?.newPrice)
            const totalPrice = price?.reduce((sum, price) => sum + price, 0)
            const amount = parseInt(totalPrice + body?.shippingMethod)
            const tranId = new ObjectId().toString()

            const data = {
                total_amount: amount,
                currency: body?.currency,
                tran_id: tranId,
                success_url: `http://localhost:5000/payment/success/${tranId}`,
                fail_url: `http://localhost:5000/payment/fail/${tranId}`,
                cancel_url: 'http://localhost:3030/cancel',
                ipn_url: 'http://localhost:3030/ipn',
                shipping_method: 'Courier',
                product_name: 'Computer.',
                product_category: 'Electronic',
                product_profile: 'general',
                cus_name: body.name,
                cus_email: body.email,
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: body.phone,
                // cus_fax: '01711111111',
                ship_name: body.name,
                ship_add1: body.shippingArea,
                // ship_add2: 'Dhaka',
                ship_city: body.shippingArea,
                // ship_state: 'Dhaka',
                cus_add1: body.address,
                // cus_add2: 'Dhaka',
                // cus_city: 'Dhaka',
                // cus_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
            };

            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
            sslcz.init(data).then(apiResponse => {
                // Redirect the user to payment gateway
                let GatewayPageURL = apiResponse?.GatewayPageURL
                res.send({ url: GatewayPageURL })

                // order send database
                const orderData = {
                    data: body,
                    paidStatus: false,
                    status: 'pending',
                    transactionId: tranId
                }
                const result = ordersCollection.insertOne(orderData)

                // console.log('Redirecting to: ', GatewayPageURL)
            });

            // paid status update when payment success
            app.post('/payment/success/:tranId', async (req, res) => {
                const tranId = req.params.tranId

                const result = await ordersCollection.updateOne({ transactionId: tranId }, {
                    $set: {
                        paidStatus: true
                    }
                })
                if (result.modifiedCount > 0) {
                    const order = await ordersCollection.findOne({ transactionId: tranId });
                    if (order && order?.data?.productsIds) {
                        // Delete items from the cart collection
                        const query = {
                            _id: {
                                $in: order?.data?.productsIds.map(id => new ObjectId(id))
                            }
                        };
                        await cartsCollection.deleteMany(query);
                    }
                    res.redirect(`http://localhost:5173/payment/success/${tranId}`)
                }
            })

            // order delete when payment faile 
            app.post('/payment/fail/:tranId', async (req, res) => {
                const tranId = req.params.tranId
                const result = await ordersCollection.deleteOne({ transactionId: tranId })
                if (result.deletedCount) {
                    res.redirect(`http://localhost:5173/payment/fail/${tranId}`)
                }
            })


        })

        // get all orders 
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find().toArray()
            res.send(result)
        })

        // get orders by transactionId 
        app.get('/orders/or/:tranId', async (req, res) => {
            const tranId = req.params.tranId
            const result = await ordersCollection.find({ transactionId: tranId }).toArray()
            res.send(result)
        })

        // order get by id 
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await ordersCollection.findOne(query)
            res.send(result)
        })

        // update order status by id 
        // app.patch('/orders/:id', async (req, res) => {
        //     const id = req.params.id
        //     const data = req.body
        //     const filter = { _id: new ObjectId(id) }
        //     const updateDoc = {
        //         $set: {
        //             status: data.status
        //         }
        //     }
        //     const result = await ordersCollection.updateOne(filter, updateDoc)
        //     res.send(result)
        // })

        // app.patch('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const data = req.body;
        //     const filter = { _id: new ObjectId(id) };
        //     const updateDoc = {
        //         $set: {
        //             status: data.status
        //         }
        //     };

        //     // Update the order status
        //     const updateResult = await ordersCollection.updateOne(filter, updateDoc);

        //     // If the status is "Completed," set a timer to move it to completeOrders
        //     if (data.status === 'Completed' && updateResult.modifiedCount > 0) {
        //         // Delay 1 minute (60,000 milliseconds)
        //         setTimeout(async () => {
        //             try {
        //                 // Find the order data
        //                 const order = await ordersCollection.findOne(filter);

        //                 // Post to completeOrders collection
        //                 const completeOrderResult = await completeOrdersCollection.insertOne(order);

        //                 // If successfully moved, delete from the orders collection
        //                 if (completeOrderResult.insertedId) {
        //                     await ordersCollection.deleteOne(filter);
        //                 }
        //             } catch (error) {
        //                 console.error("Error moving order to completeOrders:", error);
        //             }
        //         }, 5000); // 1 minute in milliseconds
        //     }

        //     res.send(updateResult);
        // });

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: data.status
                }
            };
 
            const updateResult = await ordersCollection.updateOne(filter, updateDoc); 
             
            if (data.status === 'Completed' && updateResult.modifiedCount > 0) { 
                const order = await ordersCollection.findOne(filter); 

                const completeOrderResult = await completeOrdersCollection.insertOne(order); 

                if (completeOrderResult.insertedId) {
                    await ordersCollection.deleteOne(filter);
                }
            }

            res.send(updateResult);
        });

        // orders get by email 
        app.get('/orderss/:email', async (req, res) => {
            const email = req.params.email 
            const query = { 'data.email': email } 
            const result = await ordersCollection.find(query).toArray()
            res.send(result)
        })



        // order data post in completeOrdersCollection 
        app.post('/completeOrders', async (req, res) => {
            const data = req.body
            const result = await completeOrdersCollection.insertOne(data)
            res.send(result)
        })

        // get all complete orders 
        app.get('/completeOrders', async (req, res) => {
            const result = await completeOrdersCollection.find().toArray()
            res.send(result)
        })

        // complete orders get by email 
        app.get('/completeOrders/:email', async (req, res) => {
            const email = req.params.email 
            const query = { 'data.email': email } 
            const result = await completeOrdersCollection.find(query).toArray()
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