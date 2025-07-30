"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

interface FormFieldWrapperProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  description?: string
}

export function FormFieldWrapper({
  label,
  htmlFor,
  required = false,
  error,
  children,
  description,
}: FormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
