import mongoose from 'mongoose';
import Provider from '../models/Provider';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ustaad';

const mockProviders = [
  {
    name: 'Ali Plumber',
    phoneNumber: '+923001234567',
    skills: ['plumber', 'pipe_fitting'],
    specializationLevel: 'expert',
    location: {
      type: 'Point',
      coordinates: [72.9772, 33.6449] // Longitude, Latitude for G-13 Islamabad roughly
    },
    availability: true,
    rating: 4.8,
    reviewCount: 45,
    onTimeScore: 95,
    cancellationRate: 2,
    baseRatePerHour: 1500,
    isVerified: true,
  },
  {
    name: 'Ahmed AC Technician',
    phoneNumber: '+923011234567',
    skills: ['ac_repair', 'ac_installation', 'electrician'],
    specializationLevel: 'expert',
    location: {
      type: 'Point',
      coordinates: [72.9785, 33.6455] // G-13
    },
    availability: true,
    rating: 4.5,
    reviewCount: 120,
    onTimeScore: 88,
    cancellationRate: 5,
    baseRatePerHour: 2000,
    isVerified: true,
  },
  {
    name: 'Sajid Electrician',
    phoneNumber: '+923021234567',
    skills: ['electrician', 'wiring'],
    specializationLevel: 'intermediate',
    location: {
      type: 'Point',
      coordinates: [72.9800, 33.6460]
    },
    availability: true,
    rating: 4.2,
    reviewCount: 30,
    onTimeScore: 80,
    cancellationRate: 10,
    baseRatePerHour: 1000,
    isVerified: false,
  },
  {
    name: 'Imran Home Services',
    phoneNumber: '+923031234567',
    skills: ['cleaner', 'plumber', 'electrician'],
    specializationLevel: 'basic',
    location: {
      type: 'Point',
      coordinates: [73.0479, 33.6844] // Farther away (e.g. F-8)
    },
    availability: true,
    rating: 4.9,
    reviewCount: 200,
    onTimeScore: 99,
    cancellationRate: 1,
    baseRatePerHour: 800,
    isVerified: true,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Provider.deleteMany({});
    console.log('Cleared existing providers');

    // Insert mock
    await Provider.insertMany(mockProviders);
    console.log('Successfully seeded mock providers');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
