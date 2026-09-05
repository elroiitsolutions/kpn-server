import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import ProjectUnit from '../models/ProjectUnit.js';
import Blog from '../models/Blog.js';
import Award from '../models/Award.js';
import Testimonial from '../models/Testimonial.js';
import HomepageCMS from '../models/HomepageCMS.js';
import MenuCMS from '../models/MenuCMS.js';
import FooterCMS from '../models/FooterCMS.js';
import { connectDB } from '../config/db.js';

// Seed raw data extracted directly from existing siteData.ts
const initialProjects = [
  {
    name: 'KPN LeNid',
    slug: 'kpn-lenid',
    location: 'Urapakkam, Chennai',
    address: 'No. 48, Karanai Puducherry Rd, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    propertyType: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 19L Onwards',
    image: '/images/projects/apt_lenid.jpg',
    streetViewUrl:
      'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
    description:
      'KPN LeNid is an exquisite residential apartment complex in Urapakkam, featuring modern lifestyle amenities, robust engineering, and rapid connectivity to GST Road and Kilambakkam Bus Terminus.',
    shortDescription: 'Modern affordable 1 & 2 BHK apartments in Urapakkam, Chennai.',
    totalUnits: 48,
    availableUnits: 14,
    soldUnits: 30,
    reservedUnits: 4,
    isFeatured: true,
  },
  {
    name: 'DGM Monica Residency',
    slug: 'dgm-monica-residency',
    location: 'Urapakkam, Chennai',
    address: 'Near GST Road, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    propertyType: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 30L Onwards',
    image: '/images/projects/apt_dgm_monica.jpg',
    streetViewUrl:
      'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
    description:
      'DGM Monica Residency provides contemporary living spaces with spacious floor plans, close proximity to prime schools, shopping centers, and transport corridors.',
    shortDescription: 'Premium 1 & 2 BHK homes near GST Road.',
    totalUnits: 32,
    availableUnits: 8,
    soldUnits: 20,
    reservedUnits: 4,
    isFeatured: true,
  },
  {
    name: 'SP2K Serenity Skyline',
    slug: 'sp2k-serenity-skyline',
    location: 'Urapakkam, Chennai',
    address: 'Karanai Puducherry Main Road, Urapakkam, Chennai',
    bhk: '1 & 2 BHK',
    propertyType: 'Apartments',
    status: 'Upcoming',
    budget: '₹ 38L Onwards',
    image: '/images/projects/apt_sp2k_serenity.jpg',
    streetViewUrl:
      'https://www.google.com/maps/embed?pb=!4v1680000000000!6m8!1m7!1sCAoSLEFGMVFpcE1mX1h3Q1pfcG5oQ09oV2RjSGFxTXlhZFl0b2pfaEZfN0p4WGZZ!2m2!1d12.8571477!2d80.0631628!3f120!4f0!5f0.7820865974627469',
    description:
      'SP2K Serenity Skyline is an upcoming landmark development engineered for elevated suburban luxury with high appreciation potential.',
    shortDescription: 'Upcoming high-rise residences with panoramic community views.',
    totalUnits: 60,
    availableUnits: 45,
    soldUnits: 10,
    reservedUnits: 5,
    isFeatured: true,
  },
  {
    name: 'Royal Oak',
    slug: 'royal-oak',
    location: 'Urapakkam, Chennai',
    address: 'Opp. Railway Station, Urapakkam, Chennai',
    bhk: '2 BHK',
    propertyType: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 48L Onwards',
    image: '/images/projects/apt_royal_oak.jpg',
    description:
      'Royal Oak offers upscale 2 BHK homes right opposite the Urapakkam Railway Station with seamless commuter convenience.',
    shortDescription: 'Convenient 2 BHK living opposite Urapakkam station.',
    totalUnits: 24,
    availableUnits: 6,
    soldUnits: 16,
    reservedUnits: 2,
    isFeatured: true,
  },
  {
    name: 'KPN Vijayalakshmi',
    slug: 'kpn-vijayalakshmi',
    location: 'Urapakkam, Chennai',
    address: 'Near Kilambakkam Bus Terminus, Urapakkam, Chennai',
    bhk: '2 BHK',
    propertyType: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 54L Onwards',
    image: '/images/projects/apt_vijayalakshmi.jpg',
    description:
      'Strategically located near the Asia’s largest bus terminus at Kilambakkam, KPN Vijayalakshmi offers elite finishes and excellent rental returns.',
    shortDescription: 'Prime 2 BHK residences near Kilambakkam terminus.',
    totalUnits: 36,
    availableUnits: 12,
    soldUnits: 20,
    reservedUnits: 4,
    isFeatured: false,
  },
  {
    name: 'KPN Enclave',
    slug: 'kpn-enclave',
    location: 'Urapakkam, Chennai',
    address: 'Adhanur Main Road, Urapakkam, Chennai',
    bhk: '2 BHK',
    propertyType: 'Apartments',
    status: 'Ongoing',
    budget: '₹ 45L Onwards',
    image: '/images/projects/apt_kpn_enclave.jpg',
    description: 'Serene community apartments on Adhanur Main Road with landscaped courtyards and secured access.',
    shortDescription: 'Peaceful 2 BHK family homes on Adhanur Main Road.',
    totalUnits: 20,
    availableUnits: 5,
    soldUnits: 14,
    reservedUnits: 1,
    isFeatured: false,
  },
  // PLOTS
  {
    name: 'KPN Marvel Township',
    slug: 'kpn-marvel-township',
    location: 'Urapakkam, Chennai',
    address: 'Urapakkam Main Road, Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2799/Sq.Ft',
    image: '/images/projects/plot_marvel.jpg',
    description: 'CMDA & DTCP approved premium villa plots in an integrated township with blacktop roads, street lights, and round-the-clock security.',
    shortDescription: 'Approved villa plots in Urapakkam starting ₹2799/sq.ft.',
    totalUnits: 80,
    availableUnits: 28,
    soldUnits: 45,
    reservedUnits: 7,
    isFeatured: true,
  },
  {
    name: 'Sri Bhavai Amman Nagar II',
    slug: 'sri-bhavai-amman-nagar-ii',
    location: 'Urapakkam, Chennai',
    address: 'Near Bhavai Amman Temple, Urapakkam, Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 4999/Sq.Ft',
    image: '/images/projects/plot_sri_bhavai_amman.png',
    description: 'High-appreciation residential plots located near Bhavai Amman Temple with complete legal clearance and potable groundwater.',
    shortDescription: 'Prime plots near Bhavai Amman Temple, Urapakkam.',
    totalUnits: 40,
    availableUnits: 15,
    soldUnits: 22,
    reservedUnits: 3,
    isFeatured: false,
  },
  {
    name: 'Sri Ranga Nagar',
    slug: 'sri-ranga-nagar',
    location: 'Nenmeli, Chennai',
    address: 'Nenmeli Main Road, Chengalpattu / Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3299/Sq.Ft',
    image: '/images/projects/plot_sri_ranga_nagar.png',
    description: 'Scenic residential layout in Nenmeli, surrounded by lush green landscapes and fast-developing infrastructure.',
    shortDescription: 'Residential plots in Nenmeli on main road.',
    totalUnits: 50,
    availableUnits: 18,
    soldUnits: 28,
    reservedUnits: 4,
    isFeatured: false,
  },
  {
    name: 'KPN Omega Town',
    slug: 'kpn-omega-town',
    location: 'Guduvanchery, Chennai',
    address: 'Nellikuppam Road, Guduvanchery, Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2799/Sq.Ft',
    image: '/images/projects/plot_omega.jpg',
    description: 'Grand gated community layout on Nellikuppam Road, Guduvanchery. Ready for immediate villa construction.',
    shortDescription: 'Gated community villa plots in Guduvanchery.',
    totalUnits: 100,
    availableUnits: 35,
    soldUnits: 55,
    reservedUnits: 10,
    isFeatured: true,
  },
  {
    name: 'AVP Kanagam Avenue',
    slug: 'avp-kanagam-avenue',
    location: 'Guduvanchery, Chennai',
    address: 'Govindarajapuram, Guduvanchery, Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 4500/Sq.Ft',
    image: '/images/projects/plot_avp_kanagam_avenue.jpg',
    description: 'Fully developed residential plots with avenue trees, compound wall, and immediate bank loan availability.',
    shortDescription: 'Elite villa plots in Govindarajapuram, Guduvanchery.',
    totalUnits: 30,
    availableUnits: 9,
    soldUnits: 18,
    reservedUnits: 3,
    isFeatured: false,
  },
  {
    name: 'AVP Kanagam Nagar',
    slug: 'avp-kanagam-nagar',
    location: 'Kalivanthapattu, Chennai',
    address: 'Kalivanthapattu Road, Maraimalai Nagar / Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 3500/Sq.Ft',
    image: '/images/projects/plot_avp_kanagam_nagar.jpg',
    description: 'Strategic plots near industrial hubs of Maraimalai Nagar and Mahindra World City.',
    shortDescription: 'Plots near Maraimalai Nagar industrial corridor.',
    totalUnits: 45,
    availableUnits: 12,
    soldUnits: 30,
    reservedUnits: 3,
    isFeatured: false,
  },
  {
    name: 'KPN Thulir',
    slug: 'kpn-thulir',
    location: 'S.P. Kovil, Chennai',
    address: 'Singaperumal Koil Main Road, Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 2099/Sq.Ft',
    image: '/images/projects/plot_kpn_thulir.jpeg',
    description: 'Affordable investment plots situated on Singaperumal Koil Main Road with high industrial growth corridor proximity.',
    shortDescription: 'Affordable investment plots in Singaperumal Koil.',
    totalUnits: 65,
    availableUnits: 25,
    soldUnits: 35,
    reservedUnits: 5,
    isFeatured: false,
  },
  {
    name: 'KPN Sri Sai Baba Nagar',
    slug: 'kpn-sri-sai-baba-nagar',
    location: 'Maraimalai Nagar, Chennai',
    address: 'Sri Sai Baba Nagar, Maraimalai Nagar, Chennai',
    bhk: 'Plots',
    propertyType: 'Plots',
    status: 'Ongoing',
    budget: '₹ 999/Sq.Ft',
    image: '/images/projects/plot_kpn_ssbn.jpeg',
    description: 'Budget-friendly land investment option in Maraimalai Nagar with rapid capital appreciation.',
    shortDescription: 'Budget plots from ₹999/sq.ft in Maraimalai Nagar.',
    totalUnits: 80,
    availableUnits: 30,
    soldUnits: 42,
    reservedUnits: 8,
    isFeatured: false,
  },
];

