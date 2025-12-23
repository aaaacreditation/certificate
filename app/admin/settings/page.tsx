import { Shield } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">
                    Configure your accreditation system
                </p>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    System Information
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600">System Name</span>
                        <span className="font-medium text-slate-900">
                            AAA Certificate Management System
                        </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600">Version</span>
                        <span className="font-medium text-slate-900">1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-slate-600">Environment</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            Development
                        </span>
                    </div>
                </div>
            </div>

            {/* Organization Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Organization
                </h2>
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            American Accreditation Association
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            Providing accreditation and certification services worldwide
                        </p>
                        <p className="text-slate-400 text-sm mt-2">
                            Executive Director: William Moore
                        </p>
                    </div>
                </div>
            </div>

            {/* Database */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Database
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600">Provider</span>
                        <span className="font-medium text-slate-900">PostgreSQL</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <span className="text-slate-600">ORM</span>
                        <span className="font-medium text-slate-900">Prisma</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <span className="text-slate-600">Status</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                            Connected
                        </span>
                    </div>
                </div>
            </div>

            {/* Certificate Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Certificate Settings
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                            <span className="text-slate-900 font-medium">
                                Individual Membership Validity
                            </span>
                            <p className="text-sm text-slate-500">
                                Default validity period for individual memberships
                            </p>
                        </div>
                        <span className="font-medium text-slate-900">2 Years</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                            <span className="text-slate-900 font-medium">
                                Organizational Membership Validity
                            </span>
                            <p className="text-sm text-slate-500">
                                Default validity period for organizational memberships
                            </p>
                        </div>
                        <span className="font-medium text-slate-900">1 Year</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <span className="text-slate-900 font-medium">
                                Accreditation Validity
                            </span>
                            <p className="text-sm text-slate-500">
                                Default validity period for accreditations
                            </p>
                        </div>
                        <span className="font-medium text-slate-900">3 Years</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
