"use client"

import { useState } from "react"

// Utilidades de validación
export const validationRules = {
  email: (value: string) => {
    if (!value.trim()) return "El email es obligatorio"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Formato de email inválido"
    return ""
  },

  phone: (value: string) => {
    if (!value.trim()) return "El teléfono es obligatorio"
    if (!/^\+?[\d\s-()]+$/.test(value)) return "Formato de teléfono inválido"
    return ""
  },

  required: (value: string, fieldName: string) => {
    if (!value.trim()) return `${fieldName} es obligatorio`
    return ""
  },

  dni: (value: string) => {
    if (!value.trim()) return "El DNI/NIE es obligatorio"
    if (
      !/^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(value) &&
      !/^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(value)
    ) {
      return "Formato de DNI/NIE inválido"
    }
    return ""
  },

  age: (birthDate: Date | undefined) => {
    if (!birthDate) return "La fecha de nacimiento es obligatoria"
    const age = new Date().getFullYear() - birthDate.getFullYear()
    if (age < 0 || age > 150) return "Fecha de nacimiento inválida"
    return ""
  },

  icd10: (value: string) => {
    if (value && !/^[A-Z]\d{2}(\.\d{1,2})?$/.test(value)) {
      return "Formato de código CIE-10 inválido (ej: J06.9)"
    }
    return ""
  },

  dateRange: (startDate: Date | undefined, endDate: Date | undefined, startLabel: string, endLabel: string) => {
    if (startDate && endDate && endDate <= startDate) {
      return `${endLabel} debe ser posterior a ${startLabel}`
    }
    return ""
  },
}

// Hook personalizado para manejo de formularios
export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationSchema: Record<keyof T, (value: any) => string>,
) {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (field: keyof T, value: any) => {
    const error = validationSchema[field]?.(value) || ""
    setErrors((prev) => ({ ...prev, [field]: error }))
    return error === ""
  }

  const validateForm = () => {
    const newErrors = {} as Record<keyof T, string>
    let isValid = true

    Object.keys(validationSchema).forEach((field) => {
      const error = validationSchema[field as keyof T](formData[field as keyof T])
      if (error) {
        newErrors[field as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const updateField = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      validateField(field, value)
    }
  }

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateField,
    validateForm,
    updateField,
    setFormData,
  }
}
