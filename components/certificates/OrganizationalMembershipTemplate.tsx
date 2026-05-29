import { Certificate } from "@prisma/client"
import { formatCertificateDate } from "@/lib/utils"

interface Props {
    certificate: Certificate
    qrCodeUrl?: string
}

export default function OrganizationalMembershipTemplate({ certificate, qrCodeUrl }: Props) {
    const displayCertificateNumber = certificate.issueNo?.trim() || certificate.certificateNumber

    return (
        <div
            id="certificate-template"
            className="relative"
            style={{ width: "1024px", height: "723px" }}
        >
            {/* Background Certificate Image */}
            <img
                src="/certification/membershipcer.png"
                alt="Certificate Background"
                className="absolute inset-0 h-full w-full object-fill"
                width={1024}
                height={723}
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
                CERTIFICATE NO: {displayCertificateNumber}
            </div>

            {/* STEP 1: Organization Name */}
            <div
                className="absolute text-center"
                style={{
                    top: "335px",
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
                    top: "392px",
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

            {certificate.scope && (
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
                    {certificate.scope}
                </div>
            )}

            {/* Issue Date - Beside "Has gained the Organizational Membership on" */}
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
                {formatCertificateDate(new Date(certificate.membershipDate || certificate.issueDate))}
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

            {/* Certificate number - Beside label in bottom left */}
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