const initialBlogs = [
  {
    title: 'How to Get Started in Buying Your First Home',
    slug: 'how-to-get-started-in-buying-your-first-home',
    category: 'Tips & Tricks',
    featuredImage: '/images/blog/blog_1.jpg',
    shortDescription: 'Navigating your first home purchase can feel overwhelming. Discover essential steps, financial planning, and developer guidance.',
    content: `It’s no secret that access to quality housing and education is vital. Many buyers in underserved or growing communities lack proper developer guidance, qualified legal advisory, and transparent property options. This divide creates uncertainty for first-time buyers.\n\nEducation and guidance empower families to dream beyond their circumstances and envision a world of possibilities. Investing in real estate is more than just acquiring property; it is about establishing a lasting legacy for your family.\n\nIn a world brimming with opportunities, supporting sustainable residential developments lays the cornerstone of long-term wealth, security, and peace of mind.`,
    tags: ['First Home', 'Chennai Real Estate', 'Finance'],
    galleryImages: ['/images/projects/project_1.jpg', '/images/projects/project_2.jpg'],
    status: 'Published',
  },
  {
    title: 'Exploring Minimalism with a Touch of Luxury',
    slug: 'exploring-minimalism-with-a-touch-of-luxury',
    category: 'Company',
    featuredImage: '/images/blog/blog_2.jpg',
    shortDescription: 'Modern architectural design balances clean lines with high-end finishes for a clutter-free, luxurious ambiance.',
    content: `Minimalist home design focuses on essential structural beauty while incorporating premium natural textures and warm lighting.\n\nBy streamlining interior spaces, homeowners create tranquil environments that promote wellness and modern living standards.`,
    tags: ['Architecture', 'Luxury Living'],
    galleryImages: ['/images/projects/project_3.jpg', '/images/projects/project_4.jpg'],
    status: 'Published',
  },
  {
    title: 'Are Sustainable Materials the Future of Homes?',
    slug: 'are-sustainable-materials-the-future-of-homes',
    category: 'Social Media',
    featuredImage: '/images/blog/blog_3.jpg',
    shortDescription: 'Eco-friendly building materials are transforming modern real estate development and reducing environmental footprint.',
    content: `Green building technology and sustainable material sourcing are rapidly becoming standard in modern residential infrastructure.\n\nInvesting in energy-efficient insulation and solar integration ensures long-term utility savings and environmental preservation.`,
    tags: ['Sustainability', 'Eco Friendly'],
    galleryImages: ['/images/projects/project_5.jpg', '/images/projects/project_6.jpg'],
    status: 'Published',
  },
  {
    title: 'Biophilic Design Bringing Nature Indoors',
    slug: 'biophilic-design-bringing-nature-indoors',
    category: 'Tips & Tricks',
    featuredImage: '/images/projects/project_1.jpg',
    shortDescription: 'Integrating natural greenery and sunlight into indoor spaces improves air quality and mental well-being.',
    content: `Biophilic architecture seamlessly connects indoor living areas with natural landscape elements, courtyards, and vertical gardens.`,
    tags: ['Biophilic', 'Design'],
    galleryImages: ['/images/projects/project_1.jpg', '/images/projects/project_2.jpg'],
    status: 'Published',
  },
  {
    title: 'Revamping Old Spaces',
    slug: 'revamping-old-spaces',
    category: 'Social Media',
    featuredImage: '/images/projects/project_2.jpg',
    shortDescription: 'Smart renovation strategies for breathing new life into traditional residential properties.',
    content: `Renovating legacy properties requires strategic structural enhancements and modern aesthetic updates.`,
    tags: ['Renovation', 'Interior Design'],
    galleryImages: ['/images/projects/project_3.jpg', '/images/projects/project_4.jpg'],
    status: 'Published',
  },
  {
    title: 'Tiny Homes: Big Benefits',
    slug: 'tiny-homes-big-benefits',
    category: 'Company',
    featuredImage: '/images/projects/project_3.jpg',
    shortDescription: 'Compact living spaces engineered for maximum functionality, affordability, and eco-friendly lifestyles.',
    content: `Compact home floor plans utilize space optimization to deliver full comfort within efficient footprints.`,
    tags: ['Compact Homes', 'Lifestyle'],
    galleryImages: ['/images/projects/project_5.jpg', '/images/projects/project_6.jpg'],
    status: 'Published',
  },
];

