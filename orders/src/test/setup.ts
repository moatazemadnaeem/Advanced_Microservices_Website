import mongoose from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'
let mongo:any;
jest.mock('../nats-wrapper');

beforeAll(async()=>{
    process.env.JWT_KEY='secret'
    mongo=await MongoMemoryServer.create()
    const mongoURI=mongo.getUri();
    await mongoose.connect(mongoURI)
})
beforeEach(async()=>{
    jest.clearAllMocks();
    const collections=await mongoose.connection.db.collections()
    for (let coll of collections){
       await coll.deleteMany({})
    }
})
afterAll(async()=>{
    await mongo.stop()
    await mongoose.connection.close()
})
