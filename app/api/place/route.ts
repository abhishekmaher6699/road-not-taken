import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import { authSession } from '@/lib/auth-utils';
import { addPinSchema } from '@/lib/schemas';

export async function POST(req:NextRequest) {
    try {
        const session = await authSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json()
        const data = addPinSchema.parse(body)

        console.log(data)

        return NextResponse.json({ message: "Place created successfully", data }, { status: 201 });

    } catch (error) {
        console.error("Error in /api/place route:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}