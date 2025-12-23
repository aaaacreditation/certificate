"use client"

import { Pause, Play, Trash2 } from "lucide-react"
import { Certificate } from "@prisma/client"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface QuickActionsButtonsProps {
    certificate: Certificate
}

export default function QuickActionsButtons({ certificate }: QuickActionsButtonsProps) {
    const router = useRouter()

    const handleToggleStatus = async () => {
        try {
            const newStatus = certificate.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
            const response = await fetch(`/api/certificates/${certificate.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            if (response.ok) {
                toast.success(`Certificate ${newStatus.toLowerCase()}`)
                router.refresh()
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this certificate?")) return
        try {
            const response = await fetch(`/api/certificates/${certificate.id}`, {
                method: "DELETE",
            })
            if (response.ok) {
                toast.success("Certificate deleted")
                router.push("/admin/certificates")
            }
        } catch (error) {
            toast.error("Failed to delete certificate")
        }
    }

    return (
        <>
            <button
                onClick={handleToggleStatus}
                className="flex items-center gap-3 w-full p-3 text-slate-600 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-colors"
            >
                {certificate.status === "ACTIVE" ? (
                    <span className="inline-flex items-center gap-3">
                        <Pause className="w-5 h-5" />
                        <span className="font-medium">Pause Certificate</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-3">
                        <Play className="w-5 h-5" />
                        <span className="font-medium">Activate Certificate</span>
                    </span>
                )}
            </button>
            <button
                onClick={handleDelete}
                className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
                <Trash2 className="w-5 h-5" />
                <span className="font-medium">Delete Certificate</span>
            </button>
        </>
    )
}
