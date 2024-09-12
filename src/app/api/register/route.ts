import { connection } from '@/db/config';
import User from '@/models/userModels';
import bcrypt from 'bcrypt';

connection();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log(body);
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return new Response("Name, Username, and Password are required", { status: 400 });
    }

    
    const user = await User.findOne({ username });
    if (user) {
      return new Response("Username already exists", { status: 400 });
    }


    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    
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
