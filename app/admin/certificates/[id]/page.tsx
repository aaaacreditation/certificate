import { notFound } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { formatCertificateDate, getCertificateTypeName } from "@/lib/utils"
import {
    ArrowLeft,
    Edit,
    ExternalLink,
    Calendar,
    Building2,
    MapPin,
    FileText,
    Award,
} from "lucide-react"
import CertificateActions from "./CertificateActions"
import CertificatePreview from "./CertificatePreview"
import CopyLinkButton from "./CopyLinkButton"
import QuickActionsButtons from "./QuickActionsButtons"

export default async function CertificateDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const certificate = await prisma.certificate.findUnique({
        where: { id },
    })

    if (!certificate) {
        notFound()
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/certificate/${certificate.publicSlug}`

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link
                        href="/admin/certificates"
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to certificates
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {certificate.organizationName}
                    </h1>
                    <p className="text-slate-500">{certificate.certificateNumber}</p>
                </div>
                <CertificateActions certificate={certificate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Certificate Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">Status</h2>
                            <span
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${certificate.status === "ACTIVE"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : certificate.status === "PAUSED"
                                        ? "bg-amber-100 text-amber-700"
                                        : certificate.status === "EXPIRED"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {certificate.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${certificate.type === "INDIVIDUAL_MEMBERSHIP"
                                    ? "bg-purple-100 text-purple-700"
                                    : certificate.type === "ACCREDITATION"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-cyan-100 text-cyan-700"
                                    }`}
                            >
                                {getCertificateTypeName(certificate.type)}
                            </span>
                        </div>
                    </div>

                    {/* Certificate Info */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-900 mb-6">
                            Certificate Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Building2 className="w-4 h-4" />
                                        Organization Name
                                    </label>
                                    <p className="font-medium text-slate-900">
                                        {certificate.organizationName}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <MapPin className="w-4 h-4" />
                                        Address
                                    </label>
                                    <p className="font-medium text-slate-900">
                                        {certificate.address}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Issue Date
                                    </label>
                                    <p className="font-medium text-slate-900">
                                        {formatCertificateDate(new Date(certificate.issueDate))}
                                    </p>
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        Expiration Date
                                    </label>
                                    <p className="font-medium text-slate-900">
                                        {formatCertificateDate(new Date(certificate.expirationDate))}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {certificate.qualifications && (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <FileText className="w-4 h-4" />
                                            Qualifications
                                        </label>
                                        <p className="font-medium text-slate-900">
                                            {certificate.qualifications}
                                        </p>
                                    </div>
                                )}
                                {certificate.accreditedAs && (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <Award className="w-4 h-4" />
                                            Accredited As
                                        </label>
                                        <p className="font-medium text-slate-900">
                                            {certificate.accreditedAs}
                                        </p>
                                    </div>
                                )}
                                {certificate.scope && (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <FileText className="w-4 h-4" />
                                            Scope
                                        </label>
                                        <p className="font-medium text-slate-900">
                                            {certificate.scope}
                                        </p>
                                    </div>
                                )}
                                {certificate.membershipDate && (
                                    <div>
                                        <label className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                            <Calendar className="w-4 h-4" />
                                            Membership Date
                                        </label>
                                        <p className="font-medium text-slate-900">
                                            {formatCertificateDate(new Date(certificate.membershipDate))}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Public Link */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">
                            Public Certificate Link
                        </h3>
                        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2 mb-3">
                            <input
                                type="text"
                                value={publicUrl}
                                readOnly
                                className="flex-1 bg-transparent text-sm text-slate-600 outline-none truncate"
                            />
                            <CopyLinkButton url={publicUrl} />
                        </div>
                        <Link
                            href={publicUrl}
                            target="_blank"
                            className="flex items-center justify-center gap-2 w-full py-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors font-medium text-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Open Public View
                        </Link>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <Link
                                href={`/admin/certificates/${certificate.id}/edit`}
                                className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                            >
                                <Edit className="w-5 h-5" />
                                <span className="font-medium">Edit Certificate</span>
                            </Link>
                            <QuickActionsButtons certificate={certificate} />
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900 mb-4">
                            Record Info
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Created</span>
                                <span className="text-slate-700">
                                    {new Date(certificate.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Last Updated</span>
                                <span className="text-slate-700">
                                    {new Date(certificate.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificate Preview */}
            <CertificatePreview certificate={certificate} />
        </div>
    )
}
