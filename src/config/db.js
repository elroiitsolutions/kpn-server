import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'kpn_promoters';

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? false : false, // Clean console, toggle if debugging
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`[MySQL/phpMyAdmin] Connected successfully to '${dbName}' on ${dbHost}:${dbPort}`);
    // Sync tables automatically in development without dropping existing data
    await sequelize.sync({ alter: false });
    console.log(`[MySQL/phpMyAdmin] Database tables synchronized successfully.`);

    // Safely ensure recently added columns exist in MySQL without losing any data
    try {
      const [columns] = await sequelize.query("SHOW COLUMNS FROM `projects`");
      const existingColNames = new Set(columns.map((c) => c.Field));

      if (!existingColNames.has('projectArea')) {
        await sequelize.query("ALTER TABLE `projects` ADD COLUMN `projectArea` VARCHAR(150) DEFAULT ''");
        console.log("[Migration] Added missing 'projectArea' column to 'projects' table.");
      }

      if (!existingColNames.has('plotSizes')) {
        await sequelize.query("ALTER TABLE `projects` ADD COLUMN `plotSizes` VARCHAR(150) DEFAULT ''");
        console.log("[Migration] Added missing 'plotSizes' column to 'projects' table.");
      }
    } catch (migErr) {
      console.warn('[Migration Notice]:', migErr.message);
    }
  } catch (error) {
    console.error(`[MySQL Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

export default sequelize;
