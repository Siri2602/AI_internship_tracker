require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');
const Application = require('../models/Application');

const seedData = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Application.deleteMany({});

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 12);
  const user = await User.create({
    name: 'Alex Johnson',
    email: 'demo@interniq.dev',
    password: hashedPassword,
    preferences: { theme: 'system', emailReminders: true, reminderDays: 3 },
  });

  console.log(`✅ Demo user created: demo@interniq.dev / demo123`);

  // Sample applications
  const apps = [
    { company: 'Google', role: 'Software Engineer Intern', location: 'Mountain View, CA', status: 'Interview', priority: 'High', applicationDate: new Date('2025-01-10'), jobUrl: 'https://careers.google.com', salary: '$8,000/mo', jobType: 'Full-time', tags: ['FAANG', 'backend', 'cloud'], notes: 'Passed phone screen. Two onsite rounds scheduled.', referral: true },
    { company: 'Meta', role: 'Frontend Engineer Intern', location: 'Menlo Park, CA', status: 'Applied', priority: 'High', applicationDate: new Date('2025-01-15'), salary: '$7,500/mo', jobType: 'Hybrid', tags: ['FAANG', 'frontend', 'react'], coverLetterUsed: true },
    { company: 'Stripe', role: 'Full-Stack Intern', location: 'Remote', status: 'Phone Screen', priority: 'High', applicationDate: new Date('2025-01-12'), salary: '$6,500/mo', jobType: 'Remote', tags: ['fintech', 'fullstack'], notes: 'Recruiter reached out. Call scheduled for next week.' },
    { company: 'Airbnb', role: 'Product Engineering Intern', location: 'San Francisco, CA', status: 'Offer', priority: 'High', applicationDate: new Date('2024-12-20'), salary: '$7,200/mo', jobType: 'Hybrid', tags: ['FAANG', 'product'], notes: 'Offer received! Deadline to accept: Feb 15.', deadline: new Date('2025-02-15') },
    { company: 'Notion', role: 'Software Engineer Intern', location: 'San Francisco, CA', status: 'Rejected', priority: 'Medium', applicationDate: new Date('2025-01-05'), jobType: 'On-site', tags: ['productivity', 'startup'], notes: 'Got a rejection email. No feedback provided.' },
    { company: 'Linear', role: 'Frontend Intern', location: 'Remote', status: 'Applied', priority: 'Medium', applicationDate: new Date('2025-01-18'), jobType: 'Remote', tags: ['startup', 'design-eng', 'react'] },
    { company: 'Vercel', role: 'Developer Experience Intern', location: 'Remote', status: 'Wishlist', priority: 'Medium', applicationDate: new Date('2025-01-20'), jobType: 'Remote', tags: ['devtools', 'infra', 'remote'] },
    { company: 'Figma', role: 'Software Engineer Intern', location: 'San Francisco, CA', status: 'Applied', priority: 'High', applicationDate: new Date('2025-01-14'), salary: '$7,000/mo', jobType: 'Hybrid', tags: ['design-tools', 'canvas'] },
    { company: 'Cloudflare', role: 'Systems Intern', location: 'Austin, TX', status: 'Applied', priority: 'Medium', applicationDate: new Date('2025-01-16'), jobType: 'Hybrid', tags: ['infra', 'networking', 'edge'] },
    { company: 'Discord', role: 'Backend Intern', location: 'Remote', status: 'Withdrawn', priority: 'Low', applicationDate: new Date('2024-12-10'), jobType: 'Remote', tags: ['gaming', 'backend'], notes: 'Withdrew to focus on higher-priority applications.' },
    { company: 'Shopify', role: 'Full-Stack Developer Intern', location: 'Remote', status: 'Interview', priority: 'High', applicationDate: new Date('2025-01-08'), salary: '$6,000/mo', jobType: 'Remote', tags: ['ecommerce', 'fullstack'], notes: 'Technical interview round 2 coming up.', followUpDate: new Date('2025-02-01') },
    { company: 'Twilio', role: 'Software Engineering Intern', location: 'Remote', status: 'Applied', priority: 'Low', applicationDate: new Date('2025-01-19'), jobType: 'Remote', tags: ['api', 'communications'] },
  ];

  const applications = apps.map((a) => ({ ...a, user: user._id }));
  await Application.insertMany(applications);

  console.log(`✅ ${applications.length} sample applications created`);
  console.log('\n🎉 Seed complete!');
  console.log('   Login: demo@interniq.dev');
  console.log('   Password: demo123\n');

  mongoose.connection.close();
};

seedData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
