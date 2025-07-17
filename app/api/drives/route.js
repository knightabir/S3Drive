import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Drive from "@/lib/driveModel";
import User from "@/lib/userModel";

export async function GET(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.error("GET /api/drives: Unauthorized - No session or email", { session });
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.error("GET /api/drives: User not found", { email: session.user.email });
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    // Only return drives with the required fields
    const drives = await Drive.find({ user: user._id }).select("bucketName accessKeyId secretAccessKey region");
    return new Response(JSON.stringify(drives), { status: 200 });
  } catch (err) {
    console.error("GET /api/drives: Error occurred", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      console.error("POST /api/drives: Unauthorized - No session or email", { session });
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      console.error("POST /api/drives: User not found", { email: session.user.email });
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    const body = await req.json();
    const { bucketName, accessKeyId, secretAccessKey, region } = body;
    if (!bucketName || !accessKeyId || !secretAccessKey || !region) {
      console.error("POST /api/drives: Missing required fields", { body });
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
    try {
      const drive = await Drive.create({
        user: user._id,
        bucketName,
        accessKeyId,
        secretAccessKey,
        region,
        // name, logo, plan are omitted as per prompt
      });
      // Only return the required fields in the response
      const responseDrive = {
        _id: drive._id,
        bucketName: drive.bucketName,
        accessKeyId: drive.accessKeyId,
        secretAccessKey: drive.secretAccessKey,
        region: drive.region,
      };
      return new Response(JSON.stringify(responseDrive), { status: 201 });
    } catch (err) {
      console.error("POST /api/drives: Error creating drive", err);
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  } catch (err) {
    console.error("POST /api/drives: Unexpected error", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
} 