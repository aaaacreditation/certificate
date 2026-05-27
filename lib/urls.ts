const DEFAULT_APP_URL = "https://certificate.aaa-accreditation.org"

export function getAppUrl(): string {
    const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
    const appUrl = configuredUrl?.trim() || DEFAULT_APP_URL

    if (process.env.NODE_ENV === "production" && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(appUrl)) {
        return DEFAULT_APP_URL
    }

    return appUrl.replace(/\/+$/, "")
}

export function getCertificatePublicUrl(publicSlug: string): string {
    return `${getAppUrl()}/certificate/${publicSlug}`
}
