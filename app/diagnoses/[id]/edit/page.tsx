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

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormFieldWrapper } from "@/components/forms/form-field-wrapper"
import { useFormValidation, validationRules } from "@/components/forms/form-validation-utils"
import { AlertTriangle, CheckCircle, Loader2, Stethoscope, User, Calendar, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, Diagnosis, Patient, User as Doctor } from "@/lib/api"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const validationSchema = {
  patientId: (value: string) => validationRules.required(value, "El paciente"),
  doctorId: (value: string) => validationRules.required(value, "El médico"),
  diagnosis: (value: string) => validationRules.required(value, "El diagnóstico"),
  symptoms: (value: string) => validationRules.required(value, "Los síntomas"),
  treatment: (value: string) => validationRules.required(value, "El tratamiento"),
  severity: (value: string) => validationRules.required(value, "La severidad"),
  status: (value: string) => validationRules.required(value, "El estado"),
  diagnosisDate: (value: string) => validationRules.required(value, "La fecha de diagnóstico"),
  followUpDate: () => "",
  notes: () => "",
}

interface EditDiagnosisPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditDiagnosisPage({ params }: EditDiagnosisPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])

  const { formData, errors, isSubmitting, setIsSubmitting, validateForm, updateField } = useFormValidation(
    {
      patientId: "",
      doctorId: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      severity: "",
      status: "",
      diagnosisDate: "",
      followUpDate: "",
      notes: "",
    },
    validationSchema,
  )

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const severityOptions = [
    "Leve",
    "Moderado",
    "Grave",
  ]

  const statusOptions = [
    "Activo",
    "En Seguimiento",
    "Resuelto",
    "Crónico",
  ]

  useEffect(() => {
    loadDiagnosis()
    loadPatients()
    loadDoctors()
  }, [id])

  const loadDiagnosis = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getDiagnosis(id)
      
      if (response.success) {
        setDiagnosis(response.data)
        // Pre-fill form with diagnosis data
        updateField("patientId", response.data.patientId.toString())
        updateField("doctorId", response.data.doctorId.toString())
        updateField("diagnosis", response.data.diagnosis)
        updateField("symptoms", response.data.symptoms)
        updateField("treatment", response.data.treatment)
        updateField("severity", response.data.severity)
        updateField("status", response.data.status)
        updateField("diagnosisDate", response.data.diagnosisDate.split('T')[0])
        updateField("followUpDate", response.data.followUpDate ? response.data.followUpDate.split('T')[0] : "")
        updateField("notes", response.data.notes || "")
      } else {
        setError(response.error || "Error al cargar el diagnóstico")
        toast.error("Error al cargar el diagnóstico")
      }
    } catch (error) {
      console.error("Error loading diagnosis:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadPatients = async () => {
    try {
      const response = await api.getPatients()
      if (response.success) {
        setPatients(response.data || [])
      }
    } catch (error) {
      console.error("Error loading patients:", error)
    }
  }

  const loadDoctors = async () => {
    try {
      const response = await api.getUsers()
      if (response.success) {
        setDoctors(response.data || [])
      }
    } catch (error) {
      console.error("Error loading doctors:", error)
    }
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
      const diagnosisData = {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        diagnosis: formData.diagnosis,
        symptoms: formData.symptoms,
        treatment: formData.treatment,
        severity: formData.severity,
        status: formData.status,
        diagnosisDate: formData.diagnosisDate,
        followUpDate: formData.followUpDate || null,
        notes: formData.notes || null,
      }

      const response = await api.updateDiagnosis(id, diagnosisData)
      
      if (response.success) {
        setSubmitStatus("success")
        toast.success("Diagnóstico actualizado exitosamente!")
        router.push("/diagnoses")
      } else {
        setSubmitStatus("error")
        toast.error(response.error || "Error al actualizar el diagnóstico")
      }
    } catch (error) {
      console.error("Error updating diagnosis:", error)
      setSubmitStatus("error")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/diagnoses")
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Diagnóstico</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando diagnóstico...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !diagnosis) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Diagnóstico</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error al cargar el diagnóstico</div>
              <p className="text-muted-foreground">{error || "Diagnóstico no encontrado"}</p>
              <button 
                onClick={() => router.push("/diagnoses")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Volver a Diagnósticos
              </button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Editar Diagnóstico: {diagnosis.diagnosis}</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Información del Diagnóstico
              </CardTitle>
              <CardDescription>
                Modifica la información del diagnóstico según sea necesario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selección de Paciente y Médico */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Selección de Paciente y Médico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Paciente" required error={errors.patientId}>
                      <Select
                        value={formData.patientId}
                        onValueChange={(value) => updateField("patientId", value)}
                      >
                        <SelectTrigger className={errors.patientId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona un paciente" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.firstName} {patient.lastName} - {patient.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Médico" required error={errors.doctorId}>
                      <Select
                        value={formData.doctorId}
                        onValueChange={(value) => updateField("doctorId", value)}
                      >
                        <SelectTrigger className={errors.doctorId ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona un médico" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              Dr. {doctor.firstName} {doctor.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>
                  </div>
                </div>

                {/* Información del Diagnóstico */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Información del Diagnóstico
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Diagnóstico Principal" required error={errors.diagnosis}>
                      <Input
                        value={formData.diagnosis}
                        onChange={(e) => updateField("diagnosis", e.target.value)}
                        placeholder="Diagnóstico principal"
                        className={errors.diagnosis ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Severidad" required error={errors.severity}>
                      <Select
                        value={formData.severity}
                        onValueChange={(value) => updateField("severity", value)}
                      >
                        <SelectTrigger className={errors.severity ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona la severidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {severityOptions.map((severity) => (
                            <SelectItem key={severity} value={severity}>
                              {severity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper label="Síntomas" required error={errors.symptoms}>
                    <Input
                      value={formData.symptoms}
                      onChange={(e) => updateField("symptoms", e.target.value)}
                      placeholder="Descripción de los síntomas"
                      className={errors.symptoms ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="Tratamiento" required error={errors.treatment}>
                    <Input
                      value={formData.treatment}
                      onChange={(e) => updateField("treatment", e.target.value)}
                      placeholder="Plan de tratamiento"
                      className={errors.treatment ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>
                </div>

                {/* Estado y Fechas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Estado y Fechas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormFieldWrapper label="Estado" required error={errors.status}>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => updateField("status", value)}
                      >
                        <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Fecha de Diagnóstico" required error={errors.diagnosisDate}>
                      <Input
                        type="date"
                        value={formData.diagnosisDate}
                        onChange={(e) => updateField("diagnosisDate", e.target.value)}
                        className={errors.diagnosisDate ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Fecha de Seguimiento" error={errors.followUpDate}>
                      <Input
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) => updateField("followUpDate", e.target.value)}
                        className={errors.followUpDate ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>
                </div>

                {/* Notas Adicionales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Notas Adicionales
                  </h3>
                  <FormFieldWrapper label="Notas" error={errors.notes}>
                    <Input
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Notas adicionales sobre el diagnóstico"
                      className={errors.notes ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>
                </div>

                {/* Alertas de Estado */}
                {submitStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Ha ocurrido un error. Por favor, verifica los datos e intenta nuevamente.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === "success" && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Diagnóstico actualizado exitosamente. Redirigiendo...
                    </AlertDescription>
                  </Alert>
                )}

                {/* Botones de Acción */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      "Actualizar Diagnóstico"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 