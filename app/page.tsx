"use client"

import { useState } from "react"
import { Shield, Search, Award, CheckCircle, XCircle, Loader2, Building2, Calendar, Download, Share2, Copy, Linkedin, Mail } from "lucide-react"
import { Certificate } from "@prisma/client"
import { toPng } from "html-to-image"
import QRCode from "qrcode"
import { useRef, useEffect } from "react"
import IndividualMembershipTemplate from "@/components/certificates/IndividualMembershipTemplate"
import AccreditationTemplate from "@/components/certificates/AccreditationTemplate"
import OrganizationalMembershipTemplate from "@/components/certificates/OrganizationalMembershipTemplate"

const typeLabels: Record<string, string> = {
  INDIVIDUAL_MEMBERSHIP: "Individual Membership",
  ACCREDITATION: "Accreditation",
  ORGANIZATIONAL_MEMBERSHIP: "Organizational Membership",
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export default function Home() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || query.trim().length < 2) return

    setLoading(true)
    setSearched(true)
    setNotFound(false)
    setCertificate(null)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()

      if (data.found && data.certificate) {
        setCertificate(data.certificate)
        // Generate QR code
        const certUrl = `${window.location.origin}/certificate/${data.certificate.publicSlug}`
        const qr = await QRCode.toDataURL(certUrl, { width: 150 })
        setQrCode(qr)
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error("Search error:", error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

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
      })
      const link = document.createElement("a")
      link.download = `${certificate?.certificateNumber}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Failed to download:", error)
    } finally {
      setDownloading(false)
    }
  }

  const handleCopyLink = async () => {
    if (!certificate) return
    const url = `${window.location.origin}/certificate/${certificate.publicSlug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setQuery("")
    setSearched(false)
    setCertificate(null)
    setNotFound(false)
    setQrCode("")
  }

  const renderTemplate = () => {
    if (!certificate) return null
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-white text-center">
              <h1 className="font-bold text-lg">American Accreditation Association</h1>
              <p className="text-xs text-blue-200">Certificate Verification Portal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        {!searched || notFound ? (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-blue-200 text-sm mb-8 border border-blue-400/20">
              <CheckCircle className="w-4 h-4" />
              Verify Certificate Authenticity
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Certificate
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {" "}Verification
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-xl mx-auto mb-10">
              Enter the organization name or certificate number to verify an AAA certification
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter organization name or certificate number..."
                  className="w-full pl-14 pr-36 py-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button
                    type="submit"
                    disabled={loading || query.trim().length < 2}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Verify
                  </button>
                </div>
              </div>
            </form>

            {/* Not Found Message */}
            {notFound && (
              <div className="mt-12 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 max-w-lg mx-auto">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Certificate Not Found
                </h3>
                <p className="text-slate-300 mb-6">
                  Sorry, we couldn&apos;t find a certificate matching your search. Please check the name or certificate number and try again.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
                >
                  Try Another Search
                </button>
              </div>
            )}

            {/* Info Cards */}
            {!notFound && (
              <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Instant Verification</h3>
                  <p className="text-sm text-slate-400">
                    Verify any AAA certificate in seconds
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">3 Certificate Types</h3>
                  <p className="text-sm text-slate-400">
                    Individual, Organizational & Accreditation
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Secure & Trusted</h3>
                  <p className="text-sm text-slate-400">
                    Official AAA verification system
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : certificate ? (
          /* Certificate Found - Display Result */
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-300 text-sm mb-4 border border-emerald-400/20">
                <CheckCircle className="w-4 h-4" />
                Certificate Verified
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {certificate.organizationName}
              </h2>
              <p className="text-slate-400">
                is certified by the American Accreditation Association
              </p>
              <button
                onClick={handleReset}
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                ← Search Another Certificate
              </button>
            </div>

            {/* Certificate Display */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${certificate.type === "INDIVIDUAL_MEMBERSHIP"
                  ? "bg-purple-100 text-purple-700"
                  : certificate.type === "ACCREDITATION"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-cyan-100 text-cyan-700"
                  }`}>
                  {typeLabels[certificate.type]}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  ✓ Valid Certificate
                </span>
              </div>
              <div className="p-6 overflow-x-auto bg-slate-100">
                <div
                  ref={certificateRef}
                  className="inline-block"
                  style={{ transform: "scale(0.55)", transformOrigin: "top left" }}
                >
                  {renderTemplate()}
                </div>
              </div>
            </div>

            {/* Info & Actions Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Certificate Info */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  Certificate Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Certificate No.</span>
                    <span className="text-white font-mono">{certificate.certificateNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Issue Date</span>
                    <span className="text-white">{formatDate(certificate.issueDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Expiration</span>
                    <span className="text-white">{formatDate(certificate.expirationDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="text-emerald-400 font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* QR Code & Actions */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-start gap-6">
                  {qrCode && (
                    <div className="bg-white rounded-xl p-3">
                      <img src={qrCode} alt="QR Code" className="w-24 h-24" />
                    </div>
                  )}
                  <div className="flex-1 space-y-3">
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50"
                    >
                      {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      Download
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} American Accreditation Association. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
