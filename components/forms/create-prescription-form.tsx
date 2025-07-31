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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X, Pill, FileText, User, Stethoscope, Clock, AlertCircle } from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { AlertDescription, Alert } from "@/components/ui/alert"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface CreatePrescriptionFormProps {
  onSubmit: (prescriptionData: any) => void
  onCancel: () => void
}

// Datos de ejemplo
const patients = [
  { id: 1, name: "María González", age: 34, bloodType: "O+" },
  { id: 2, name: "Carlos Rodríguez", age: 45, bloodType: "A+" },
  { id: 3, name: "Laura Martín", age: 28, bloodType: "B-" },
  { id: 4, name: "Roberto Silva", age: 52, bloodType: "AB+" },
]

const doctors = [
  { id: 1, name: "Dr. Juan Pérez", specialty: "Cardiología" },
  { id: 2, name: "Dra. Ana López", specialty: "Pediatría" },
  { id: 3, name: "Dr. Miguel Torres", specialty: "Neurología" },
  { id: 4, name: "Dra. Carmen Ruiz", specialty: "Ginecología" },
]

const commonMedications = [
  "Paracetamol 500mg",
  "Ibuprofeno 400mg",
  "Amoxicilina 500mg",
  "Omeprazol 20mg",
  "Atorvastatina 20mg",
  "Metformina 850mg",
  "Losartán 50mg",
  "Aspirina 100mg",
  "Simvastatina 20mg",
  "Enalapril 10mg",
]

const frequencies = [
  "Cada 4 horas",
  "Cada 6 horas",
  "Cada 8 horas",
  "Cada 12 horas",
  "Una vez al día",
  "Dos veces al día",
  "Tres veces al día",
  "Según necesidad",
]

