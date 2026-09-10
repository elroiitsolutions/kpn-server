import { sequelize } from '../src/config/db.js';
import { Project } from '../src/models/Project.js';

const generateApartmentBlocks = (projectName) => [
  {
    blockId: 'A',
    blockName: 'Tower A',
    totalFloors: 4,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: '1st Floor',
        units: [
          { unitId: 'A101', unitNumber: '101', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
          { unitId: 'A102', unitNumber: '102', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'available' },
          { unitId: 'A103', unitNumber: '103', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'booked' },
          { unitId: 'A104', unitNumber: '104', bhk: 2, bathrooms: 2, size: 890, unitType: '2 BHK Corner', facing: 'West', status: 'available' },
        ],
      },
      {
        floorNumber: 2,
        floorName: '2nd Floor',
        units: [
          { unitId: 'A201', unitNumber: '201', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
          { unitId: 'A202', unitNumber: '202', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'sold' },
          { unitId: 'A203', unitNumber: '203', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'available' },
          { unitId: 'A204', unitNumber: '204', bhk: 3, bathrooms: 2, size: 1250, unitType: '3 BHK Royal', facing: 'North-East', status: 'available' },
        ],
      },
      {
        floorNumber: 3,
        floorName: '3rd Floor',
        units: [
          { unitId: 'A301', unitNumber: '301', bhk: 2, bathrooms: 2, size: 850, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
          { unitId: 'A302', unitNumber: '302', bhk: 2, bathrooms: 2, size: 875, unitType: '2 BHK Premium', facing: 'North', status: 'available' },
          { unitId: 'A303', unitNumber: '303', bhk: 1, bathrooms: 1, size: 560, unitType: '1 BHK Smart', facing: 'East', status: 'available' },
          { unitId: 'A304', unitNumber: '304', bhk: 2, bathrooms: 2, size: 890, unitType: '2 BHK Corner', facing: 'West', status: 'booked' },
        ],
      },
      {
        floorNumber: 4,
        floorName: '4th Floor',
        units: [
          { unitId: 'A401', unitNumber: '401', bhk: 3, bathrooms: 3, size: 1350, unitType: '3 BHK Penthouse', facing: 'East', status: 'available' },
          { unitId: 'A402', unitNumber: '402', bhk: 3, bathrooms: 3, size: 1400, unitType: '3 BHK Penthouse', facing: 'North', status: 'available' },
          { unitId: 'A403', unitNumber: '403', bhk: 2, bathrooms: 2, size: 900, unitType: '2 BHK Luxury', facing: 'West', status: 'booked' },
          { unitId: 'A404', unitNumber: '404', bhk: 3, bathrooms: 3, size: 1380, unitType: '3 BHK Royal', facing: 'North-East', status: 'available' },
        ],
      },
    ],
  },
  {
    blockId: 'B',
    blockName: 'Tower B',
    totalFloors: 3,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: '1st Floor',
        units: [
          { unitId: 'B101', unitNumber: '101', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
          { unitId: 'B102', unitNumber: '102', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'West', status: 'available' },
          { unitId: 'B103', unitNumber: '103', bhk: 3, bathrooms: 2, size: 1200, unitType: '3 BHK Elite', facing: 'North', status: 'available' },
        ],
      },
      {
        floorNumber: 2,
        floorName: '2nd Floor',
        units: [
          { unitId: 'B201', unitNumber: '201', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
          { unitId: 'B202', unitNumber: '202', bhk: 2, bathrooms: 2, size: 920, unitType: '2 BHK Luxury', facing: 'West', status: 'sold' },
          { unitId: 'B203', unitNumber: '203', bhk: 3, bathrooms: 2, size: 1200, unitType: '3 BHK Elite', facing: 'North', status: 'available' },
        ],
      },
      {
        floorNumber: 3,
        floorName: '3rd Floor',
        units: [
          { unitId: 'B301', unitNumber: '301', bhk: 2, bathrooms: 2, size: 950, unitType: '2 BHK Luxury', facing: 'East', status: 'available' },
          { unitId: 'B302', unitNumber: '302', bhk: 3, bathrooms: 2, size: 1250, unitType: '3 BHK Royal', facing: 'West', status: 'available' },
          { unitId: 'B303', unitNumber: '303', bhk: 3, bathrooms: 3, size: 1350, unitType: '3 BHK Elite', facing: 'North', status: 'available' },
        ],
      },
    ],
  },
];

const generatePlots = (count = 28) => {
  const sizes = [600, 800, 1000, 1200, 1200, 1500, 1800, 2400];
  const facings = ['East', 'North', 'East', 'North-East', 'West'];
  return Array.from({ length: count }, (_, i) => {
    const plotNum = i + 1;
    const isBooked = plotNum === 4 || plotNum === 11 || plotNum === 19 || plotNum === 25;
    const isSold = plotNum === 7 || plotNum === 14 || plotNum === 21;
    const status = isSold ? 'sold' : isBooked ? 'booked' : 'available';

    return {
      plotId: `P-${plotNum}`,
      plotNumber: `${plotNum}`,
      size: sizes[i % sizes.length],
      facing: facings[i % facings.length],
      status,
    };
  });
};

const generateVillaBlocks = () => [
  {
    blockId: 'V1',
    blockName: 'Enclave A (Palm Grove)',
    totalFloors: 2,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: 'Ground Level',
        units: [
          { unitId: 'VA-01', unitNumber: 'A-01', bhk: 3, bathrooms: 3, size: 1850, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' },
          { unitId: 'VA-02', unitNumber: 'A-02', bhk: 3, bathrooms: 3, size: 1920, unitType: '3 BHK Duplex Villa', facing: 'North', status: 'available' },
          { unitId: 'VA-03', unitNumber: 'A-03', bhk: 4, bathrooms: 4, size: 2200, unitType: '4 BHK Grand Villa', facing: 'East', status: 'booked' },
          { unitId: 'VA-04', unitNumber: 'A-04', bhk: 4, bathrooms: 4, size: 2350, unitType: '4 BHK Corner Villa', facing: 'North-East', status: 'available' },
        ],
      },
      {
        floorNumber: 2,
        floorName: 'Upper Level & Terrace',
        units: [
          { unitId: 'VA-05', unitNumber: 'A-05', bhk: 3, bathrooms: 3, size: 1850, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' },
          { unitId: 'VA-06', unitNumber: 'A-06', bhk: 3, bathrooms: 3, size: 1950, unitType: '3 BHK Duplex Villa', facing: 'West', status: 'sold' },
          { unitId: 'VA-07', unitNumber: 'A-07', bhk: 4, bathrooms: 4, size: 2400, unitType: '4 BHK Grand Villa', facing: 'North', status: 'available' },
        ],
      },
    ],
  },
  {
    blockId: 'V2',
    blockName: 'Enclave B (Royal Greens)',
    totalFloors: 2,
    floorPlanImages: [],
    floors: [
      {
        floorNumber: 1,
        floorName: 'Ground Level',
        units: [
          { unitId: 'VB-01', unitNumber: 'B-01', bhk: 3, bathrooms: 3, size: 2100, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'available' },
          { unitId: 'VB-02', unitNumber: 'B-02', bhk: 4, bathrooms: 4, size: 2600, unitType: '4 BHK Royal Villa', facing: 'North', status: 'available' },
          { unitId: 'VB-03', unitNumber: 'B-03', bhk: 4, bathrooms: 4, size: 2850, unitType: '4 BHK Presidential Villa', facing: 'North-East', status: 'available' },
        ],
      },
      {
        floorNumber: 2,
        floorName: 'Upper Level & Terrace',
        units: [
          { unitId: 'VB-04', unitNumber: 'B-04', bhk: 3, bathrooms: 3, size: 2100, unitType: '3 BHK Duplex Villa', facing: 'East', status: 'booked' },
          { unitId: 'VB-05', unitNumber: 'B-05', bhk: 4, bathrooms: 4, size: 2750, unitType: '4 BHK Royal Villa', facing: 'North', status: 'available' },
        ],
      },
    ],
  },
];

const generateVillaPlots = () => {
  const villaConfigs = [
    { num: 'V-01', bhk: 3, size: 1850, facing: 'East', status: 'available' },
    { num: 'V-02', bhk: 3, size: 1950, facing: 'North', status: 'available' },
    { num: 'V-03', bhk: 4, size: 2250, facing: 'East', status: 'booked' },
    { num: 'V-04', bhk: 4, size: 2400, facing: 'North-East', status: 'available' },
    { num: 'V-05', bhk: 3, size: 1850, facing: 'West', status: 'sold' },
    { num: 'V-06', bhk: 3, size: 2100, facing: 'East', status: 'available' },
    { num: 'V-07', bhk: 4, size: 2650, facing: 'North', status: 'available' },
    { num: 'V-08', bhk: 4, size: 2850, facing: 'North-East', status: 'available' },
    { num: 'V-09', bhk: 3, size: 1900, facing: 'East', status: 'available' },
    { num: 'V-10', bhk: 4, size: 2500, facing: 'West', status: 'booked' },
    { num: 'V-11', bhk: 3, size: 2100, facing: 'North', status: 'available' },
    { num: 'V-12', bhk: 4, size: 3100, facing: 'East', status: 'available' },
  ];

  return villaConfigs.map((vc) => ({
    plotId: `villa-${vc.num}`,
    plotNumber: vc.num,
    size: vc.size,
    facing: vc.facing,
    status: vc.status,
  }));
};

async function seed() {
  await sequelize.authenticate();
  console.log('Database connected successfully.');

  // 1. Existing villa definitions to ensure they are in DB
  const villaProjects = [
    {
      name: 'KPN Hindhu Avenue',
      slug: 'kpn-hindhu-avenue',
      propertyType: 'Villas',
      status: 'Ongoing',
      city: 'Chennai',
      location: 'Urapakkam, Chennai',
      address: 'Hindhu Avenue, Urapakkam, Chennai',
      bhk: '2 & 3 BHK Villa',
      budget: '₹ 45L Onwards',
      image: '/images/projectimg/KPN-Hindu-Avenue.jpg',
      featuredImage: '/images/projectimg/KPN-Hindu-Avenue.jpg',
      shortDescription: 'Exclusive 2 & 3 BHK luxury independent and duplex villas with private garden in Urapakkam.',
    },
    {
      name: 'KPN Sairam Nagar',
      slug: 'kpn-sairam-nagar',
      propertyType: 'Villas',
      status: 'Ongoing',
      city: 'Chennai',
      location: 'Urapakkam, Chennai',
      address: 'Sairam Nagar, Urapakkam, Chennai',
      bhk: '2 & 3 BHK Villa',
      budget: '₹ 52L Onwards',
      image: '/images/projectimg/KPN-Sai-Ram-Nagar.jpg',
      featuredImage: '/images/projectimg/KPN-Sai-Ram-Nagar.jpg',
      shortDescription: 'Modern gated community 2 & 3 BHK luxury villas with scenic landscaping and clubhouse.',
    },
    {
      name: 'KPN Grand',
      slug: 'kpn-grand',
      propertyType: 'Villas',
      status: 'Ongoing',
      city: 'Chennai',
      location: 'Karanaipuducheri, Chennai',
      address: 'KPN Grand, Karanaipuducheri, Chennai',
      bhk: '2 & 3 BHK Villa',
      budget: '₹ 58L Onwards',
      image: '/images/projectimg/KPN-GRAND.jpg',
      featuredImage: '/images/projectimg/KPN-GRAND.jpg',
      shortDescription: 'Royal 2, 3 & 4 BHK duplex villas offering unmatched luxury living in Karanaipuducheri.',
    },
  ];

  for (const vp of villaProjects) {
    let existing = await Project.findOne({ where: { slug: vp.slug } });
    if (!existing) {
      console.log(`Creating Villa project: ${vp.name}`);
      await Project.create({
        ...vp,
        isPublished: true,
        isFeatured: true,
      });
    }
  }

  // 2. Fetch all projects
  const allProjects = await Project.findAll();
  console.log(`Processing ${allProjects.length} projects...`);

  for (const proj of allProjects) {
    const pType = proj.propertyType;
    console.log(`Seeding inventory for [${pType}] ${proj.name} (${proj.slug})...`);

    if (pType === 'Apartments') {
      const blocks = generateApartmentBlocks(proj.name);
      let totalUnits = 0;
      let availUnits = 0;
      let bookedUnits = 0;
      let soldUnits = 0;

      blocks.forEach((b) => {
        b.floors.forEach((fl) => {
          fl.units.forEach((u) => {
            totalUnits++;
            if (u.status === 'available') availUnits++;
            else if (u.status === 'booked') bookedUnits++;
            else if (u.status === 'sold') soldUnits++;
          });
        });
      });

      proj.blocks = blocks;
      proj.plots = [];
      proj.totalBlocks = blocks.length;
      proj.totalFloors = Math.max(...blocks.map((b) => b.totalFloors));
      proj.totalUnits = totalUnits;
      proj.availableUnits = availUnits;
      proj.bookedUnits = bookedUnits;
      proj.soldUnits = soldUnits;
      proj.blockedUnits = 0;

      await proj.save();
    } else if (pType === 'Plots') {
      const plots = generatePlots(28);
      const totalUnits = plots.length;
      const availUnits = plots.filter((p) => p.status === 'available').length;
      const bookedUnits = plots.filter((p) => p.status === 'booked').length;
      const soldUnits = plots.filter((p) => p.status === 'sold').length;

      proj.blocks = [];
      proj.plots = plots;
      proj.totalBlocks = 1;
      proj.totalFloors = 1;
      proj.totalUnits = totalUnits;
      proj.availableUnits = availUnits;
      proj.bookedUnits = bookedUnits;
      proj.soldUnits = soldUnits;
      proj.blockedUnits = 0;

      await proj.save();
    } else if (pType === 'Villas') {
      const blocks = generateVillaBlocks();
      const plots = generateVillaPlots();

      let totalUnits = 0;
      let availUnits = 0;
      let bookedUnits = 0;
      let soldUnits = 0;

      blocks.forEach((b) => {
        b.floors.forEach((fl) => {
          fl.units.forEach((u) => {
            totalUnits++;
            if (u.status === 'available') availUnits++;
            else if (u.status === 'booked') bookedUnits++;
            else if (u.status === 'sold') soldUnits++;
          });
        });
      });

      proj.blocks = blocks;
      proj.plots = plots;
      proj.totalBlocks = blocks.length;
      proj.totalFloors = Math.max(...blocks.map((b) => b.totalFloors));
      proj.totalUnits = totalUnits;
      proj.availableUnits = availUnits;
      proj.bookedUnits = bookedUnits;
      proj.soldUnits = soldUnits;
      proj.blockedUnits = 0;

      await proj.save();
    }
  }

  console.log('Finished seeding comprehensive inventory for all apartments, plots, and villas!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
