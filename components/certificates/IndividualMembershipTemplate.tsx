import { Certificate } from "@prisma/client"
import { formatCertificateDate } from "@/lib/utils"

interface Props {
    certificate: Certificate
    qrCodeUrl?: string
}

export default function IndividualMembershipTemplate({ certificate, qrCodeUrl }: Props) {
    const displayCertificateNumber = certificate.issueNo?.trim() || certificate.certificateNumber
    const membershipDate = certificate.membershipDate || certificate.issueDate

    return (
        <div
            id="certificate-template"
            className="relative"
            style={{ width: "1024px", height: "723px" }}
        >
            <img
                src="/certification/membershipcertificate.png"
                alt="Certificate Background"
                className="absolute inset-0 h-full w-full object-fill"
                width={1024}
                height={723}
            />

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
                CERTIFICATE NO: {displayCertificateNumber}
            </div>

            <div
                className="absolute text-center"
                style={{
                    top: "335px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "620px",
                    fontSize: "32px",
                    color: "#7d1316",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {certificate.organizationName}
            </div>

            <div
                className="absolute text-center"
                style={{
                    top: "392px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "520px",
                    fontSize: "14px",
                    fontWeight: "400",
                    color: "#1e3a5f",
                    fontFamily: "var(--font-open-sans), sans-serif"
                }}
            >
                {certificate.address}
            </div>

            {certificate.qualifications && (
                <div
                    className="absolute text-center whitespace-pre-line"
                    style={{
                        top: "430px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "600px",
                        fontSize: "15px",
                        lineHeight: "1.35",
                        fontWeight: "500",
                        color: "#1a365d",
                        fontFamily: "var(--font-poppins), sans-serif"
                    }}
                >
                    {certificate.qualifications}
                </div>
            )}

            <div
                className="absolute text-center"
                style={{
                    top: "521px",
                    left: "calc(50% + 242px)",
                    transform: "translateX(-50%)",
                    width: "600px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1a365d",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {formatCertificateDate(new Date(membershipDate))}
            </div>

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
                    <img src={qrCodeUrl} alt="QR Code" className="h-full w-full" />
                </div>
            )}

            <div
                className="absolute font-medium"
                style={{
                    top: "611px",
                    left: "124px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#1a365d",
                    fontFamily: "var(--font-dm-serif), serif"
                }}
            >
                {displayCertificateNumber}
            </div>

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