export function CreatePrescriptionForm({ onSubmit, onCancel }: CreatePrescriptionFormProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    prescriptionDate: new Date(),
    expiryDate: addDays(new Date(), 30),
    instructions: "",
    notes: "",
  })

  const [medications, setMedications] = useState<Medication[]>([])
  const [currentMedication, setCurrentMedication] = useState<Medication>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  // Agregar estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMedicationChange = (field: keyof Medication, value: string) => {
    setCurrentMedication((prev) => ({ ...prev, [field]: value }))
  }

  // Función de validación
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = "Debe seleccionar un paciente"
    if (!formData.doctorId) newErrors.doctorId = "Debe seleccionar un médico"
    if (!formData.diagnosis.trim()) newErrors.diagnosis = "El diagnóstico es obligatorio"
    if (medications.length === 0) newErrors.medications = "Debe agregar al menos un medicamento"

    // Validar fechas
    if (formData.expiryDate && formData.prescriptionDate) {
      if (formData.expiryDate <= formData.prescriptionDate) {
        newErrors.expiryDate = "La fecha de vencimiento debe ser posterior a la fecha de prescripción"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validación para medicamentos
  const validateMedication = () => {
    const newErrors: Record<string, string> = {}

    if (!currentMedication.name) newErrors.medicationName = "Seleccione un medicamento"
    if (!currentMedication.dosage.trim()) newErrors.medicationDosage = "La dosis es obligatoria"
    if (!currentMedication.frequency) newErrors.medicationFrequency = "La frecuencia es obligatoria"

    return Object.keys(newErrors).length === 0
  }

  // Actualizar addMedication
  const addMedication = () => {
    if (validateMedication()) {
      setMedications((prev) => [...prev, currentMedication])
      setCurrentMedication({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      })
      // Limpiar errores de medicamento
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.medicationName
        delete newErrors.medicationDosage
        delete newErrors.medicationFrequency
        return newErrors
      })
    }
  }

  // Función para eliminar medicamento
  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index))
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const prescriptionData = {
        ...formData,
        medications,
        id: `RX-${Date.now()}`,
        status: "Activa",
      }
      onSubmit(prescriptionData)
      setSubmitStatus("success")
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPatient = patients.find((p) => p.id.toString() === formData.patientId)
  const selectedDoctor = doctors.find((d) => d.id.toString() === formData.doctorId)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {submitStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.medications || "Por favor, corrige los errores en el formulario."}
          </AlertDescription>
        </Alert>
      )}
      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información General
          </CardTitle>
          <CardDescription>Datos básicos de la prescripción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Paciente *</Label>
              <Select value={formData.patientId} onValueChange={(value) => handleInputChange("patientId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{patient.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {patient.age} años
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPatient && (
                <div className="text-sm text-muted-foreground">
                  Edad: {selectedPatient.age} años | Tipo de sangre: {selectedPatient.bloodType}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Médico Prescriptor *</Label>
              <Select value={formData.doctorId} onValueChange={(value) => handleInputChange("doctorId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar médico" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        <span>{doctor.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {doctor.specialty}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDoctor && (
                <div className="text-sm text-muted-foreground">Especialidad: {selectedDoctor.specialty}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Prescripción</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.prescriptionDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.prescriptionDate ? (
                      format(formData.prescriptionDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.prescriptionDate}
                    onSelect={(date) => handleInputChange("prescriptionDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Vencimiento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? (
                      format(formData.expiryDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => handleInputChange("expiryDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Input
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange("diagnosis", e.target.value)}
              placeholder="Diagnóstico principal que justifica la prescripción"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Medicamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Medicamentos
          </CardTitle>
          <CardDescription>Agregar medicamentos a la prescripción</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulario para agregar medicamento */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3">Agregar Medicamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Medicamento *</Label>
                <Select value={currentMedication.name} onValueChange={(value) => handleMedicationChange("name", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar medicamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonMedications.map((med) => (
                      <SelectItem key={med} value={med}>
                        {med}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.medicationName && <p className="text-red-500 text-sm">{errors.medicationName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosis *</Label>
                <Input
                  id="dosage"
                  value={currentMedication.dosage}
                  onChange={(e) => handleMedicationChange("dosage", e.target.value)}
                  placeholder="ej: 1 tableta, 5ml, etc."
                />
                {errors.medicationDosage && <p className="text-red-500 text-sm">{errors.medicationDosage}</p>}
              </div>

              <div className="space-y-2">
                <Label>Frecuencia *</Label>
                <Select
                  value={currentMedication.frequency}
                  onValueChange={(value) => handleMedicationChange("frequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.medicationFrequency && <p className="text-red-500 text-sm">{errors.medicationFrequency}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duración</Label>
                <Input
                  id="duration"
                  value={currentMedication.duration}
                  onChange={(e) => handleMedicationChange("duration", e.target.value)}
                  placeholder="ej: 7 días, 2 semanas, etc."
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="medInstructions">Instrucciones Especiales</Label>
              <Textarea
                id="medInstructions"
                value={currentMedication.instructions}
                onChange={(e) => handleMedicationChange("instructions", e.target.value)}
                placeholder="Instrucciones específicas para este medicamento..."
                rows={2}
              />
            </div>

            <Button type="button" onClick={addMedication} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Medicamento
            </Button>
          </div>

          {/* Lista de medicamentos agregados */}
          {medications.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Medicamentos Agregados ({medications.length})</h4>
              {medications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{med.name}</span>
                        <Badge variant="outline">{med.dosage}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Frecuencia: {med.frequency}</span>
                        </div>
                        {med.duration && <div>Duración: {med.duration}</div>}
                        {med.instructions && <div>Instrucciones: {med.instructions}</div>}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instrucciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle>Instrucciones Generales</CardTitle>
          <CardDescription>Indicaciones adicionales para el paciente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructions">Instrucciones para el Paciente</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => handleInputChange("instructions", e.target.value)}
              placeholder="Instrucciones generales sobre el tratamiento, precauciones, etc."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Médicas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Notas adicionales para uso interno..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={medications.length === 0 || isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear Prescripción"}
        </Button>
      </div>
    </form>
  )
}
