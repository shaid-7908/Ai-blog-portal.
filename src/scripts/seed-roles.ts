import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.connection';
import { RoleModel } from '../model/role.model';

const seedRoles = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Read the roles JSON file
        const rolesFilePath = path.join(__dirname, '../../assets/role.json');
        const rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf-8'));

        console.log(`Starting migration for ${rolesData.length} roles...`);

        // Insert or update roles
        for (const role of rolesData) {
            // Upsert based on roleDisplayName so running this script multiple times won't create duplicates
            await RoleModel.findOneAndUpdate(
                { roleDisplayName: role.roleDisplayName },
                {
                    $set: {
                        roleGroup: role.roleGroup,
                        isDeleted: role.isDeleted,
                        isActive: role.isActive
                    }
                },
                { upsert: true, new: true }
            );
            console.log(`✓ Upserted role: ${role.roleDisplayName}`);
        }

        console.log('Role migration completed successfully!');
    } catch (error) {
        console.error('Error migrating roles:', error);
    } finally {
        // Disconnect from the database
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected.');
        }
        process.exit(0);
    }
};

// Run the migration
seedRoles();
