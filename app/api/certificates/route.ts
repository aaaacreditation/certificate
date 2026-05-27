import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateCertificateNumber, generatePublicSlug } from "@/lib/utils"
import { CertificateType } from "@prisma/client"

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

// GET - List all certificates with filtering
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const rawType = searchParams.get("type")
        const type = Object.values(CertificateType).includes(rawType as CertificateType)
            ? (rawType as CertificateType)
            : null
        const status = searchParams.get("status")
        const search = searchParams.get("search")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")

        const where: Record<string, unknown> = {}

        if (type) where.type = type
        if (status) where.status = status
        if (search) {
            where.OR = [
                { organizationName: { contains: search, mode: "insensitive" } },
                { certificateNumber: { contains: search, mode: "insensitive" } },
            ]
        }

        const [certificates, total] = await Promise.all([
            prisma.certificate.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.certificate.count({ where }),
        ])

        return NextResponse.json({
            certificates,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error("Error fetching certificates:", error)
        return NextResponse.json(
            { error: "Failed to fetch certificates" },
            { status: 500 }
        )
    }
}

// POST - Create a new certificate
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

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
        } = body

        // Validate required fields
        const certificateType = Object.values(CertificateType).includes(type)
            ? (type as CertificateType)
            : null
        const cleanedOrganizationName = cleanString(organizationName)
        const cleanedAddress = cleanString(address)
        const parsedIssueDate = parseDate(issueDate)
        const parsedExpirationDate = parseDate(expirationDate)

        if (!certificateType || !cleanedOrganizationName || !cleanedAddress || !parsedIssueDate || !parsedExpirationDate) {
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

        // Generate unique certificate number and public slug
        const certificateNumber = generateCertificateNumber(certificateType)
        const publicSlug = generatePublicSlug(cleanedOrganizationName)

        const certificate = await prisma.certificate.create({
            data: {
                certificateNumber,
                publicSlug,
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
                status: "ACTIVE",
            },
        })

        return NextResponse.json(certificate, { status: 201 })
    } catch (error) {
        console.error("Error creating certificate:", error)
        return NextResponse.json(
            { error: "Failed to create certificate" },
            { status: 500 }
        )
    }
}
