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

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, User, Phone, Mail, MapPin, Heart, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface CreatePatientFormProps {
  onSubmit: (patientData: any) => void
  onCancel: () => void
}

export function CreatePatientForm({ onSubmit, onCancel }: CreatePatientFormProps) {
  const [formData, setFormData] = useState({
    // Información personal
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: undefined as Date | undefined,
    gender: "",
    identification: "",

    // Información médica
    bloodType: "",
    allergies: [] as string[],
    chronicConditions: [] as string[],
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },

    // Dirección
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "España",
    },

    // Información adicional
    occupation: "",
    insurance: "",
    notes: "",
  })

  // Agregar estados para validación y errores
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const genders = ["Masculino", "Femenino", "Otro", "Prefiero no decir"]
  const relationships = ["Cónyuge", "Padre/Madre", "Hijo/Hija", "Hermano/Hermana", "Amigo/Amiga", "Otro"]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, newCondition.trim()],
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== index),
    }))
  }

  // Función de validación
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validaciones obligatorias
    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es obligatorio"
    if (!formData.lastName.trim()) newErrors.lastName = "Los apellidos son obligatorios"
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio"
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido"
    }
    if (!formData.identification.trim()) newErrors.identification = "El DNI/NIE es obligatorio"
    if (!formData.birthDate) newErrors.birthDate = "La fecha de nacimiento es obligatoria"
    if (!formData.gender) newErrors.gender = "El género es obligatorio"

    // Validar edad
    if (formData.birthDate) {
      const age = new Date().getFullYear() - formData.birthDate.getFullYear()
      if (age < 0 || age > 150) {
        newErrors.birthDate = "Fecha de nacimiento inválida"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Actualizar handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simular API call
      onSubmit(formData)
      setSubmitStatus("success")
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
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
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => {
                  handleInputChange("firstName", e.target.value)
                  if (errors.firstName) {
                    setErrors((prev) => ({ ...prev, firstName: "" }))
                  }
                }}
                placeholder="Nombre del paciente"
                className={errors.firstName ? "border-red-500" : ""}
                required
              />
              {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  handleInputChange("lastName", e.target.value)
                  if (errors.lastName) {
                    setErrors((prev) => ({ ...prev, lastName: "" }))
                  }
                }}
                placeholder="Apellidos del paciente"
                className={errors.lastName ? "border-red-500" : ""}
                required
              />
              {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange("email", e.target.value)
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }))
                    }
                  }}
                  placeholder="correo@ejemplo.com"
                  className={cn("pl-10", errors.email ? "border-red-500" : "")}
                  required
                />
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    handleInputChange("phone", e.target.value)
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: "" }))
                    }
                  }}
                  placeholder="+34 612 345 678"
                  className={cn("pl-10", errors.phone ? "border-red-500" : "")}
                  required
                />
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="identification">DNI/NIE *</Label>
              <Input
                id="identification"
                value={formData.identification}
                onChange={(e) => {
                  handleInputChange("identification", e.target.value)
                  if (errors.identification) {
                    setErrors((prev) => ({ ...prev, identification: "" }))
                  }
                }}
                placeholder="12345678A"
                className={errors.identification ? "border-red-500" : ""}
                required
              />
              {errors.identification && <p className="text-sm text-red-600 mt-1">{errors.identification}</p>}
            </div>
            <div className="space-y-2">
              <Label>Fecha de Nacimiento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.birthDate && "text-muted-foreground",
                      errors.birthDate ? "border-red-500" : "",
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
                    onSelect={(date) => {
                      handleInputChange("birthDate", date)
                      if (errors.birthDate) {
                        setErrors((prev) => ({ ...prev, birthDate: "" }))
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.birthDate && <p className="text-sm text-red-600 mt-1">{errors.birthDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>Género *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => {
                  handleInputChange("gender", value)
                  if (errors.gender) {
                    setErrors((prev) => ({ ...prev, gender: "" }))
                  }
                }}
              >
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
              {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Médica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Información Médica
          </CardTitle>
          <CardDescription>Datos médicos relevantes del paciente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Sangre</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de sangre" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="insurance">Seguro Médico</Label>
              <Input
                id="insurance"
                value={formData.insurance}
                onChange={(e) => handleInputChange("insurance", e.target.value)}
                placeholder="Nombre del seguro médico"
              />
            </div>
          </div>

          {/* Alergias */}
          <div className="space-y-2">
            <Label>Alergias</Label>
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Agregar alergia"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
              />
              <Button type="button" onClick={addAllergy} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {allergy}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeAllergy(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Condiciones Crónicas */}
          <div className="space-y-2">
            <Label>Condiciones Crónicas</Label>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Agregar condición crónica"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
              />
              <Button type="button" onClick={addCondition} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.chronicConditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {condition}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeCondition(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Contacto de Emergencia
          </CardTitle>
          <CardDescription>Persona a contactar en caso de emergencia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyName">Nombre Completo</Label>
              <Input
                id="emergencyName"
                value={formData.emergencyContact.name}
                onChange={(e) => handleInputChange("emergencyContact.name", e.target.value)}
                placeholder="Nombre del contacto"
              />
            </div>
            <div className="space-y-2">
              <Label>Relación</Label>
              <Select
                value={formData.emergencyContact.relationship}
                onValueChange={(value) => handleInputChange("emergencyContact.relationship", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar relación" />
                </SelectTrigger>
                <SelectContent>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Teléfono</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyContact.phone}
                onChange={(e) => handleInputChange("emergencyContact.phone", e.target.value)}
                placeholder="+34 612 345 678"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dirección */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Dirección
          </CardTitle>
          <CardDescription>Dirección de residencia del paciente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Calle y Número</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => handleInputChange("address.street", e.target.value)}
              placeholder="Calle Mayor, 123"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange("address.city", e.target.value)}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Provincia/Estado</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleInputChange("address.state", e.target.value)}
                placeholder="Madrid"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Código Postal</Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                placeholder="28001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
          <CardDescription>Datos complementarios del paciente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="occupation">Ocupación</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => handleInputChange("occupation", e.target.value)}
              placeholder="Profesión o trabajo del paciente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Información adicional relevante sobre el paciente..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {submitStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Por favor, corrige los errores en el formulario antes de continuar.</AlertDescription>
        </Alert>
      )}

      {submitStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Paciente creado exitosamente.</AlertDescription>
        </Alert>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear Paciente"}
        </Button>
      </div>
    </form>
  )
}
