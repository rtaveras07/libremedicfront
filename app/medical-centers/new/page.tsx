"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormFieldWrapper } from "@/components/forms/form-field-wrapper"
import { useFormValidation, validationRules } from "@/components/forms/form-validation-utils"
import { AlertTriangle, CheckCircle, Loader2, Building2, Phone, Mail, MapPin, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const initialFormData = {
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  type: "",
  capacity: "",
  description: "",
}

const validationSchema = {
  name: (value: string) => validationRules.required(value, "El nombre"),
  address: (value: string) => validationRules.required(value, "La dirección"),
  phone: validationRules.phone,
  email: validationRules.email,
  website: () => "",
  type: (value: string) => validationRules.required(value, "El tipo"),
  capacity: () => "",
  description: () => "",
}

export default function NewMedicalCenterPage() {
  const router = useRouter()
  const { formData, errors, isSubmitting, setIsSubmitting, validateForm, updateField } = useFormValidation(
    initialFormData,
    validationSchema,
  )

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const centerTypes = [
    "Hospital General",
    "Clínica Privada",
    "Centro de Salud",
    "Hospital Especializado",
    "Clínica Ambulatoria",
    "Centro de Diagnóstico",
    "Laboratorio Clínico",
    "Centro de Rehabilitación",
    "Hospital Pediátrico",
    "Centro de Urgencias",
  ]

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
      const centerData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        type: formData.type,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        description: formData.description,
      }

      const response = await api.createMedicalCenter(centerData)
      
      if (response.success) {
        setSubmitStatus("success")
        toast.success("Centro médico creado exitosamente!")
        router.push("/medical-centers")
      } else {
        setSubmitStatus("error")
        toast.error(response.error || "Error al crear el centro médico")
      }
    } catch (error) {
      console.error("Error creating medical center:", error)
      setSubmitStatus("error")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/medical-centers")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Nuevo Centro Médico</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Centro Médico
              </CardTitle>
              <CardDescription>
                Complete todos los campos requeridos para registrar un nuevo centro médico en el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Información Básica
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Nombre del Centro" required error={errors.name}>
                      <Input
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Nombre del centro médico"
                        className={errors.name ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Tipo de Centro" required error={errors.type}>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => updateField("type", value)}
                      >
                        <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {centerTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper label="Descripción" error={errors.description}>
                    <Input
                      value={formData.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      placeholder="Descripción del centro médico"
                      className={errors.description ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>
                </div>

                {/* Información de Contacto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Información de Contacto
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Email" required error={errors.email}>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="email@centromedico.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Teléfono" required error={errors.phone}>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+34 900 000 000"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper label="Sitio Web" error={errors.website}>
                    <Input
                      value={formData.website}
                      onChange={(e) => updateField("website", e.target.value)}
                      placeholder="https://www.centromedico.com"
                      className={errors.website ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>
                </div>

                {/* Información de Ubicación */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Información de Ubicación
                  </h3>
                  <FormFieldWrapper label="Dirección" required error={errors.address}>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Dirección completa del centro médico"
                      className={errors.address ? "border-red-500" : ""}
                    />
                  </FormFieldWrapper>
                </div>

                {/* Información de Capacidad */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Información de Capacidad
                  </h3>
                  <FormFieldWrapper label="Capacidad de Pacientes" error={errors.capacity}>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => updateField("capacity", e.target.value)}
                      placeholder="Número de pacientes que puede atender"
                      className={errors.capacity ? "border-red-500" : ""}
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
                      Centro médico creado exitosamente. Redirigiendo...
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
                        Creando...
                      </>
                    ) : (
                      "Crear Centro Médico"
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