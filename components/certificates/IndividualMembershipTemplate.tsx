import { Certificate } from "@prisma/client"
import { formatCertificateDate } from "@/lib/utils"

interface Props {
    certificate: Certificate
}

export default function IndividualMembershipTemplate({ certificate }: Props) {
    return (
        <div
            id="certificate-template"
            className="w-[1000px] bg-white p-12 font-serif"
            style={{ aspectRatio: "1.414" }}
        >
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 italic mb-4">
                    Membership Certificate
                </h1>
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">
                        CERTIFICATE NO.
                    </span>
                    <span className="bg-blue-600 text-white px-6 py-1 text-lg font-mono">
                        {certificate.certificateNumber}
                    </span>
                </div>
            </div>

            {/* Logo Section */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4 border-2 border-slate-300 rounded-lg px-6 py-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-white to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-red-600">AAA</span>
                    </div>
                    <div className="text-left">
                        <span className="text-red-600 font-bold text-lg">A</span>
                        <span className="text-slate-800 font-bold text-lg">MERICAN</span>
                        <br />
                        <span className="text-red-600 font-bold text-lg">A</span>
                        <span className="text-slate-800 font-bold text-lg">CCREDITATION</span>
                        <br />
                        <span className="text-red-600 font-bold text-lg">A</span>
                        <span className="text-slate-800 font-bold text-lg">SSOCIATION</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-4 mb-8">
                <p className="text-xl text-slate-700">
                    American Accreditation Association - AAA
                </p>
                <p className="text-xl text-slate-700">Certifies that</p>

                {/* Organization Info */}
                <div className="space-y-3 py-4">
                    <div className="flex items-center justify-center gap-4">
                        <span className="bg-yellow-300 px-3 py-1 text-sm font-semibold text-slate-800">
                            Organization name
                        </span>
                        <span className="bg-blue-600 text-white px-8 py-2 min-w-[300px] text-lg">
                            {certificate.organizationName}
                        </span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                        <span className="bg-yellow-300 px-3 py-1 text-sm font-semibold text-slate-800">
                            Address
                        </span>
                        <span className="bg-blue-600 text-white px-8 py-2 min-w-[300px] text-lg">
                            {certificate.address}
                        </span>
                    </div>
                    {certificate.qualifications && (
                        <div className="flex items-center justify-center gap-4">
                            <span className="bg-yellow-300 px-3 py-1 text-sm font-semibold text-slate-800">
                                Qualifications
                            </span>
                            <span className="bg-blue-600 text-white px-8 py-2 min-w-[300px] text-lg">
                                {certificate.qualifications}
                            </span>
                        </div>
                    )}
                </div>

                {/* Membership Statement */}
                <div className="py-4">
                    <p className="text-lg text-slate-700">
                        Has gained the Individual Membership as Recognized Competency member on{" "}
                        <span className="bg-blue-600 text-white px-4 py-1 inline-block">
                            {certificate.membershipDate
                                ? formatCertificateDate(new Date(certificate.membershipDate))
                                : formatCertificateDate(new Date(certificate.issueDate))}
                        </span>
                    </p>
                    <p className="text-lg text-slate-700 mt-2">
                        That&apos;s valid for two years
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-12">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                            Issue Date:
                        </span>
                        <span className="bg-blue-600 text-white px-4 py-1">
                            {formatCertificateDate(new Date(certificate.issueDate))}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
                            Exp. Date:
                        </span>
                        <span className="bg-blue-600 text-white px-4 py-1">
                            {formatCertificateDate(new Date(certificate.expirationDate))}
                        </span>
                    </div>
                </div>

                {/* Signature */}
                <div className="text-center border-2 border-slate-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                        Executive Director
                    </p>
                    <div className="italic text-slate-600 text-lg mb-1">
                        William Moore
                    </div>
                    <div className="border-t border-slate-300 pt-1">
                        <span className="text-xs text-slate-500">William Moore</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
