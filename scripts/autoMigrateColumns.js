import { sequelize } from '../src/config/db.js';

async function runColumnMigration() {
  try {
    console.log('[Migration] Connecting to MySQL database...');
    await sequelize.authenticate();
    console.log('[Migration] Database connected successfully.');

    const [columns] = await sequelize.query('SHOW COLUMNS FROM `projects`');
    const existingColNames = new Set(columns.map((c) => c.Field));

    let modifiedCount = 0;

    if (!existingColNames.has('projectArea')) {
      console.log("[Migration] Adding missing column 'projectArea' to 'projects'...");
      await sequelize.query("ALTER TABLE `projects` ADD COLUMN `projectArea` VARCHAR(150) DEFAULT '' AFTER `pricePerSqFt`");
      console.log("[Migration] Successfully added 'projectArea'.");
      modifiedCount++;
    } else {
      console.log("[Migration] Column 'projectArea' already exists in 'projects'.");
    }

    if (!existingColNames.has('plotSizes')) {
      console.log("[Migration] Adding missing column 'plotSizes' to 'projects'...");
      await sequelize.query("ALTER TABLE `projects` ADD COLUMN `plotSizes` VARCHAR(150) DEFAULT '' AFTER `projectArea`");
      console.log("[Migration] Successfully added 'plotSizes'.");
      modifiedCount++;
    } else {
      console.log("[Migration] Column 'plotSizes' already exists in 'projects'.");
    }

    if (modifiedCount === 0) {
      console.log('[Migration] All project columns are up to date! No changes needed.');
    } else {
      console.log(`[Migration] Completed successfully with ${modifiedCount} columns added.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('[Migration Error]:', error.message);
    process.exit(1);
  }
}

runColumnMigration();
