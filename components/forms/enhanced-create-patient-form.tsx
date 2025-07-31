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

import { useState } from "react"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormFieldWrapper } from "./form-field-wrapper"
import { useFormValidation, validationRules } from "./form-validation-utils"
import { AlertTriangle, CheckCircle, Loader2, User, Phone, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface CreatePatientFormProps {
  onSubmit: (patientData: any) => void
  onCancel: () => void
  initialData?: any
  isEditing?: boolean
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  bloodType: "",
  address: "",
  emergencyContact: "",
  emergencyPhone: "",
  allergies: "",
  medicalHistory: "",
}

const validationSchema = {
  firstName: (value: string) => validationRules.required(value, "El nombre"),
  lastName: (value: string) => validationRules.required(value, "Los apellidos"),
  email: validationRules.email,
  phone: validationRules.phone,
  dateOfBirth: (value: string) => validationRules.required(value, "La fecha de nacimiento"),
  gender: (value: string) => validationRules.required(value, "El género"),
  bloodType: () => "",
  address: () => "",
  emergencyContact: () => "",
  emergencyPhone: () => "",
  allergies: () => "",
  medicalHistory: () => "",
}

export function EnhancedCreatePatientForm({ onSubmit, onCancel, initialData, isEditing = false }: CreatePatientFormProps) {
  const { formData, errors, isSubmitting, setIsSubmitting, validateForm, updateField } = useFormValidation(
    initialData || initialFormData,
    validationSchema,
  )

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const genders = ["Masculino", "Femenino", "Otro", "Prefiero no decir"]
  const relationships = ["Cónyuge", "Padre/Madre", "Hijo/Hija", "Hermano/Hermana", "Amigo/Amiga", "Otro"]

  const handleNestedChange = (parent: string, child: string, value: any) => {
    updateField(parent as keyof typeof formData, {
      ...formData[parent as keyof typeof formData],
      [child]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      toast.error("Por favor, corrige los errores en el formulario antes de continuar.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Prepare data for API
      const patientData = {
        ...formData,
        userId: 1 // Default user ID for now
      }

      if (isEditing) {
        // For editing, we need to call the parent's onSubmit which will handle the API call
        onSubmit(patientData)
      } else {
        // For creating, call the API directly
        const response = await api.createPatient(patientData)
        
        if (response.success) {
          onSubmit(response.data)
          setSubmitStatus("success")
          toast.success("Paciente creado exitosamente")
        } else {
          setSubmitStatus("error")
          toast.error(response.error || "Error al crear el paciente")
        }
      }
    } catch (error) {
      console.error("Error creating patient:", error)
      setSubmitStatus("error")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Alertas de estado */}
      {submitStatus === "error" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Por favor, corrige los errores en el formulario antes de continuar.</AlertDescription>
        </Alert>
      )}

      {submitStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Paciente creado exitosamente.</AlertDescription>
        </Alert>
      )}

      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
          <CardDescription>Datos básicos del paciente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper label="Nombre" required error={errors.firstName}>
              <Input
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Nombre del paciente"
                className={errors.firstName ? "border-red-500" : ""}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Apellidos" required error={errors.lastName}>
              <Input
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Apellidos del paciente"
                className={errors.lastName ? "border-red-500" : ""}
              />
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper label="Correo Electrónico" required error={errors.email}>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className={cn("pl-10", errors.email ? "border-red-500" : "")}
                />
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper label="Teléfono" required error={errors.phone}>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+34 612 345 678"
                  className={cn("pl-10", errors.phone ? "border-red-500" : "")}
                />
              </div>
            </FormFieldWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormFieldWrapper label="Fecha de Nacimiento" required error={errors.dateOfBirth}>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className={errors.dateOfBirth ? "border-red-500" : ""}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Género" required error={errors.gender}>
              <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Tipo de Sangre" error={errors.bloodType}>
              <Select value={formData.bloodType} onValueChange={(value) => updateField("bloodType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper label="Dirección" error={errors.address}>
            <Input
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Dirección completa"
            />
          </FormFieldWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper label="Contacto de Emergencia" error={errors.emergencyContact}>
              <Input
                value={formData.emergencyContact}
                onChange={(e) => updateField("emergencyContact", e.target.value)}
                placeholder="Nombre del contacto"
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Teléfono de Emergencia" error={errors.emergencyPhone}>
              <Input
                value={formData.emergencyPhone}
                onChange={(e) => updateField("emergencyPhone", e.target.value)}
                placeholder="+34 612 345 678"
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper label="Alergias" error={errors.allergies}>
            <Input
              value={formData.allergies}
              onChange={(e) => updateField("allergies", e.target.value)}
              placeholder="Alergias conocidas (ej: Penicilina, Polen)"
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="Historial Médico" error={errors.medicalHistory}>
            <Input
              value={formData.medicalHistory}
              onChange={(e) => updateField("medicalHistory", e.target.value)}
              placeholder="Condiciones médicas previas"
            />
          </FormFieldWrapper>
        </CardContent>
      </Card>

      {/* Resto del formulario permanece igual pero con FormFieldWrapper */}

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            isEditing ? "Actualizar Paciente" : "Crear Paciente"
          )}
        </Button>
      </div>
    </form>
  )
}
