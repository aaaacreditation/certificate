import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import PublicCertificateView from "./PublicCertificateView"

export default async function PublicCertificatePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const certificate = await prisma.certificate.findUnique({
        where: { publicSlug: slug },
    })

    if (!certificate) {
        notFound()
    }

    // Check if certificate is paused or revoked
    if (certificate.status === "PAUSED" || certificate.status === "REVOKED") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
                <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-10 h-10 text-amber-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                        Certificate {certificate.status === "PAUSED" ? "Paused" : "Revoked"}
                    </h1>
                    <p className="text-slate-500">
                        This certificate is currently not available for viewing.
                        Please contact the American Accreditation Association for more information.
                    </p>
                </div>
            </div>
        )
    }

    return <PublicCertificateView certificate={certificate} />
}
