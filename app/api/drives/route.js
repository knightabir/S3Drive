import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Drive from "@/lib/driveModel";
import User from "@/lib/userModel";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function GET(req) {
  const url = new URL(req.url);
  const prefix = url.searchParams.get("prefix") || "";
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
    // If prefix param is present, list S3 objects for the first drive
    if (prefix !== null && drives.length > 0) {
      const drive = drives[0]; // For now, use the first drive
      const s3 = new S3Client({
        region: drive.region,
        credentials: {
          accessKeyId: drive.accessKeyId,
          secretAccessKey: drive.secretAccessKey,
        },
      });
      try {
        const command = new ListObjectsV2Command({
          Bucket: drive.bucketName,
          Prefix: prefix,
          Delimiter: "/",
        });
        const data = await s3.send(command);
        const folders = (data.CommonPrefixes || []).map((p) => ({
          name: p.Prefix.replace(prefix, "").replace(/\/$/, ""),
          prefix: p.Prefix,
        }));
        const files = (data.Contents || [])
          .filter((f) => f.Key !== prefix) // Exclude the folder itself
          .map((f) => ({
            name: f.Key.replace(prefix, ""),
            key: f.Key,
            size: f.Size,
            lastModified: f.LastModified,
          }));
        return new Response(JSON.stringify({ folders, files }), { status: 200 });
      } catch (err) {
        console.error("GET /api/drives: S3 list error", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }
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