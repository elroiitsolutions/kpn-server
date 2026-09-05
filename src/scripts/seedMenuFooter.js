import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import MenuCMS from '../models/MenuCMS.js';
import FooterCMS from '../models/FooterCMS.js';
import { connectDB } from '../config/db.js';

const defaultMenuItems = [
  { label: 'Home', href: '/', order: 1, isEnabled: true, children: [] },
  {
    label: 'Pages',
    href: '',
    order: 2,
    isEnabled: true,
    children: [
      { label: 'About Us', href: '/about-us', order: 1, isEnabled: true },
      { label: 'Our Awards', href: '/our-awards', order: 2, isEnabled: true },
      { label: 'Celebrations', href: '/celebrations', order: 3, isEnabled: true },
    ],
  },
  {
    label: 'Associate',
    href: '',
    order: 3,
    isEnabled: true,
    children: [
      { label: 'Investors', href: '/investors', order: 1, isEnabled: true },
      { label: 'Our Venture', href: '/our-ventures', order: 2, isEnabled: true },
      { label: 'Joint Development', href: '/joint-development', order: 3, isEnabled: true },
      { label: 'Industrial', href: '/industrial', order: 4, isEnabled: true },
      { label: 'NRI Services', href: '/nri', order: 5, isEnabled: true },
      { label: 'Channel Partners', href: '/channel-partners', order: 6, isEnabled: true },
    ],
  },
  { label: 'Projects', href: '/projects', order: 4, isEnabled: true, children: [] },
  { label: 'News', href: '/blogs', order: 5, isEnabled: true, children: [] },
  { label: 'Contact', href: '/contact-us', order: 6, isEnabled: true, children: [] },
];

const defaultFooterData = {
  name: 'main_footer',
  companyDescription:
    'KPN Promoters has earned the trust of over 10,000 satisfied families across Chennai and Tamil Nadu.',
  address: 'No: 17, 1st Cross Street, Sri Devi Nagar, Alapakkam, Chennai - 600116',
  phone: '+91 98844 55555',
  email: 'info@kpnpromoters.in',
  copyright: '© 2026 KPN Promoters. All Rights Reserved.',
  socialLinks: {
    facebook: 'https://facebook.com/kpnpromoters',
    instagram: 'https://instagram.com/kpnpromoters',
    youtube: 'https://youtube.com/@kpnpromoters',
    linkedin: 'https://linkedin.com/company/kpnpromoters',
  },
  quickLinks: [
    { label: 'About Us', href: '/about-us', order: 1 },
    { label: 'Our Awards', href: '/our-awards', order: 2 },
    { label: 'Investors', href: '/investors', order: 3 },
    { label: 'Projects', href: '/projects', order: 4 },
  ],
  importantLinks: [
    { label: 'Residential Apartments', href: '/projects', order: 1 },
    { label: 'Approved Plots', href: '/projects', order: 2 },
    { label: 'Joint Development', href: '/joint-development', order: 3 },
    { label: 'NRI Services', href: '/nri', order: 4 },
  ],
};

const run = async () => {
  await connectDB();

  // 1. Update or create MenuCMS under name 'main_menu'
  await MenuCMS.findOneAndUpdate(
    { name: 'main_menu' },
    { name: 'main_menu', items: defaultMenuItems },
    { upsert: true, new: true }
  );
  console.log('✅ MenuCMS populated successfully with 6 parent links & 8 sublinks!');

  // 2. Update or create FooterCMS
  await FooterCMS.findOneAndUpdate(
    { name: 'main_footer' },
    defaultFooterData,
    { upsert: true, new: true }
  );
  console.log('✅ FooterCMS populated successfully with full contact & links!');

  process.exit(0);
};

run().catch((err) => {
  console.error('Error seeding menu/footer:', err);
  process.exit(1);
});
