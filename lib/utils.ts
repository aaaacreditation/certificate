import { CertificateType } from "@prisma/client"
import { nanoid } from "nanoid"

/**
 * Generate a unique certificate number based on type
 * Format: AAA-{TYPE_PREFIX}-{YEAR}-{UNIQUE_ID}
 */
export function generateCertificateNumber(type: CertificateType): string {
    const year = new Date().getFullYear()
    const uniqueId = nanoid(6).toUpperCase()

    const prefixMap: Record<CertificateType, string> = {
        INDIVIDUAL_MEMBERSHIP: "IM",
        ACCREDITATION: "AC",
        ORGANIZATIONAL_MEMBERSHIP: "OM",
    }

    return `AAA-${prefixMap[type]}-${year}-${uniqueId}`
}

/**
 * Generate a unique public slug for certificate URLs
 */
export function generatePublicSlug(): string {
    return nanoid(12)
}

/**
 * Format date for display on certificate
 */
export function formatCertificateDate(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date)
}

/**
 * Format date for form inputs (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date): string {
    return date.toISOString().split("T")[0]
}

/**
 * Get certificate type display name
 */
export function getCertificateTypeName(type: CertificateType): string {
    const names: Record<CertificateType, string> = {
        INDIVIDUAL_MEMBERSHIP: "Individual Membership",
        ACCREDITATION: "Accreditation",
        ORGANIZATIONAL_MEMBERSHIP: "Organizational Membership",
    }
    return names[type]
}

/**
 * Calculate expiration date based on certificate type
 */
export function calculateExpirationDate(
    issueDate: Date,
    type: CertificateType
): Date {
    const expDate = new Date(issueDate)

    switch (type) {
        case "INDIVIDUAL_MEMBERSHIP":
            expDate.setFullYear(expDate.getFullYear() + 2) // 2 years
            break
        case "ORGANIZATIONAL_MEMBERSHIP":
            expDate.setFullYear(expDate.getFullYear() + 1) // 1 year
            break
        case "ACCREDITATION":
            expDate.setFullYear(expDate.getFullYear() + 3) // 3 years
            break
    }

    return expDate
}