const initialAwards = [
  {
    year: '2024',
    title: 'FPA Home Expo 2024',
    organization: 'By Flat Promoters Association',
    image: '/images/awards/FPA-Home-Expo-2024.png',
  },
  {
    year: '2023',
    title: 'FPA Home Expo 2023',
    organization: 'By Flat Promoters Association',
    image: '/images/awards/FPA-Home-Expo-2023.png',
  },
  {
    year: '2025',
    title: 'Trusted Developer of the Year',
    organization: 'By Economic Times Achievers of Tamil Nadu',
    image: '/images/awards/Trusted-Developer-2025.png',
  },
  {
    year: '2017',
    title: 'Best Builder Award',
    organization: 'Top Commercial & Residential Builder',
    image: '/images/awards/Best-Builder-2017.png',
  },
  {
    year: '2019',
    title: 'Business Growth Award',
    organization: 'Excellence in Real Estate Development',
    image: '/images/awards/Business-Growth-2019.png',
  },
  {
    year: '2021',
    title: 'Business Growth Award',
    organization: 'Outstanding Achievement in Housing',
    image: '/images/awards/Business-Growth-2021.png',
  },
  {
    year: '2024',
    title: 'LIC Business Meet Award',
    organization: 'Outstanding Performance & Partnership',
    image: '/images/awards/LIC-Business-Meet-2024.png',
  },
  {
    year: '2024',
    title: 'Township Developers of the Year',
    organization: 'Integrated Township Excellence',
    image: '/images/awards/Township-Developers-2024.png',
  },
  {
    year: '2024',
    title: 'Life Membership Certificate',
    organization: 'Flat Promoters Association',
    image: '/images/awards/Life-Membership-Certificate.png',
  },
];

