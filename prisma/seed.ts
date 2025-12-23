import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create admin user
    const hashedPassword = await hash('admin123', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@aaa.org' },
        update: {},
        create: {
            email: 'admin@aaa.org',
            name: 'AAA Administrator',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    })

    console.log('✅ Created admin user:', admin.email)

    // Create sample certificates
    const sampleCertificates = [
        {
            certificateNumber: 'AAA-IM-2024-DEMO01',
            type: 'INDIVIDUAL_MEMBERSHIP' as const,
            organizationName: 'John Smith Consulting',
            address: '123 Business Ave, New York, NY 10001',
            qualifications: 'Certified Management Consultant',
            issueDate: new Date('2024-01-15'),
            expirationDate: new Date('2026-01-15'),
            membershipDate: new Date('2024-01-15'),
            publicSlug: 'demo-individual-001',
            status: 'ACTIVE' as const,
        },
        {
            certificateNumber: 'AAA-AC-2024-DEMO02',
            type: 'ACCREDITATION' as const,
            organizationName: 'Excellence Labs Inc.',
            address: '456 Innovation Blvd, San Francisco, CA 94102',
            accreditedAs: 'ISO 17025:2017',
            scope: 'Chemical Testing Laboratory',
            issueNo: '001',
            issueDate: new Date('2024-03-01'),
            expirationDate: new Date('2027-03-01'),
            initialAccreditationDate: new Date('2024-03-01'),
            publicSlug: 'demo-accreditation-001',
            status: 'ACTIVE' as const,
        },
        {
            certificateNumber: 'AAA-OM-2024-DEMO03',
            type: 'ORGANIZATIONAL_MEMBERSHIP' as const,
            organizationName: 'Global Tech Solutions',
            address: '789 Enterprise Way, Austin, TX 78701',
            issueDate: new Date('2024-06-01'),
            expirationDate: new Date('2025-06-01'),
            membershipDate: new Date('2024-06-01'),
            publicSlug: 'demo-organizational-001',
            status: 'ACTIVE' as const,
        },
    ]

    for (const cert of sampleCertificates) {
        await prisma.certificate.upsert({
            where: { certificateNumber: cert.certificateNumber },
            update: {},
            create: cert,
        })
        console.log('✅ Created certificate:', cert.certificateNumber)
    }

    console.log('🎉 Seeding completed!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
