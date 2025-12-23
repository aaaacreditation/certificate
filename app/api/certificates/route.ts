import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateCertificateNumber, generatePublicSlug } from "@/lib/utils"
import { CertificateType } from "@prisma/client"

// GET - List all certificates with filtering
export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const type = searchParams.get("type") as CertificateType | null
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
        if (!type || !organizationName || !address || !issueDate || !expirationDate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Generate unique certificate number and public slug
        const certificateNumber = generateCertificateNumber(type as CertificateType)
        const publicSlug = generatePublicSlug()

        const certificate = await prisma.certificate.create({
            data: {
                certificateNumber,
                publicSlug,
                type: type as CertificateType,
                organizationName,
                address,
                issueDate: new Date(issueDate),
                expirationDate: new Date(expirationDate),
                qualifications,
                membershipDate: membershipDate ? new Date(membershipDate) : null,
                accreditedAs,
                scope,
                issueNo,
                initialAccreditationDate: initialAccreditationDate
                    ? new Date(initialAccreditationDate)
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
