import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Award, Users, Pause, CheckCircle, FileText } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
    const session = await auth()

    // Get certificate statistics
    const [totalCerts, activeCerts, pausedCerts, byType] = await Promise.all([
        prisma.certificate.count(),
        prisma.certificate.count({ where: { status: "ACTIVE" } }),
        prisma.certificate.count({ where: { status: "PAUSED" } }),
        prisma.certificate.groupBy({
            by: ["type"],
            _count: true,
        }),
    ])

    // Get recent certificates
    const recentCertificates = await prisma.certificate.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
    })

    const stats = [
        {
            name: "Total Certificates",
            value: totalCerts,
            icon: Award,
            color: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-600",
        },
        {
            name: "Active",
            value: activeCerts,
            icon: CheckCircle,
            color: "from-emerald-500 to-teal-600",
            bgColor: "bg-emerald-500/10",
            textColor: "text-emerald-600",
        },
        {
            name: "Paused",
            value: pausedCerts,
            icon: Pause,
            color: "from-amber-500 to-orange-600",
            bgColor: "bg-amber-500/10",
            textColor: "text-amber-600",
        },
    ]

    const typeNames: Record<string, string> = {
        INDIVIDUAL_MEMBERSHIP: "Individual Membership",
        ACCREDITATION: "Accreditation",
        ORGANIZATIONAL_MEMBERSHIP: "Organizational Membership",
    }

    return (
        <div className="space-y-8">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {session?.user?.name || "Administrator"}!
                </h1>
                <p className="text-blue-100">
                    Manage your accreditation certificates from this dashboard.
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.name}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">{stat.name}</p>
                                <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                            <div
                                className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center`}
                            >
                                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certificates by Type */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Certificates by Type
                    </h2>
                    <div className="space-y-4">
                        {byType.map((item) => (
                            <div key={item.type} className="flex items-center justify-between">
                                <span className="text-slate-600">{typeNames[item.type]}</span>
                                <span className="text-2xl font-bold text-slate-900">
                                    {item._count}
                                </span>
                            </div>
                        ))}
                        {byType.length === 0 && (
                            <p className="text-slate-400 text-center py-4">
                                No certificates yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Certificates */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Award className="w-5 h-5 text-slate-400" />
                            Recent Certificates
                        </h2>
                        <Link
                            href="/admin/certificates"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentCertificates.map((cert) => (
                            <Link
                                key={cert.id}
                                href={`/admin/certificates/${cert.id}`}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-900 truncate">
                                        {cert.organizationName}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {cert.certificateNumber}
                                    </p>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${cert.status === "ACTIVE"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : cert.status === "PAUSED"
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                >
                                    {cert.status}
                                </span>
                            </Link>
                        ))}
                        {recentCertificates.length === 0 && (
                            <div className="text-center py-8">
                                <Award className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-400">No certificates yet</p>
                                <Link
                                    href="/admin/certificates/new"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Create your first certificate
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                        href="/admin/certificates/new"
                        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all group"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">New Certificate</p>
                            <p className="text-sm text-blue-100">Issue a new certificate</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/certificates"
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all group"
                    >
                        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">View All</p>
                            <p className="text-sm text-slate-500">Manage certificates</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all group"
                    >
                        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">Settings</p>
                            <p className="text-sm text-slate-500">Configure system</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
