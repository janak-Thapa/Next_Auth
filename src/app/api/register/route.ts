import { connection } from '@/db/config';
import User from '@/models/userModels';
import bcrypt from 'bcrypt';

// Establish the database connection
connection();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log(body);
    const { name, username, password } = body;

    // Check if all required fields are provided
    if (!name || !username || !password) {
      return new Response("Name, Username, and Password are required", { status: 400 });
    }

    // Check if the username already exists
    const user = await User.findOne({ username });
    if (user) {
      return new Response("Username already exists", { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response("User registered successfully", { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
