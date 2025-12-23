"use client"

import { Certificate } from "@prisma/client"
import IndividualMembershipTemplate from "@/components/certificates/IndividualMembershipTemplate"
import AccreditationTemplate from "@/components/certificates/AccreditationTemplate"
import OrganizationalMembershipTemplate from "@/components/certificates/OrganizationalMembershipTemplate"

interface Props {
    certificate: Certificate
}

export default function CertificatePreview({ certificate }: Props) {
    const renderTemplate = () => {
        switch (certificate.type) {
            case "INDIVIDUAL_MEMBERSHIP":
                return <IndividualMembershipTemplate certificate={certificate} />
            case "ACCREDITATION":
                return <AccreditationTemplate certificate={certificate} />
            case "ORGANIZATIONAL_MEMBERSHIP":
                return <OrganizationalMembershipTemplate certificate={certificate} />
            default:
                return null
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Certificate Preview
            </h2>
            <div className="overflow-x-auto">
                <div className="inline-block" style={{ transform: "scale(0.6)", transformOrigin: "top left" }}>
                    {renderTemplate()}
                </div>
            </div>
        </div>
    )
}
