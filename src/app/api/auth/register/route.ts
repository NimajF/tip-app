import connectDB from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const { username, email, password, role } = data;
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      name: "",
      password: hashedPassword,
      role,
    });
    return NextResponse.json({ message: "User created successfully", newUser });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
