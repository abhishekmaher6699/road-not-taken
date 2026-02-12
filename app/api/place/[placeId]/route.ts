import { NextResponse } from "next/server";
import  prisma  from "@/lib/db";
import { authSession } from "@/lib/auth-utils";



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
