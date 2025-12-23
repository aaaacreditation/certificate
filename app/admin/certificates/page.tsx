"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
    Search,
    Filter,
    Plus,
    Eye,
    Edit,
    Trash2,
    Pause,
    Play,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Award,
    Loader2,
} from "lucide-react"
import { Certificate, CertificateType, CertificateStatus } from "@prisma/client"

const typeLabels: Record<CertificateType, string> = {
    INDIVIDUAL_MEMBERSHIP: "Individual Membership",
    ACCREDITATION: "Accreditation",
    ORGANIZATIONAL_MEMBERSHIP: "Organizational Membership",
}

const typeColors: Record<CertificateType, string> = {
    INDIVIDUAL_MEMBERSHIP: "bg-purple-100 text-purple-700",
    ACCREDITATION: "bg-blue-100 text-blue-700",
    ORGANIZATIONAL_MEMBERSHIP: "bg-cyan-100 text-cyan-700",
}

const statusColors: Record<CertificateStatus, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PAUSED: "bg-amber-100 text-amber-700",
    EXPIRED: "bg-red-100 text-red-700",
    REVOKED: "bg-slate-100 text-slate-700",
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [typeFilter, setTypeFilter] = useState<CertificateType | "">("")
    const [statusFilter, setStatusFilter] = useState<CertificateStatus | "">("")
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        limit: 10,
    })
    const [deleteModal, setDeleteModal] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchCertificates = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.set("page", page.toString())
            if (search) params.set("search", search)
            if (typeFilter) params.set("type", typeFilter)
            if (statusFilter) params.set("status", statusFilter)

            const res = await fetch(`/api/certificates?${params}`)
            const data = await res.json()
            setCertificates(data.certificates)
            setPagination(data.pagination)
        } catch (error) {
            console.error("Failed to fetch certificates:", error)
        } finally {
            setLoading(false)
        }
    }, [page, search, typeFilter, statusFilter])

    useEffect(() => {
        fetchCertificates()
    }, [fetchCertificates])

    const handleStatusToggle = async (id: string, currentStatus: CertificateStatus) => {
        setActionLoading(id)
        try {
            const newStatus = currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE"
            await fetch(`/api/certificates/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            fetchCertificates()
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setActionLoading(null)
        }
    }

    const handleDelete = async (id: string) => {
        setActionLoading(id)
        try {
            await fetch(`/api/certificates/${id}`, { method: "DELETE" })
            setDeleteModal(null)
            fetchCertificates()
        } catch (error) {
            console.error("Failed to delete certificate:", error)
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Certificates</h1>
                    <p className="text-slate-500 mt-1">
                        Manage all issued certificates
                    </p>
                </div>
                <Link
                    href="/admin/certificates/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                    <Plus className="w-5 h-5" />
                    New Certificate
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by organization or certificate number..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <select
                                value={typeFilter}
                                onChange={(e) => {
                                    setTypeFilter(e.target.value as CertificateType | "")
                                    setPage(1)
                                }}
                                className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                            >
                                <option value="">All Types</option>
                                <option value="INDIVIDUAL_MEMBERSHIP">Individual Membership</option>
                                <option value="ACCREDITATION">Accreditation</option>
                                <option value="ORGANIZATIONAL_MEMBERSHIP">Organizational Membership</option>
                            </select>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value as CertificateStatus | "")
                                setPage(1)
                            }}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PAUSED">Paused</option>
                            <option value="EXPIRED">Expired</option>
                            <option value="REVOKED">Revoked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Award className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-slate-500 mb-4">No certificates found</p>
                        <Link
                            href="/admin/certificates/new"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create your first certificate
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Certificate
                                        </th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Type
                                        </th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Issue Date
                                        </th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Expiration
                                        </th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                                            Status
                                        </th>
                                        <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {certificates.map((cert) => (
                                        <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {cert.organizationName}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {cert.certificateNumber}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${typeColors[cert.type]}`}
                                                >
                                                    {typeLabels[cert.type]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(cert.issueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {new Date(cert.expirationDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[cert.status]}`}
                                                >
                                                    {cert.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/certificate/${cert.publicSlug}`}
                                                        target="_blank"
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Public Link"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/certificates/${cert.id}`}
                                                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/certificates/${cert.id}/edit`}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleStatusToggle(cert.id, cert.status)}
                                                        disabled={actionLoading === cert.id}
                                                        className={`p-2 rounded-lg transition-colors ${cert.status === "ACTIVE"
                                                                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                                                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                                            }`}
                                                        title={cert.status === "ACTIVE" ? "Pause" : "Activate"}
                                                    >
                                                        {actionLoading === cert.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : cert.status === "ACTIVE" ? (
                                                            <Pause className="w-4 h-4" />
                                                        ) : (
                                                            <Play className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal(cert.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500">
                                    Showing {(page - 1) * pagination.limit + 1} to{" "}
                                    {Math.min(page * pagination.limit, pagination.total)} of{" "}
                                    {pagination.total} results
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                                        .filter(
                                            (p) =>
                                                p === 1 ||
                                                p === pagination.pages ||
                                                (p >= page - 1 && p <= page + 1)
                                        )
                                        .map((p, i, arr) => (
                                            <span key={p}>
                                                {i > 0 && arr[i - 1] !== p - 1 && (
                                                    <span className="px-2 text-slate-400">...</span>
                                                )}
                                                <button
                                                    onClick={() => setPage(p)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === p
                                                            ? "bg-blue-500 text-white"
                                                            : "text-slate-600 hover:bg-slate-100"
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            </span>
                                        ))}
                                    <button
                                        onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                        disabled={page === pagination.pages}
                                        className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Delete Certificate?
                        </h3>
                        <p className="text-slate-500 mb-6">
                            This action cannot be undone. The certificate will be permanently
                            deleted.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal)}
                                disabled={actionLoading === deleteModal}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {actionLoading === deleteModal && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
