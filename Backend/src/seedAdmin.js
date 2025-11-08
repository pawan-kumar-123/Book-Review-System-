import connectDB from "./db/DB.js";
import { Admin } from "./models/admin.models.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const seedAdmin = async () => {
    try {
        await connectDB();
        console.log("Connected to database");

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ userName: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        // Create admin user
        const admin = await Admin.create({
            userName: "admin",
            email: "admin@bookreview.com",
            password: "Admin@12345",
            role: "admin"
        });

        console.log("Admin user created successfully:", {
            userName: admin.userName,
            email: admin.email,
            role: admin.role
        });

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
