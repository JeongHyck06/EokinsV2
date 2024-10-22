const dotenv = require('dotenv');
dotenv.config();

const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

async function connectDB() {
    if (!uri) {
        throw new Error('MongoDB URI가 설정되지 않았습니다.');
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('MongoDB에 연결되었습니다.');
        return client.db('Eokins');
    } catch (err) {
        console.error('MongoDB 연결 실패:', err);
    }
}

module.exports = connectDB;
