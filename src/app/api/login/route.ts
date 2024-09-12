import { connection } from '@/db/config';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/userModels';

connection();

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response("Username and Password are required", { status: 401 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return new Response("Username does not exist", { status: 400 });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new Response("Incorrect Password", { status: 400 });
    }

    const tokenData = {
      username: user.username,
      id: user._id
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRETKEY as string, { expiresIn: '1d' });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error) {
    console.log("Error", error);
    return new Response("Something went wrong", { status: 500 });
  }
};
