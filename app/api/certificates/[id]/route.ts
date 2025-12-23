import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CertificateType } from "@prisma/client"

// GET - Get a single certificate
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const certificate = await prisma.certificate.findUnique({
            where: { id },
        })

        if (!certificate) {
            return NextResponse.json(
                { error: "Certificate not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(certificate)
    } catch (error) {
        console.error("Error fetching certificate:", error)
        return NextResponse.json(
            { error: "Failed to fetch certificate" },
            { status: 500 }
        )
    }
}

// PUT - Update a certificate
export async function PUT(
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

        const {
            type,
            organizationName,
            address,
            issueDate,
            expirationDate,
            qualifications,
            membershipDate,
            accreditedAs,
            scope,
            issueNo,
            initialAccreditationDate,
            status,
        } = body

        const certificate = await prisma.certificate.update({
            where: { id },
            data: {
                type: type as CertificateType,
                organizationName,
                address,
                issueDate: issueDate ? new Date(issueDate) : undefined,
                expirationDate: expirationDate ? new Date(expirationDate) : undefined,
                qualifications,
                membershipDate: membershipDate ? new Date(membershipDate) : null,
                accreditedAs,
                scope,
                issueNo,
                initialAccreditationDate: initialAccreditationDate
                    ? new Date(initialAccreditationDate)
                    : null,
                status,
            },
        })

        return NextResponse.json(certificate)
    } catch (error) {
        console.error("Error updating certificate:", error)
        return NextResponse.json(
            { error: "Failed to update certificate" },
            { status: 500 }
        )
    }
}

// DELETE - Delete a certificate
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await params

        await prisma.certificate.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting certificate:", error)
        return NextResponse.json(
            { error: "Failed to delete certificate" },
            { status: 500 }
        )
    }
}
