import mongoose from 'mongoose';

let isConnected = false; //Variable to track the connection status

export const connectToDb = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI){
        return console.log('MongoDb_Uri is not specified!')
    }

    if(isConnected){
        return console.log('=> Connected using existing database connection')
    }

    try{
        await mongoose.connect(process.env.MONGODB_URI);

        isConnected = true;
        console.log('Mongo DB connected');
    }
    catch(err){
        console.log(err);
    }
}