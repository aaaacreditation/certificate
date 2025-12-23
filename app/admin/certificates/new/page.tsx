"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    Award,
    Building2,
    User,
    ArrowRight,
    ArrowLeft,
    Calendar,
    MapPin,
    FileText,
    Check,
    Loader2,
} from "lucide-react"
import { CertificateType } from "@prisma/client"

const certificateTypes = [
    {
        type: "INDIVIDUAL_MEMBERSHIP" as CertificateType,
        title: "Individual Membership",
        description: "For individual professionals recognized as competency members",
        icon: User,
        color: "from-purple-500 to-indigo-600",
        validity: "2 years",
    },
    {
        type: "ACCREDITATION" as CertificateType,
        title: "Accreditation",
        description: "For organizations meeting AAA accreditation requirements",
        icon: Award,
        color: "from-blue-500 to-cyan-600",
        validity: "3 years",
    },
    {
        type: "ORGANIZATIONAL_MEMBERSHIP" as CertificateType,
        title: "Organizational Membership",
        description: "For organizations gaining AAA organizational membership",
        icon: Building2,
        color: "from-emerald-500 to-teal-600",
        validity: "1 year",
    },
]

export default function NewCertificatePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState<CertificateType | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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

    const handleTypeSelect = (type: CertificateType) => {
        setSelectedType(type)

        // Auto-calculate expiration date based on type
        const today = new Date()
        const issueDate = today.toISOString().split("T")[0]
        let expirationDate = new Date(today)

        if (type === "INDIVIDUAL_MEMBERSHIP") {
            expirationDate.setFullYear(expirationDate.getFullYear() + 2)
        } else if (type === "ORGANIZATIONAL_MEMBERSHIP") {
            expirationDate.setFullYear(expirationDate.getFullYear() + 1)
        } else {
            expirationDate.setFullYear(expirationDate.getFullYear() + 3)
        }

        setFormData({
            ...formData,
            issueDate,
            expirationDate: expirationDate.toISOString().split("T")[0],
            membershipDate: issueDate,
            initialAccreditationDate: issueDate,
        })

        setStep(2)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedType) return

        setIsSubmitting(true)
        try {
            const res = await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: selectedType,
                    ...formData,
                }),
            })

            if (res.ok) {
                const cert = await res.json()
                router.push(`/admin/certificates/${cert.id}`)
            } else {
                const error = await res.json()
                alert(error.error || "Failed to create certificate")
            }
        } catch (error) {
            console.error("Error creating certificate:", error)
            alert("Failed to create certificate")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-4">
                    <div
                        className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 1
                                ? "bg-blue-500 text-white"
                                : "bg-slate-200 text-slate-500"
                                }`}
                        >
                            {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                        </div>
                        <span className="font-medium hidden sm:inline">Select Type</span>
                    </div>
                    <div className="w-20 h-0.5 bg-slate-200">
                        <div
                            className={`h-full bg-blue-500 transition-all ${step >= 2 ? "w-full" : "w-0"
                                }`}
                        />
                    </div>
                    <div
                        className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-slate-400"
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= 2
                                ? "bg-blue-500 text-white"
                                : "bg-slate-200 text-slate-500"
                                }`}
                        >
                            2
                        </div>
                        <span className="font-medium hidden sm:inline">Fill Details</span>
                    </div>
                </div>
            </div>

            {/* Step 1: Select Certificate Type */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">
                            Select Certificate Type
                        </h1>
                        <p className="text-slate-500">
                            Choose the type of certificate you want to issue
                        </p>
                    </div>

                    <div className="grid gap-6">
                        {certificateTypes.map((cert) => (
                            <button
                                key={cert.type}
                                onClick={() => handleTypeSelect(cert.type)}
                                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-200 transition-all text-left"
                            >
                                <div className="flex items-start gap-5">
                                    <div
                                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                                    >
                                        <cert.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                                            {cert.title}
                                        </h3>
                                        <p className="text-slate-500 mb-3">{cert.description}</p>
                                        <span className="inline-flex items-center gap-1 text-sm text-slate-400">
                                            <Calendar className="w-4 h-4" />
                                            Valid for {cert.validity}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 2: Fill Details */}
            {step === 2 && selectedType && (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                    <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to type selection
                    </button>

                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                        <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${certificateTypes.find((c) => c.type === selectedType)?.color
                                } flex items-center justify-center`}
                        >
                            {(() => {
                                const Icon =
                                    certificateTypes.find((c) => c.type === selectedType)?.icon ||
                                    Award
                                return <Icon className="w-7 h-7 text-white" />
                            })()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                {certificateTypes.find((c) => c.type === selectedType)?.title}
                            </h2>
                            <p className="text-slate-500">
                                Fill in the certificate details below
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
                                    placeholder="Enter organization or individual name"
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
                                    placeholder="Enter full address"
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
                        {selectedType === "INDIVIDUAL_MEMBERSHIP" && (
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
                                            placeholder="e.g., ISO 9001 Lead Auditor"
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
                        {selectedType === "ACCREDITATION" && (
                            <div className="space-y-6 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                                    Accreditation Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <FileText className="w-4 h-4 inline mr-2" />
                                            Accredited As *
                                        </label>
                                        <input
                                            type="text"
                                            name="accreditedAs"
                                            value={formData.accreditedAs}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., ISO 17025:2017"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            <FileText className="w-4 h-4 inline mr-2" />
                                            Scope *
                                        </label>
                                        <input
                                            type="text"
                                            name="scope"
                                            value={formData.scope}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Chemical Testing Laboratory"
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
                        {selectedType === "ORGANIZATIONAL_MEMBERSHIP" && (
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
                        <div className="flex justify-end pt-6 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Award className="w-5 h-5" />
                                        Create Certificate
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
