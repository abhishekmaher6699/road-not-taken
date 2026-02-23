import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";
import { authSession } from "@/lib/auth-utils";
import { addPinSchema } from "@/lib/schemas";


export async function DELETE(
    req: Request,
    context: { params: Promise<{ placeId: string }> }
) {
    try {
        const session = await authSession();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { placeId } = await context.params; // ✅ FIX HERE

        const place = await prisma.place.findUnique({
            where: { id: placeId },
            select: { createdById: true }
        });

        if (!place) {
            return NextResponse.json(
                { error: "Place not found" },
                { status: 404 }
            );
        }

        if (place.createdById !== session.user.id) {
            return NextResponse.json(
                { error: "Forbidden" },
                { status: 403 }
            );
        }

        await prisma.place.delete({
            where: { id: placeId }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to delete place" },
            { status: 500 }
        );
    }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ placeId: string }> }
) {
  try {
    const session = await authSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { placeId } = await context.params;

    const existingPlace = await prisma.place.findUnique({
      where: { id: placeId },
      select: { createdById: true },
    });

    if (!existingPlace) {
      return NextResponse.json(
        { error: "Place not found" },
        { status: 404 }
      );
    }

    if (existingPlace.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = addPinSchema.parse(body);

    // ✅ Batch transaction (NO interactive transaction)
    await prisma.$transaction([
      prisma.place.update({
        where: { id: placeId },
        data: {
          name: data.name,
          address: data.address,
          category: data.category,
          isActive: data.isActive,
        },
      }),

      prisma.placePreview.update({
        where: { placeId },
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          thumbnail: data.thumbnail,
        },
      }),

      prisma.placeDetails.update({
        where: { placeId },
        data: {
          description: data.description,
        },
      }),

      prisma.placeImage.deleteMany({
        where: { placeId },
      }),

      prisma.placeImage.createMany({
        data: data.images.map((url, index) => ({
          placeId,
          url,
          order: index,
        })),
      }),
    ]);

    // Fetch updated result
    const place = await prisma.place.findUnique({
      where: { id: placeId },
      include: {
        preview: true,
      },
    });

    if (!place) {
      return NextResponse.json(
        { error: "Failed to fetch updated place" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      place: {
        id: place.id,
        name: place.name,
        address: place.address,
        category: place.category,
        isActive: place.isActive,
        latitude: place.preview?.latitude,
        longitude: place.preview?.longitude,
        thumbnail: place.preview?.thumbnail,
        createdBy: place.createdById,
      },
    });

  } catch (error) {
    console.error("PUT /api/place error:", error);

    return NextResponse.json(
      { error: "Failed to update place" },
      { status: 500 }
    );
  }
}