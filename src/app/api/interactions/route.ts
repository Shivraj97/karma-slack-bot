import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const interactions = await db
      .collection("interactions")
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    // Convert MongoDB ObjectId to string and format date
    const formattedInteractions = interactions.map((interaction) => ({
      ...interaction,
      _id: interaction._id.toString(),
      timestamp: new Date(interaction.timestamp).toISOString(),
    }));

    return NextResponse.json(formattedInteractions);
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
