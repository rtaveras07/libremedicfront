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
import { CalendarIcon, Plus, X, Stethoscope, User, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface CreateDiagnosisFormProps {
  onSubmit: (diagnosisData: any) => void
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

const commonSymptoms = [
  "Dolor de cabeza",
  "Fiebre",
  "Tos",
  "Dolor abdominal",
  "Náuseas",
  "Vómitos",
  "Diarrea",
  "Fatiga",
  "Mareos",
  "Dolor de garganta",
  "Dificultad para respirar",
  "Dolor en el pecho",
]

const severityLevels = [
  { value: "leve", label: "Leve", color: "bg-green-100 text-green-800" },
  { value: "moderado", label: "Moderado", color: "bg-yellow-100 text-yellow-800" },
  { value: "severo", label: "Severo", color: "bg-red-100 text-red-800" },
  { value: "critico", label: "Crítico", color: "bg-red-200 text-red-900" },
]

const diagnosisTypes = [
  "Diagnóstico Principal",
  "Diagnóstico Secundario",
  "Diagnóstico Diferencial",
  "Diagnóstico Provisional",
]

export function CreateDiagnosisForm({ onSubmit, onCancel }: CreateDiagnosisFormProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    consultationDate: new Date(),
    chiefComplaint: "",
    presentIllness: "",
    physicalExamination: "",
    primaryDiagnosis: "",
    diagnosisType: "",
    severity: "",
    icd10Code: "",
    treatment: "",
    recommendations: "",
    followUpDate: undefined as Date | undefined,
    notes: "",
  })

  const [symptoms, setSymptoms] = useState<string[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState<string[]>([])
  const [newSecondaryDiagnosis, setNewSecondaryDiagnosis] = useState("")

  // Agregar estados de validación
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addSymptom = () => {
    if (newSymptom.trim() && !symptoms.includes(newSymptom.trim())) {
      setSymptoms((prev) => [...prev, newSymptom.trim()])
      setNewSymptom("")
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms((prev) => prev.filter((s) => s !== symptom))
  }

  const addSecondaryDiagnosis = () => {
    if (newSecondaryDiagnosis.trim() && !secondaryDiagnoses.includes(newSecondaryDiagnosis.trim())) {
      setSecondaryDiagnoses((prev) => [...prev, newSecondaryDiagnosis.trim()])
      setNewSecondaryDiagnosis("")
    }
  }

  const removeSecondaryDiagnosis = (diagnosis: string) => {
    setSecondaryDiagnoses((prev) => prev.filter((d) => d !== diagnosis))
  }

  // Función de validación
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = "Debe seleccionar un paciente"
    if (!formData.doctorId) newErrors.doctorId = "Debe seleccionar un médico"
    if (!formData.chiefComplaint.trim()) newErrors.chiefComplaint = "El motivo de consulta es obligatorio"
    if (!formData.primaryDiagnosis.trim()) newErrors.primaryDiagnosis = "El diagnóstico principal es obligatorio"
    if (symptoms.length === 0) newErrors.symptoms = "Debe agregar al menos un síntoma"

    // Validar código CIE-10 si se proporciona
    if (formData.icd10Code && !/^[A-Z]\d{2}(\.\d{1,2})?$/.test(formData.icd10Code)) {
      newErrors.icd10Code = "Formato de código CIE-10 inválido (ej: J06.9)"
    }

    // Validar fecha de seguimiento
    if (formData.followUpDate && formData.consultationDate) {
      if (formData.followUpDate <= formData.consultationDate) {
        newErrors.followUpDate = "La fecha de seguimiento debe ser posterior a la consulta"
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const diagnosisData = {
        ...formData,
        symptoms,
        secondaryDiagnoses,
        id: `DX-${Date.now()}`,
        status: "Completado",
      }
      onSubmit(diagnosisData)
      setSubmitStatus("success")
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPatient = patients.find((p) => p.id.toString() === formData.patientId)
  const selectedDoctor = doctors.find((d) => d.id.toString() === formData.doctorId)
  const selectedSeverity = severityLevels.find((s) => s.value === formData.severity)

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {submitStatus === "error" && (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <AlertCircle className="h-4 w-4 inline-block mr-2" />
          {errors.symptoms || "Por favor, corrige los errores en el formulario."}
        </div>
      )}
      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Información General
          </CardTitle>
          <CardDescription>Datos básicos de la consulta y diagnóstico</CardDescription>
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
              <Label>Médico Responsable *</Label>
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

          <div className="space-y-2">
            <Label>Fecha de Consulta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.consultationDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.consultationDate ? (
                    format(formData.consultationDate, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.consultationDate}
                  onSelect={(date) => handleInputChange("consultationDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Motivo de Consulta y Síntomas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Motivo de Consulta y Síntomas
          </CardTitle>
          <CardDescription>Información sobre la consulta actual</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Motivo Principal de Consulta *</Label>
            <Textarea
              id="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
              placeholder="Describe el motivo principal por el cual el paciente acude a consulta..."
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Síntomas Presentados</Label>
            <div className="flex gap-2">
              <Select value={newSymptom} onValueChange={setNewSymptom}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar síntoma común" />
                </SelectTrigger>
                <SelectContent>
                  {commonSymptoms.map((symptom) => (
                    <SelectItem key={symptom} value={symptom}>
                      {symptom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSymptom} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                placeholder="O escribir síntoma personalizado"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSymptom())}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {symptom}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSymptom(symptom)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="presentIllness">Historia de la Enfermedad Actual</Label>
            <Textarea
              id="presentIllness"
              value={formData.presentIllness}
              onChange={(e) => handleInputChange("presentIllness", e.target.value)}
              placeholder="Describe la evolución de los síntomas, duración, factores que los mejoran o empeoran..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Examen Físico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Examen Físico
          </CardTitle>
          <CardDescription>Hallazgos del examen físico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="physicalExamination">Hallazgos del Examen Físico</Label>
            <Textarea
              id="physicalExamination"
              value={formData.physicalExamination}
              onChange={(e) => handleInputChange("physicalExamination", e.target.value)}
              placeholder="Describe los hallazgos relevantes del examen físico: signos vitales, inspección, palpación, auscultación..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Diagnóstico
          </CardTitle>
          <CardDescription>Diagnóstico principal y secundarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryDiagnosis">Diagnóstico Principal *</Label>
              <Input
                id="primaryDiagnosis"
                value={formData.primaryDiagnosis}
                onChange={(e) => handleInputChange("primaryDiagnosis", e.target.value)}
                placeholder="Diagnóstico principal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icd10Code">Código CIE-10</Label>
              <Input
                id="icd10Code"
                value={formData.icd10Code}
                onChange={(e) => handleInputChange("icd10Code", e.target.value)}
                placeholder="ej: J06.9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Diagnóstico</Label>
              <Select
                value={formData.diagnosisType}
                onValueChange={(value) => handleInputChange("diagnosisType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {diagnosisTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Severidad</Label>
              <Select value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar severidad" />
                </SelectTrigger>
                <SelectContent>
                  {severityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${level.color}`} />
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSeverity && <Badge className={selectedSeverity.color}>{selectedSeverity.label}</Badge>}
            </div>
          </div>

          {/* Diagnósticos Secundarios */}
          <div className="space-y-2">
            <Label>Diagnósticos Secundarios</Label>
            <div className="flex gap-2">
              <Input
                value={newSecondaryDiagnosis}
                onChange={(e) => setNewSecondaryDiagnosis(e.target.value)}
                placeholder="Agregar diagnóstico secundario"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSecondaryDiagnosis())}
              />
              <Button type="button" onClick={addSecondaryDiagnosis} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {secondaryDiagnoses.map((diagnosis, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {diagnosis}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeSecondaryDiagnosis(diagnosis)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tratamiento y Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Tratamiento y Recomendaciones</CardTitle>
          <CardDescription>Plan de tratamiento y seguimiento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="treatment">Plan de Tratamiento</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => handleInputChange("treatment", e.target.value)}
              placeholder="Describe el plan de tratamiento: medicamentos, procedimientos, terapias..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendations">Recomendaciones</Label>
            <Textarea
              id="recommendations"
              value={formData.recommendations}
              onChange={(e) => handleInputChange("recommendations", e.target.value)}
              placeholder="Recomendaciones para el paciente: cuidados, actividades, dieta..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha de Seguimiento</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.followUpDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.followUpDate ? (
                    format(formData.followUpDate, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha de seguimiento</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.followUpDate}
                  onSelect={(date) => handleInputChange("followUpDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear Diagnóstico"}
        </Button>
      </div>
    </form>
  )
}
