"use client"

import type React from "react"

import { Label } from "@/components/ui/label"

interface FormFieldWrapperProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

export function FormFieldWrapper({ label, required = false, error, children }: FormFieldWrapperProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
