import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/dbHelper";
import { decryptPayload } from "@/lib/crypto";

export async function POST(request) {
  try {
    const body = await request.json();
    let { username, password, payload } = body;

    if (payload) {
      const decrypted = decryptPayload(payload);
      if (decrypted && typeof decrypted === "object") {
        username = decrypted.username;
        password = decrypted.password;
      }
    }

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db.users?.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user.id || user._id, username: user.username },
      process.env.JWT_SECRET || "lucidmind_super_secret_key_change_this_in_production",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id || user._id,
        username: user.username,
        role: user.role || "admin",
      },
      token,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
