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
import { AlertTriangle, CheckCircle, Loader2, Pill, User, Calendar, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, Prescription, Patient, User as Doctor } from "@/lib/api"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const validationSchema = {
  patientId: (value: string) => validationRules.required(value, "El paciente"),
  medication: (value: string) => validationRules.required(value, "El medicamento"),
  dosage: (value: string) => validationRules.required(value, "La dosis"),
  frequency: (value: string) => validationRules.required(value, "La frecuencia"),
  instructions: (value: string) => validationRules.required(value, "Las instrucciones"),
  startDate: (value: string) => validationRules.required(value, "La fecha de inicio"),
  endDate: () => "",
  prescribedBy: (value: string) => validationRules.required(value, "El médico"),
}

interface EditPrescriptionPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditPrescriptionPage({ params }: EditPrescriptionPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])

  const { formData, errors, isSubmitting, setIsSubmitting, validateForm, updateField } = useFormValidation(
    {
      patientId: "",
      medication: "",
      dosage: "",
      frequency: "",
      instructions: "",
      startDate: "",
      endDate: "",
      prescribedBy: "",
    },
    validationSchema,
  )

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const frequencyOptions = [
    "Una vez al día",
    "Dos veces al día",
    "Tres veces al día",
    "Cada 6 horas",
    "Cada 8 horas",
    "Cada 12 horas",
    "Según necesidad",
    "Antes de las comidas",
    "Después de las comidas",
    "Con el estómago vacío",
  ]

  useEffect(() => {
    loadPrescription()
    loadPatients()
    loadDoctors()
  }, [id])

  const loadPrescription = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getPrescription(id)
      
      if (response.success) {
        setPrescription(response.data)
        // Pre-fill form with prescription data
        updateField("patientId", response.data.patientId.toString())
        updateField("medication", response.data.medication)
        updateField("dosage", response.data.dosage)
        updateField("frequency", response.data.frequency)
        updateField("instructions", response.data.instructions)
        updateField("startDate", response.data.startDate.split('T')[0])
        updateField("endDate", response.data.endDate ? response.data.endDate.split('T')[0] : "")
        updateField("prescribedBy", response.data.prescribedBy.toString())
      } else {
        setError(response.error || "Error al cargar la prescripción")
        toast.error("Error al cargar la prescripción")
      }
    } catch (error) {
      console.error("Error loading prescription:", error)
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
      const prescriptionData = {
        patientId: parseInt(formData.patientId),
        medication: formData.medication,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        prescribedBy: parseInt(formData.prescribedBy),
      }

      const response = await api.updatePrescription(id, prescriptionData)
      
      if (response.success) {
        setSubmitStatus("success")
        toast.success("Prescripción actualizada exitosamente!")
        router.push("/prescriptions")
      } else {
        setSubmitStatus("error")
        toast.error(response.error || "Error al actualizar la prescripción")
      }
    } catch (error) {
      console.error("Error updating prescription:", error)
      setSubmitStatus("error")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/prescriptions")
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Prescripción</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando prescripción...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !prescription) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Prescripción</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error al cargar la prescripción</div>
              <p className="text-muted-foreground">{error || "Prescripción no encontrada"}</p>
              <button 
                onClick={() => router.push("/prescriptions")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Volver a Prescripciones
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
          <h1 className="text-xl font-semibold">Editar Prescripción: {prescription.medication}</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Información de la Prescripción
              </CardTitle>
              <CardDescription>
                Modifica la información de la prescripción según sea necesario.
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

                    <FormFieldWrapper label="Médico" required error={errors.prescribedBy}>
                      <Select
                        value={formData.prescribedBy}
                        onValueChange={(value) => updateField("prescribedBy", value)}
                      >
                        <SelectTrigger className={errors.prescribedBy ? "border-red-500" : ""}>
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

                {/* Información del Medicamento */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Pill className="h-4 w-4" />
                    Información del Medicamento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Medicamento" required error={errors.medication}>
                      <Input
                        value={formData.medication}
                        onChange={(e) => updateField("medication", e.target.value)}
                        placeholder="Nombre del medicamento"
                        className={errors.medication ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Dosis" required error={errors.dosage}>
                      <Input
                        value={formData.dosage}
                        onChange={(e) => updateField("dosage", e.target.value)}
                        placeholder="Ej: 500mg, 1 tableta"
                        className={errors.dosage ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper label="Frecuencia" required error={errors.frequency}>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => updateField("frequency", value)}
                    >
                      <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecciona la frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormFieldWrapper>

                  <FormFieldWrapper label="Instrucciones" required error={errors.instructions}>
                    <Input
                      value={formData.instructions}
                      onChange={(e) => updateField("instructions", e.target.value)}
                      placeholder="Instrucciones específicas para el paciente"
                      className={errors.instructions ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>
                </div>

                {/* Fechas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fechas de Tratamiento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Fecha de Inicio" required error={errors.startDate}>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className={errors.startDate ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Fecha de Fin" error={errors.endDate}>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateField("endDate", e.target.value)}
                        className={errors.endDate ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>
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
                      Prescripción actualizada exitosamente. Redirigiendo...
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
                      "Actualizar Prescripción"
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