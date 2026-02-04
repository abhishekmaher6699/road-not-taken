import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { authSession } from "@/lib/auth-utils";
import { addPinSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const session = await authSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = addPinSchema.parse(body);

    const place = await prisma.$transaction(async (tx) => {
      // --- Place ---
      const place = await tx.place.create({
        data: {
          name: data.name,
          address: data.address,
          category: data.category,
          isActive: data.isActive,
          createdById: session.user.id,
        },
      });

      // --- Preview ---
      await tx.placePreview.create({
        data: {
          placeId: place.id,
          latitude: data.latitude,
          longitude: data.longitude,
          thumbnail: data.thumbnail,
        },
      });

      // --- Details ---
      await tx.placeDetails.create({
        data: {
          placeId: place.id,
          description: data.description,
        },
      });

      // --- Images ---
      if (data.images.length > 0) {
        await tx.placeImage.createMany({
          data: data.images.map((url, index) => ({
            placeId: place.id,
            url,
            order: index,
          })),
        });
      }

      return place;
    });

    console.log("Created place:", place);

    return NextResponse.json(
      { message: "Place created successfully", place },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in /api/place route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        isActive: true,
        preview: {
          select: {
            latitude: true,
            longitude: true,
            thumbnail: true,
          },
        },
      },
    });

    // 🔑 flatten shape for frontend
    const previews = places
      .filter((p) => p.preview) // safety
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        isActive: p.isActive,
        latitude: p.preview!.latitude,
        longitude: p.preview!.longitude,
        thumbnail: p.preview!.thumbnail,
      }));

    return NextResponse.json(previews);
  } catch (error) {
    console.error("GET /api/place error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 },
    );
  }
}
