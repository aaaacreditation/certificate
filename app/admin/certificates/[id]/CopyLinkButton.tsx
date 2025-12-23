"use client"

import { Copy } from "lucide-react"

interface CopyLinkButtonProps {
    url: string
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(url)
    }

    return (
        <button
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Copy link"
        >
            <Copy className="w-4 h-4" />
        </button>
    )
}
