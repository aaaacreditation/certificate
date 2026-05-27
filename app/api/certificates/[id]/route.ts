import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { CertificateType } from "@prisma/client"
import { generatePublicSlug } from "@/lib/utils"

function cleanString(value: unknown): string | null {
    if (typeof value !== "string") return null

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
}

function parseDate(value: unknown): Date | null {
    if (typeof value !== "string" || value.trim().length === 0) return null

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

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

        const existingCertificate = await prisma.certificate.findUnique({
            where: { id },
            select: { organizationName: true, type: true }
        })

        if (!existingCertificate) {
            return NextResponse.json(
                { error: "Certificate not found" },
                { status: 404 }
            )
        }

        const certificateType = Object.values(CertificateType).includes(type)
            ? (type as CertificateType)
            : existingCertificate.type
        const cleanedOrganizationName = cleanString(organizationName)
        const cleanedAddress = cleanString(address)
        const parsedIssueDate = parseDate(issueDate)
        const parsedExpirationDate = parseDate(expirationDate)

        if (!cleanedOrganizationName || !cleanedAddress || !parsedIssueDate || !parsedExpirationDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        if (parsedExpirationDate <= parsedIssueDate) {
            return NextResponse.json(
                { error: "Expiration date must be after the issue date" },
                { status: 400 }
            )
        }

        const cleanedAccreditedAs = cleanString(accreditedAs)
        const cleanedScope = cleanString(scope)

        if (certificateType === "ACCREDITATION" && (!cleanedAccreditedAs || !cleanedScope)) {
            return NextResponse.json(
                { error: "Accredited as and scope are required for accreditation certificates" },
                { status: 400 }
            )
        }

        // Regenerate slug if organization name changed
        const newSlug = cleanedOrganizationName !== existingCertificate.organizationName
            ? generatePublicSlug(cleanedOrganizationName)
            : undefined

        const certificate = await prisma.certificate.update({
            where: { id },
            data: {
                type: certificateType,
                organizationName: cleanedOrganizationName,
                address: cleanedAddress,
                issueDate: parsedIssueDate,
                expirationDate: parsedExpirationDate,
                qualifications: certificateType === "INDIVIDUAL_MEMBERSHIP" ? cleanString(qualifications) : null,
                membershipDate: certificateType !== "ACCREDITATION" ? parseDate(membershipDate) : null,
                accreditedAs: certificateType === "ACCREDITATION" ? cleanedAccreditedAs : null,
                scope: certificateType !== "INDIVIDUAL_MEMBERSHIP" ? cleanedScope : null,
                issueNo: certificateType !== "INDIVIDUAL_MEMBERSHIP" ? cleanString(issueNo) : null,
                initialAccreditationDate: certificateType === "ACCREDITATION"
                    ? parseDate(initialAccreditationDate)
                    : null,
                status,
                ...(newSlug && { publicSlug: newSlug }),
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
