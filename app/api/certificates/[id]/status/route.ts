import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CertificateStatus } from "@prisma/client"

// PATCH - Toggle certificate status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { status } = body as { status: CertificateStatus }

        if (!status || !["ACTIVE", "PAUSED", "EXPIRED", "REVOKED"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            )
        }

        const certificate = await prisma.certificate.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(certificate)
    } catch (error) {
        console.error("Error updating certificate status:", error)
        return NextResponse.json(
            { error: "Failed to update certificate status" },
            { status: 500 }
        )
    }
}
