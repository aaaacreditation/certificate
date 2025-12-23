import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Search certificates by organization name or certificate number
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get("q")

        if (!query || query.trim().length < 2) {
            return NextResponse.json(
                { error: "Search query must be at least 2 characters" },
                { status: 400 }
            )
        }

        const certificate = await prisma.certificate.findFirst({
            where: {
                AND: [
                    {
                        status: "ACTIVE", // Only return active certificates
                    },
                    {
                        OR: [
                            {
                                organizationName: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                certificateNumber: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                ],
            },
        })

        if (!certificate) {
            return NextResponse.json({ found: false, certificate: null })
        }

        return NextResponse.json({ found: true, certificate })
    } catch (error) {
        console.error("Error searching certificates:", error)
        return NextResponse.json(
            { error: "Failed to search certificates" },
            { status: 500 }
        )
    }
}
