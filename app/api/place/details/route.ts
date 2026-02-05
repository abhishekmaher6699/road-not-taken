import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";


export async function GET(req: NextRequest) {

    try {
        const { searchParams } = new URL(req.url);
        const placeId = searchParams.get("id");

        if (!placeId) {
            return NextResponse.json(
                {error: "Missing place id"},
                {status: 400}
            )
        }

        const details = await prisma.placeDetails.findUnique({
            where: { placeId},
            select: {
                description: true
            }
        })
        
        const images = await prisma.placeImage.findMany({
            where: {placeId},
            select: {
                id: true,
                url: true,
                order: true
            },
            orderBy: {order: "asc"}
        })

        return NextResponse.json({
            description: details?.description ?? null,
            images,
        })
    } catch (error) {
    console.error("GET /api/place/detail error:", error);
    return NextResponse.json(
        {error: "Internal Server Error"},
        {status: 500}
    )
    }

}