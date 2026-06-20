require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    console.log('Testing MongoDB Atlas connection...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas Connected successfully!');
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Test basic database operation
    const testDoc = await mongoose.connection.db.collection('testconnection').insertOne({
      test: 'Connection test',
      timestamp: new Date()
    });
    
    console.log('✅ Test document inserted successfully!');
    console.log(`Document ID: ${testDoc.insertedId}`);
    
    // Clean up
    await mongoose.connection.db.collection('testconnection').deleteOne({ _id: testDoc.insertedId });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from database');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();