const initialTestimonials = [
  {
    title: 'Excellent experience!',
    quote: 'A wonderful experience! They knew what they were doing and were incredibly knowledgeable throughout the process.',
    author: 'Floyd Miles',
    role: 'Bond Projects Coordinator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    title: 'Totally Impressed!',
    quote: 'I asked to have the area rebuilt and they were very prompt! Mud and texture came out great! Would highly recommend!',
    author: 'Ronald Benson',
    role: 'Marketing Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    title: 'Excellent Communication',
    quote: 'We like the facilities & maintenance services here so much that we have even referred it to our relatives.',
    author: 'John McConnor',
    role: 'Senior Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
    rating: 5,
  },
  {
    title: 'Highly Recommended',
    quote: 'Your team were great to work with on our basement remodel! I will definitely be working with them for future projects!',
    author: 'Alena Fisher',
    role: 'Senior Marketing Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    rating: 5,
  },
];

async function seed() {
  await connectDB();
  console.log('[Seed] Starting database migration & seed process...');

  // 1. Seed Superadmin User
  const adminEmail = 'admin@kpnpromoters.in';
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await User.create({
      name: 'KPN Super Admin',
      email: adminEmail,
      password: 'Admin@KPN2026',
      role: 'superadmin',
      isActive: true,
    });
    console.log(`[Seed] Superadmin created: ${adminEmail} / Admin@KPN2026`);
  } else {
    console.log(`[Seed] Superadmin already exists: ${adminEmail}`);
  }

  // 2. Seed Projects & Units
  const createdProjectIds = [];

  for (let idx = 0; idx < initialProjects.length; idx++) {
    const pData = initialProjects[idx];
    let project = await Project.findOne({ slug: pData.slug });

    const defaultAmenities = [
      { name: '24x7 Security', icon: 'Shield', description: 'Gated security and CCTV surveillance.' },
      { name: 'Fitness Center', icon: 'Dumbbell', description: 'Modern indoor gym with fitness equipment.' },
      { name: "Children's Play Area", icon: 'Gamepad2', description: 'Safe open play space with rubberized turf.' },
      { name: 'Landscape Garden', icon: 'Trees', description: 'Manicured gardens and walking tracks.' },
    ];

    const defaultPlans = [
      { title: '1 BHK Master Plan', bhk: '1 BHK', sqft: '550 Sq. Ft.', imageUrl: '/images/projects/p1.webp' },
      { title: '2 BHK Luxury Plan', bhk: '2 BHK', sqft: '850 Sq. Ft.', imageUrl: '/images/projects/p2.webp' },
      { title: '3 BHK Premium Plan', bhk: '3 BHK', sqft: '1200 Sq. Ft.', imageUrl: '/images/projects/p3.webp' },
    ];

    const defaultNearby = [
      { name: 'Railway Station', distance: '1.7 km', description: 'Direct suburban train connectivity' },
      { name: 'Kilambakkam Bus Terminus', distance: '3.5 km', description: 'South Asia largest transport hub' },
      { name: 'Airport', distance: '22 km', description: 'Chennai International Airport' },
      { name: 'Supermarket', distance: '500 m', description: 'Daily essentials and grocery stores' },
      { name: 'Hospital', distance: '1.2 km', description: 'Multi-speciality medical care' },
    ];

    const defaultFaqs = [
      { question: 'Is the project approved by CMDA / DTCP?', answer: 'Yes, this project has 100% legal clearance with approved building plans.', order: 1 },
      { question: 'Are bank loans available?', answer: 'Yes, pre-approved loans are available with SBI, HDFC, LIC HFL, and ICICI Bank.', order: 2 },
      { question: 'Do you provide complimentary site visit pickup?', answer: 'Yes, KPN Promoters provides free cab pickup and drop facility for your family.', order: 3 },
    ];

    if (!project) {
      project = await Project.create({
        ...pData,
        order: idx + 1,
        isPublished: true,
        galleryImages: [
          pData.image,
          '/images/projects/project_2.jpg',
          '/images/projects/project_3.jpg',
          '/images/projects/project_4.jpg',
          '/images/projects/project_5.jpg',
        ],
        amenities: defaultAmenities,
        floorPlans: defaultPlans,
        nearbyLocations: defaultNearby,
        faqs: defaultFaqs,
        specifications: {
          structure: 'RCC Framed Structure designed for seismic zone resistance.',
          flooring: 'Vitrified tiles 2x2 in living, dining, and bedrooms.',
          doors: 'Teak wood main door frame with designer flush door.',
          windows: 'UPVC sliding windows with safety MS grills.',
          electrical: 'Finolex/Havells fire-resistant concealed copper wiring.',
          plumbing: 'Parryware / Hindware sanitary fixtures with CP fittings.',
          kitchen: 'Polished black granite counter top with stainless steel sink.',
          others: 'Weather-shield exterior paint and premium plastic emulsion interior.',
        },
      });
      console.log(`[Seed] Created Project: ${project.name}`);
    }

    createdProjectIds.push(project._id);

    // Create 6 representative units for each project if not existing
    const existingUnitsCount = await ProjectUnit.countDocuments({ project: project._id });
    if (existingUnitsCount === 0) {
      const sampleUnits = [
        { block: 'Block A', floor: '1st Floor', unitNumber: 'A101', type: '2 BHK', sizeSqFt: 850, status: 'Sold', price: 4200000 },
        { block: 'Block A', floor: '1st Floor', unitNumber: 'A102', type: '2 BHK', sizeSqFt: 875, status: 'Available', price: 4350000 },
        { block: 'Block A', floor: '2nd Floor', unitNumber: 'A201', type: '2 BHK', sizeSqFt: 850, status: 'Reserved', price: 4250000 },
        { block: 'Block A', floor: '2nd Floor', unitNumber: 'A202', type: '1 BHK', sizeSqFt: 550, status: 'Available', price: 2800000 },
        { block: 'Block B', floor: '1st Floor', unitNumber: 'B101', type: '2 BHK', sizeSqFt: 920, status: 'Available', price: 4600000 },
        { block: 'Block B', floor: '1st Floor', unitNumber: 'B102', type: '3 BHK', sizeSqFt: 1200, status: 'Blocked', price: 5800000 },
      ];

      for (const u of sampleUnits) {
        await ProjectUnit.create({
          project: project._id,
          ...u,
        });
      }
    }
  }

  // 3. Seed Blogs
  for (const b of initialBlogs) {
    const exists = await Blog.findOne({ slug: b.slug });
    if (!exists) {
      await Blog.create(b);
      console.log(`[Seed] Created Blog: ${b.title}`);
    }
  }

  // 4. Seed Awards
  for (let i = 0; i < initialAwards.length; i++) {
    const a = initialAwards[i];
    const exists = await Award.findOne({ title: a.title, year: a.year });
    if (!exists) {
      await Award.create({ ...a, order: i + 1 });
      console.log(`[Seed] Created Award: ${a.title}`);
    }
  }

  // 5. Seed Testimonials
  for (let i = 0; i < initialTestimonials.length; i++) {
    const t = initialTestimonials[i];
    const exists = await Testimonial.findOne({ author: t.author });
    if (!exists) {
      await Testimonial.create({ ...t, order: i + 1 });
      console.log(`[Seed] Created Testimonial: ${t.author}`);
    }
  }

  // 6. Seed Homepage CMS
  let homeCms = await HomepageCMS.findOne();
  if (!homeCms) {
    await HomepageCMS.create({
      featuredProjectIds: createdProjectIds.slice(0, 4),
    });
    console.log('[Seed] Created default Homepage CMS configuration');
  }

  let menuCms = await MenuCMS.findOne({ name: 'main_menu' });
  if (!menuCms) {
    await MenuCMS.create({
      name: 'main_menu',
      items: [
        { label: 'Home', href: '/', order: 1, isEnabled: true },
        {
          label: 'Pages',
          href: '',
          order: 2,
          isEnabled: true,
          children: [
            { label: 'About Us', href: '/about-us', order: 1, isEnabled: true },
            { label: 'Our Awards', href: '/our-awards', order: 2, isEnabled: true },
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
        { label: 'Projects', href: '/projects', order: 4, isEnabled: true },
        { label: 'News', href: '/blogs', order: 5, isEnabled: true },
        { label: 'Contact', href: '/contact-us', order: 6, isEnabled: true },
      ],
    });
    console.log('[Seed] Created default Menu CMS');
  }

  // 8. Seed Footer CMS
  let footerCms = await FooterCMS.findOne({ name: 'main_footer' });
  if (!footerCms) {
    await FooterCMS.create({
      name: 'main_footer',
      companyDescription:
        'KPN Promoters has earned the trust of over 10,000 satisfied families across Chennai and Tamil Nadu.',
      phone: '+91 98844 55555',
      email: 'info@kpnpromoters.in',
      address: 'No: 17, 1st Cross Street, Sri Devi Nagar, Alapakkam, Chennai - 600116',
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
    });
    console.log('[Seed] Created default Footer CMS');
  }

  console.log('✅ [Seed] Database seeding completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
