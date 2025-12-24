"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Certificate } from "@prisma/client"
import { toPng } from "html-to-image"
import QRCode from "qrcode"
import {
    Download,
    Share2,
    Copy,
    CheckCircle,
    Linkedin,
    Mail,
    Shield,
    Loader2,
} from "lucide-react"
import IndividualMembershipTemplate from "@/components/certificates/IndividualMembershipTemplate"
import AccreditationTemplate from "@/components/certificates/AccreditationTemplate"
import OrganizationalMembershipTemplate from "@/components/certificates/OrganizationalMembershipTemplate"
import { formatCertificateDate, getCertificateTypeName } from "@/lib/utils"

interface Props {
    certificate: Certificate
}

export default function PublicCertificateView({ certificate }: Props) {
    const certificateRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [downloading, setDownloading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [qrCode, setQrCode] = useState<string>("")
    const [scale, setScale] = useState(0.5)

    const publicUrl = typeof window !== "undefined" ? window.location.href : ""

    // Calculate responsive scale based on container width
    useEffect(() => {
        const calculateScale = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth
                const certificateWidth = 1024
                const padding = 32 // Account for padding
                const availableWidth = containerWidth - padding
                const newScale = Math.min(availableWidth / certificateWidth, 0.7)
                setScale(Math.max(newScale, 0.3)) // Min scale of 0.3
            }
        }

        calculateScale()
        window.addEventListener("resize", calculateScale)
        return () => window.removeEventListener("resize", calculateScale)
    }, [])

    // Generate QR code on mount
    useEffect(() => {
        if (publicUrl) {
            QRCode.toDataURL(publicUrl, { width: 150 }).then(setQrCode)
        }
    }, [publicUrl])

    const handleDownload = async () => {
        if (!certificateRef.current) return

        setDownloading(true)
        try {
            const dataUrl = await toPng(certificateRef.current, {
                quality: 1.0,
                pixelRatio: 2,
                width: 1024,
                height: 723,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                },
                backgroundColor: '#ffffff',
                skipFonts: true,
                filter: (node) => {
                    if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') {
                        return false
                    }
                    return true
                },
            })

            const link = document.createElement("a")
            link.download = `${certificate.certificateNumber}.png`
            link.href = dataUrl
            link.click()
        } catch (error) {
            console.error("Failed to download:", error)
        } finally {
            setDownloading(false)
        }
    }

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShareLinkedIn = () => {
        const text = `I'm proud to share my ${getCertificateTypeName(certificate.type)} certificate from the American Accreditation Association!`
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(text)}`,
            "_blank"
        )
    }

    const handleShareEmail = () => {
        const subject = `${certificate.organizationName} - AAA Certificate`
        const body = `View the certificate: ${publicUrl}`
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }

    const renderTemplate = () => {
        switch (certificate.type) {
            case "INDIVIDUAL_MEMBERSHIP":
                return <IndividualMembershipTemplate certificate={certificate} />
            case "ACCREDITATION":
                return <AccreditationTemplate certificate={certificate} qrCodeUrl={qrCode} />
            case "ORGANIZATIONAL_MEMBERSHIP":
                return <OrganizationalMembershipTemplate certificate={certificate} qrCodeUrl={qrCode} />
            default:
                return null
        }
    }

    const isExpired = new Date(certificate.expirationDate) < new Date()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-4 md:py-6">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/AAA-Logo.png"
                                alt="American Accreditation Association"
                                width={150}
                                height={50}
                                className="h-10 md:h-12 w-auto"
                            />
                        </div>
                        <div className="flex items-center gap-2 ml-13 sm:ml-0">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                            <span className="text-xs md:text-sm font-medium">
                                {isExpired ? (
                                    <span className="text-red-400">Expired</span>
                                ) : (
                                    <span className="text-emerald-400">Verified Certificate</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
                {/* Mobile: Actions first */}
                <div className="lg:hidden mb-4 space-y-3">
                    {/* Quick Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 text-sm"
                        >
                            {downloading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                            Download
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all text-sm"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Link
                                </>
                            )}
                        </button>
                    </div>

                    {/* Share Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleShareLinkedIn}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0077b5] text-white rounded-xl hover:bg-[#006699] transition-colors text-sm"
                        >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                        </button>
                        <button
                            onClick={handleShareEmail}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm"
                        >
                            <Mail className="w-4 h-4" />
                            Email
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Certificate Display */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-3 md:p-4 bg-slate-50 border-b border-slate-100">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${certificate.type === "INDIVIDUAL_MEMBERSHIP"
                                        ? "bg-purple-100 text-purple-700"
                                        : certificate.type === "ACCREDITATION"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-cyan-100 text-cyan-700"
                                        }`}>
                                        {getCertificateTypeName(certificate.type)}
                                    </span>
                                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${isExpired
                                        ? "bg-red-100 text-red-700"
                                        : "bg-emerald-100 text-emerald-700"
                                        }`}>
                                        {isExpired ? "Expired" : "Valid"}
                                    </span>
                                </div>
                            </div>
                            <div ref={containerRef} className="p-2 md:p-6 overflow-hidden flex justify-center">
                                <div
                                    ref={certificateRef}
                                    style={{
                                        transform: `scale(${scale})`,
                                        transformOrigin: "top center",
                                        height: `${723 * scale}px`
                                    }}
                                >
                                    {renderTemplate()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Desktop only */}
                    <div className="hidden lg:block space-y-6 order-1 lg:order-2">
                        {/* Certificate Info */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h2 className="font-semibold text-slate-900 mb-4">Certificate Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500">Organization</label>
                                    <p className="font-medium text-slate-900">{certificate.organizationName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">Certificate Number</label>
                                    <p className="font-mono text-sm text-slate-900">{certificate.certificateNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">Issue Date</label>
                                    <p className="text-slate-900">{formatCertificateDate(new Date(certificate.issueDate))}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">Expiration Date</label>
                                    <p className={`${isExpired ? "text-red-600" : "text-slate-900"}`}>
                                        {formatCertificateDate(new Date(certificate.expirationDate))}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl">
                            <h2 className="font-semibold text-slate-900 mb-4">Actions</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={handleDownload}
                                    disabled={downloading}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                                >
                                    {downloading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Download className="w-5 h-5" />
                                    )}
                                    Download Certificate
                                </button>
                                <button
                                    onClick={handleCopyLink}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-5 h-5" />
                                            Copy Link
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share on
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleShareLinkedIn}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0077b5] text-white rounded-xl hover:bg-[#006699] transition-colors"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                        LinkedIn
                                    </button>
                                    <button
                                        onClick={handleShareEmail}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Certificate Details - Collapsible */}
                    <div className="lg:hidden order-3">
                        <details className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <summary className="p-4 cursor-pointer font-semibold text-slate-900 hover:bg-slate-50">
                                Certificate Details
                            </summary>
                            <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                                <div>
                                    <label className="text-xs text-slate-500">Organization</label>
                                    <p className="font-medium text-slate-900 text-sm">{certificate.organizationName}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500">Certificate Number</label>
                                    <p className="font-mono text-xs text-slate-900">{certificate.certificateNumber}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500">Issue Date</label>
                                        <p className="text-slate-900 text-sm">{formatCertificateDate(new Date(certificate.issueDate))}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500">Expiration Date</label>
                                        <p className={`text-sm ${isExpired ? "text-red-600" : "text-slate-900"}`}>
                                            {formatCertificateDate(new Date(certificate.expirationDate))}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-6 md:py-8 text-slate-500 text-xs md:text-sm px-4">
                <p>© {new Date().getFullYear()} American Accreditation Association. All rights reserved.</p>
            </div>
        </div>
    )
}
