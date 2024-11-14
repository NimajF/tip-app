import connectDB from "@/libs/mongodb";
import Owner from "@/models/owner";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const { username, password } = await data;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    return NextResponse.json({
      message: "Login successful",
      user: existingUser,
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
