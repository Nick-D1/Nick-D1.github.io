// Bring in the DB connection and the Trip schema
const mongoose = require('./db'); // Adjust path if necessary
const Trip = require('./travlr'); // Import the Trip schema

// Read seed data from the JSON file
const fs = require('fs');
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// Define a function to seed the database
const seedDB = async () => {
  try {
    // Remove existing records
    await Trip.deleteMany();
    console.log('Existing records deleted.');

    // Insert seed data
    await Trip.insertMany(trips);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
};

// Close the MongoDB connection and exit
seedDB()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });