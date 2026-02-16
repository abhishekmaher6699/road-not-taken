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
  const { placeId } = await context.params;
  const body = await req.json();
  const data = addPinSchema.parse(body);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.place.update({
      where: { id: placeId },
      data: {
        name: data.name,
        address: data.address,
        category: data.category,
        isActive: data.isActive,
      },
    });

    await tx.placePreview.update({
      where: { placeId },
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        thumbnail: data.thumbnail,
      },
    });

    await tx.placeDetails.update({
      where: { placeId },
      data: { description: data.description },
    });

    await tx.placeImage.deleteMany({
      where: { placeId },
    });

    await tx.placeImage.createMany({
      data: data.images.map((url, i) => ({
        placeId,
        url,
        order: i,
      })),
    });

    const place = await tx.place.findUnique({
      where: { id: placeId },
      include: { preview: true },
    });

    return {
      id: place!.id,
      name: place!.name,
      address: place!.address,
      category: place!.category,
      isActive: place!.isActive,
      latitude: place!.preview!.latitude,
      longitude: place!.preview!.longitude,
      thumbnail: place!.preview!.thumbnail,
      createdBy: place!.createdById,
    };
  });

  return Response.json({ place: updated });
}