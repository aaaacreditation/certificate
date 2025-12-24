import { Certificate } from "@prisma/client"
import { formatCertificateDate } from "@/lib/utils"
import Image from "next/image"

interface Props {
    certificate: Certificate
    qrCodeUrl?: string
}

export default function OrganizationalMembershipTemplate({ certificate, qrCodeUrl }: Props) {
    return (
        <div
            id="certificate-template"
            className="relative"
            style={{ width: "1024px", height: "723px" }}
        >
            {/* Background Certificate Image */}
            <Image
                src="/certification/membershipcer.png"
                alt="Certificate Background"
                fill
                className="object-fill"
                priority
            />

            {/* Certificate No - Immediately under title */}
            <div
                className="absolute text-center"
                style={{
                    top: "130px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#1f5684",
                    fontFamily: "var(--font-poppins), sans-serif"
                }}
            >
                CERTIFICATE NO: {certificate.issueNo}
            </div>

            {/* STEP 1: Organization Name */}
            <div
                className="absolute text-center"
                style={{
                    top: "345px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "600px",
                    fontSize: "32px",
                    color: "#7d1316",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {certificate.organizationName}
            </div>

            {/* STEP 2: Address - Immediately below organization name */}
            <div
                className="absolute text-center"
                style={{
                    top: "395px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "500px",
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#1e3a5f",
                    fontFamily: "var(--font-open-sans), sans-serif"
                }}
            >
                {certificate.address}
            </div>

            {/* Scope - Immediately under 'Has gained...' text */}
            <div
                className="absolute text-center"
                style={{
                    top: "470px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "600px",
                    fontSize: "16px",
                    fontWeight: "normal",
                    color: "#1a365d",
                    fontFamily: "var(--font-poppins), sans-serif"
                }}
            >
                {certificate.scope}
            </div>

            {/* Issue Date - Beside "Has gained the Organizational Membership on" */}
            <div
                className="absolute text-center"
                style={{
                    top: "431px",
                    left: "calc(50% + 222px)",
                    transform: "translateX(-50%)",
                    width: "600px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1a365d",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {formatCertificateDate(new Date(certificate.issueDate))}
            </div>

            {/* Validity Period - Calculated from dates */}
            <div
                className="absolute text-center"
                style={{
                    top: "540px",
                    left: "calc(50% + 30px)",
                    transform: "translateX(-50%)",
                    width: "600px",
                    fontSize: "16px",
                    fontWeight: "normal",
                    color: "#1a365d",
                    fontFamily: "var(--font-poppins), sans-serif"
                }}
            >
                {new Date(certificate.expirationDate).getFullYear() - new Date(certificate.issueDate).getFullYear()} {new Date(certificate.expirationDate).getFullYear() - new Date(certificate.issueDate).getFullYear() > 1 ? "Years" : "Year"}
            </div>

            {/* STEP 3: QR Code - Inside the red square border on the left */}
            {qrCodeUrl && (
                <div
                    className="absolute"
                    style={{
                        top: "460px",
                        left: "90px",
                        width: "94px",
                        height: "94px"
                    }}
                >
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                </div>
            )}

            {/* STEP 4: Issue Date - Beside label in bottom left */}
            <div
                className="absolute font-medium"
                style={{
                    top: "631px",
                    left: "124px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#1a365d",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {formatCertificateDate(new Date(certificate.issueDate))}
            </div>

            {/* STEP 5: Expiration Date - 20px below Issue Date */}
            <div
                className="absolute font-medium"
                style={{
                    top: "651px",
                    left: "124px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#1a365d",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {formatCertificateDate(new Date(certificate.expirationDate))}
            </div>

        </div>
    )
}
