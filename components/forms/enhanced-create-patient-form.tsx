"use client"

import { useState } from "react"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormFieldWrapper } from "./form-field-wrapper"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useFormValidation, validationRules } from "./form-validation-utils"
import { CalendarIcon, User, Phone, Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface CreatePatientFormProps {
  onSubmit: (patientData: any) => void
  onCancel: () => void
}

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: undefined as Date | undefined,
  gender: "",
  identification: "",
  bloodType: "",
  allergies: [] as string[],
  chronicConditions: [] as string[],
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "España",
  },
  occupation: "",
  insurance: "",
  notes: "",
}

const validationSchema = {
  firstName: (value: string) => validationRules.required(value, "El nombre"),
  lastName: (value: string) => validationRules.required(value, "Los apellidos"),
  email: validationRules.email,
  phone: validationRules.phone,
  identification: validationRules.dni,
  birthDate: validationRules.age,
  gender: (value: string) => validationRules.required(value, "El género"),
  // Otros campos opcionales no necesitan validación estricta
  bloodType: () => "",
  allergies: () => "",
  chronicConditions: () => "",
  emergencyContact: () => "",
  address: () => "",
  occupation: () => "",
  insurance: () => "",
  notes: () => "",
}

export function EnhancedCreatePatientForm({ onSubmit, onCancel }: CreatePatientFormProps) {
  const { formData, errors, isSubmitting, setIsSubmitting, validateForm, updateField } = useFormValidation(
    initialFormData,
    validationSchema,
  )

  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
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

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      updateField("allergies", [...formData.allergies, newAllergy.trim()])
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    updateField(
      "allergies",
      formData.allergies.filter((_, i) => i !== index),
    )
  }

  const addCondition = () => {
    if (newCondition.trim() && !formData.chronicConditions.includes(newCondition.trim())) {
      updateField("chronicConditions", [...formData.chronicConditions, newCondition.trim()])
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    updateField(
      "chronicConditions",
      formData.chronicConditions.filter((_, i) => i !== index),
    )
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
      const response = await api.createPatient(formData)
      
      if (response.success) {
        onSubmit(response.data)
        setSubmitStatus("success")
        toast.success("Paciente creado exitosamente")
      } else {
        setSubmitStatus("error")
        toast.error(response.error || "Error al crear el paciente")
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
            <FormFieldWrapper label="DNI/NIE" required error={errors.identification}>
              <Input
                value={formData.identification}
                onChange={(e) => updateField("identification", e.target.value)}
                placeholder="12345678A"
                className={errors.identification ? "border-red-500" : ""}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Fecha de Nacimiento" required error={errors.birthDate}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.birthDate && "text-muted-foreground",
                      errors.birthDate && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate ? (
                      format(formData.birthDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => updateField("birthDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormFieldWrapper>

            <FormFieldWrapper label="Género" required error={errors.gender}>
              <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormFieldWrapper>
          </div>
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
              Creando...
            </>
          ) : (
            "Crear Paciente"
          )}
        </Button>
      </div>
    </form>
  )
}
