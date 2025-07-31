/*
 * This file is part of LibreMedic.
 * 
 * LibreMedic is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 * 
 * LibreMedic is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

"use client"

import { useState, useCallback } from "react"

export const validationRules = {
  required: (value: string, fieldName: string = "Este campo") => {
    if (!value || value.trim() === "") {
      return `${fieldName} es obligatorio`
    }
    return ""
  },
  
  email: (value: string) => {
    if (!value) return ""
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return "Formato de email inválido"
    }
    return ""
  },
  
  phone: (value: string) => {
    if (!value) return ""
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    if (!phoneRegex.test(value)) {
      return "Formato de teléfono inválido"
    }
    return ""
  },
  
  dni: (value: string) => {
    if (!value) return ""
    const dniRegex = /^\d{8}[A-Z]$/
    if (!dniRegex.test(value)) {
      return "Formato de DNI inválido (ej: 12345678A)"
    }
    return ""
  },
  
  age: (value: Date | undefined) => {
    if (!value) return ""
    const today = new Date()
    const age = today.getFullYear() - value.getFullYear()
    if (age < 0 || age > 120) {
      return "Edad inválida"
    }
    return ""
  }
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  validationSchema: Record<keyof T, (value: any) => string>
) {
  const [formData, setFormData] = useState<T>(initialData)
  const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }, [errors])

  const validateForm = useCallback(() => {
    const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>
    
    Object.keys(validationSchema).forEach((key) => {
      const fieldKey = key as keyof T
      const validator = validationSchema[fieldKey]
      const value = formData[fieldKey]
      const error = validator(value)
      
      if (error) {
        newErrors[fieldKey] = error
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, validationSchema])

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    updateField,
    setFormData
  }
}
