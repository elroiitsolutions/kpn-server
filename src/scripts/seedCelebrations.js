import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Celebration from '../models/Celebration.js';
import { connectDB } from '../config/db.js';

const initialCelebrations = [
  {
    title: 'Bangalore Office Opening',
    subheading: 'Expanding Horizons — Now Open in Bangalore!',
    description: 'A landmark expansion milestone for KPN Promoters as we officially inaugurate our Bangalore regional branch office.',
    image: '/images/celebrations/blr_office_opening.jpeg',
    year: '2025',
    date: 'February 2025',
    category: 'Office',
    order: 1,
    status: 'Published',
  },
  {
    title: 'GOA Trip 2025',
    subheading: 'Goa 2025 – Where Every Sunset Tells a Story!',
    description: 'Celebrating teamwork, camaraderie, and record-breaking annual developer milestones with our cherished sales, engineering, and leadership teams in sunny Goa.',
    image: '/images/celebrations/goa_trip_2025.jpeg',
    year: '2025',
    date: 'January 2025',
    category: 'Trip',
    order: 2,
    status: 'Published',
  },
  {
    title: 'Munnar trip',
    subheading: 'Breathe the clouds, live the moments.',
    description: 'A refreshing retreat to the tranquil mist-covered hills of Munnar, fostering deeper unity and mutual inspiration across the KPN family.',
    image: '/images/celebrations/munnar_trip.jpeg',
    year: '2024',
    date: 'September 2024',
    category: 'Trip',
    order: 3,
    status: 'Published',
  },
  {
    title: 'KMT-PH1 LAUNCH',
    subheading: 'Announcing new projects with enthusiasm.',
    description: 'Groundbreaking ceremony and public unveiling of KPN Marvel Township Phase 1, welcoming prospective homeowners and strategic associates.',
    image: '/images/celebrations/kmt_ph1_launch.jpeg',
    year: '2024',
    date: 'June 2024',
    category: 'Launch',
    order: 4,
    status: 'Published',
  },
  {
    title: 'MD Birthday',
    subheading: 'Celebrating the vision, the leader, and the journey — Happy Birthday',
    description: 'Honoring our Managing Director Mr. Kanniappan, whose dedication, integrity, and visionary leadership have propelled KPN Promoters to 20+ years of excellence.',
    image: '/images/celebrations/md_birthday.jpeg',
    year: '2024',
    date: 'May 2024',
    category: 'Milestone',
    order: 5,
    status: 'Published',
  },
  {
    title: 'Pongal Celebration',
    subheading: 'Celebrating the spirit of harvest, culture, and togetherness',
    description: 'Traditional Tamil Pongal festivities at KPN headquarters with traditional attire, sugarcane, sweet pongal, and cultural harmony.',
    image: '/images/celebrations/pongal_celebration.jpeg',
    year: '2024',
    date: 'January 2024',
    category: 'Festival',
    order: 6,
    status: 'Published',
  },
  {
    title: 'Year End Meeting - 2023',
    subheading: 'Reflecting on the journey, realigning for the future — Year End Meeting',
    description: 'Annual corporate review meeting reviewing strategic achievements, rewarding top sales performers, and mapping out high-growth targets.',
    image: '/images/celebrations/year_end_meeting_2023.jpeg',
    year: '2023',
    date: 'December 2023',
    category: 'Milestone',
    order: 7,
    status: 'Published',
  },
];

async function seedCelebrations() {
  try {
    await connectDB();
    console.log('Connected to MongoDB. Seeding Celebrations...');

    // Remove existing or seed fresh
    await Celebration.deleteMany({});
    const inserted = await Celebration.insertMany(initialCelebrations);

    console.log(`Successfully seeded ${inserted.length} Celebrations into database.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding celebrations:', error);
    process.exit(1);
  }
}

seedCelebrations();
