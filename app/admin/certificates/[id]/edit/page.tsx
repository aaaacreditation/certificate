"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
    ArrowLeft,
    Building2,
    Calendar,
    MapPin,
    FileText,
    Award,
    Loader2,
    Save,
} from "lucide-react"
import { Certificate, CertificateType } from "@prisma/client"
import { getCertificateTypeName } from "@/lib/utils"

export default function EditCertificatePage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [certificate, setCertificate] = useState<Certificate | null>(null)
    const [formData, setFormData] = useState({
        organizationName: "",
        address: "",
        issueDate: "",
        expirationDate: "",
        qualifications: "",
        membershipDate: "",
        accreditedAs: "",
        scope: "",
        issueNo: "",
        initialAccreditationDate: "",
    })

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const res = await fetch(`/api/certificates/${params.id}`)
                if (res.ok) {
                    const data = await res.json()
                    setCertificate(data)
                    setFormData({
                        organizationName: data.organizationName,
                        address: data.address,
                        issueDate: new Date(data.issueDate).toISOString().split("T")[0],
                        expirationDate: new Date(data.expirationDate).toISOString().split("T")[0],
                        qualifications: data.qualifications || "",
                        membershipDate: data.membershipDate
                            ? new Date(data.membershipDate).toISOString().split("T")[0]
                            : "",
                        accreditedAs: data.accreditedAs || "",
                        scope: data.scope || "",
                        issueNo: data.issueNo || "",
                        initialAccreditationDate: data.initialAccreditationDate
                            ? new Date(data.initialAccreditationDate).toISOString().split("T")[0]
                            : "",
                    })
                }
            } catch (error) {
                console.error("Failed to fetch certificate:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCertificate()
    }, [params.id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!certificate) return

        setSaving(true)
        try {
            const res = await fetch(`/api/certificates/${certificate.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: certificate.type,
                    ...formData,
                }),
            })

            if (res.ok) {
                router.push(`/admin/certificates/${certificate.id}`)
                router.refresh()
            } else {
                const error = await res.json()
                alert(error.error || "Failed to update certificate")
            }
        } catch (error) {
            console.error("Error updating certificate:", error)
            alert("Failed to update certificate")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        )
    }

    if (!certificate) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">Certificate not found</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Link
                href={`/admin/certificates/${certificate.id}`}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to certificate
            </Link>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Award className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Edit Certificate
                        </h1>
                        <p className="text-slate-500">
                            {getCertificateTypeName(certificate.type)} • {certificate.certificateNumber}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Common Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Building2 className="w-4 h-4 inline mr-2" />
                                Organization Name *
                            </label>
                            <input
                                type="text"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Address *
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Issue Date *
                            </label>
                            <input
                                type="date"
                                name="issueDate"
                                value={formData.issueDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Expiration Date *
                            </label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Individual Membership Fields */}
                    {certificate.type === "INDIVIDUAL_MEMBERSHIP" && (
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                Individual Membership Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Qualifications
                                    </label>
                                    <input
                                        type="text"
                                        name="qualifications"
                                        value={formData.qualifications}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Membership Date
                                    </label>
                                    <input
                                        type="date"
                                        name="membershipDate"
                                        value={formData.membershipDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Accreditation Fields */}
                    {certificate.type === "ACCREDITATION" && (
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                Accreditation Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Accredited As
                                    </label>
                                    <input
                                        type="text"
                                        name="accreditedAs"
                                        value={formData.accreditedAs}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Scope
                                    </label>
                                    <input
                                        type="text"
                                        name="scope"
                                        value={formData.scope}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Certificate No.
                                    </label>
                                    <input
                                        type="text"
                                        name="issueNo"
                                        value={formData.issueNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Initial Accreditation Date
                                    </label>
                                    <input
                                        type="date"
                                        name="initialAccreditationDate"
                                        value={formData.initialAccreditationDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Organizational Membership Fields */}
                    {certificate.type === "ORGANIZATIONAL_MEMBERSHIP" && (
                        <div className="space-y-6 pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                Organizational Membership Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2" />
                                        Scope
                                    </label>
                                    <input
                                        type="text"
                                        name="scope"
                                        value={formData.scope}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Training & Education Provider"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Certificate No.
                                    </label>
                                    <input
                                        type="text"
                                        name="issueNo"
                                        value={formData.issueNo}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., 001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Membership Date
                                    </label>
                                    <input
                                        type="date"
                                        name="membershipDate"
                                        value={formData.membershipDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                        <Link
                            href={`/admin/certificates/${certificate.id}`}
                            className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <span className="inline-flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
