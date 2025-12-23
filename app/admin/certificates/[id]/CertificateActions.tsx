"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Certificate } from "@prisma/client"
import { Edit, Pause, Play, Trash2, Loader2, ExternalLink } from "lucide-react"

interface Props {
    certificate: Certificate
}

export default function CertificateActions({ certificate }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const handleStatusToggle = async () => {
        setLoading("status")
        try {
            const newStatus = certificate.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
            await fetch(`/api/certificates/${certificate.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            router.refresh()
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setLoading(null)
        }
    }

    const handleDelete = async () => {
        setLoading("delete")
        try {
            await fetch(`/api/certificates/${certificate.id}`, {
                method: "DELETE",
            })
            router.push("/admin/certificates")
        } catch (error) {
            console.error("Failed to delete:", error)
        } finally {
            setLoading(null)
        }
    }

    return (
        <>
            <div className="flex items-center gap-3">
                <Link
                    href={`/certificate/${certificate.publicSlug}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-medium"
                >
                    <ExternalLink className="w-4 h-4" />
                    View Public
                </Link>
                <Link
                    href={`/admin/certificates/${certificate.id}/edit`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                    <Edit className="w-4 h-4" />
                    Edit
                </Link>
                <button
                    onClick={handleStatusToggle}
                    disabled={loading === "status"}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${certificate.status === "ACTIVE"
                            ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                            : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                >
                    {loading === "status" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : certificate.status === "ACTIVE" ? (
                        <Pause className="w-4 h-4" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )}
                    {certificate.status === "ACTIVE" ? "Pause" : "Activate"}
                </button>
                <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors font-medium"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                            Delete Certificate?
                        </h3>
                        <p className="text-slate-500 mb-6">
                            This action cannot be undone. The certificate for{" "}
                            <strong>{certificate.organizationName}</strong> will be
                            permanently deleted.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading === "delete"}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading === "delete" && (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
