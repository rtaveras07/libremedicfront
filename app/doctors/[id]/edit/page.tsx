"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormFieldWrapper } from "@/components/forms/form-field-wrapper"
import { useFormValidation, validationRules } from "@/components/forms/form-validation-utils"
import { AlertTriangle, CheckCircle, Loader2, User as UserIcon, Phone, Mail, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { api, User } from "@/lib/api"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

const validationSchema = {
  firstName: (value: string) => validationRules.required(value, "El nombre"),
  lastName: (value: string) => validationRules.required(value, "Los apellidos"),
  email: validationRules.email,
  phone: validationRules.phone,
  specialty: (value: string) => validationRules.required(value, "La especialidad"),
  licenseNumber: (value: string) => validationRules.required(value, "El número de licencia"),
  address: () => "",
}

interface EditDoctorPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditDoctorPage({ params }: EditDoctorPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [doctor, setDoctor] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { formData, errors, isSubmitting, setIsSubmitting, validateForm, updateField } = useFormValidation(
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialty: "",
      licenseNumber: "",
      address: "",
    },
    validationSchema,
  )

  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const specialties = [
    "Cardiología",
    "Dermatología",
    "Endocrinología",
    "Gastroenterología",
    "Ginecología",
    "Hematología",
    "Infectología",
    "Medicina Interna",
    "Nefrología",
    "Neurología",
    "Oncología",
    "Oftalmología",
    "Ortopedia",
    "Otorrinolaringología",
    "Pediatría",
    "Psiquiatría",
    "Radiología",
    "Reumatología",
    "Traumatología",
    "Urología",
  ]

  useEffect(() => {
    loadDoctor()
  }, [id])

  const loadDoctor = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getUser(id)
      
      if (response.success) {
        setDoctor(response.data)
        // Pre-fill form with doctor data
        updateField("firstName", response.data.firstName)
        updateField("lastName", response.data.lastName)
        updateField("email", response.data.email)
        updateField("phone", response.data.phone)
        updateField("specialty", response.data.specialty || "")
        updateField("licenseNumber", response.data.licenseNumber || "")
        updateField("address", response.data.address || "")
      } else {
        setError(response.error || "Error al cargar el médico")
        toast.error("Error al cargar el médico")
      }
    } catch (error) {
      console.error("Error loading doctor:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
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
      const doctorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        licenseNumber: formData.licenseNumber,
        address: formData.address,
      }

      const response = await api.updateUser(id, doctorData)
      
      if (response.success) {
        setSubmitStatus("success")
        toast.success("Médico actualizado exitosamente!")
        router.push("/doctors")
      } else {
        setSubmitStatus("error")
        toast.error(response.error || "Error al actualizar el médico")
      }
    } catch (error) {
      console.error("Error updating doctor:", error)
      setSubmitStatus("error")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/doctors")
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Médico</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando médico...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !doctor) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Médico</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error al cargar el médico</div>
              <p className="text-muted-foreground">{error || "Médico no encontrado"}</p>
              <button 
                onClick={() => router.push("/doctors")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Volver a Médicos
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
          <h1 className="text-xl font-semibold">Editar Médico: {doctor.firstName} {doctor.lastName}</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Información del Médico
              </CardTitle>
              <CardDescription>
                Modifica la información del médico según sea necesario.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Información Personal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Nombre" required error={errors.firstName}>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        placeholder="Nombre del médico"
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Apellidos" required error={errors.lastName}>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        placeholder="Apellidos del médico"
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>
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
                        placeholder="email@ejemplo.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Teléfono" required error={errors.phone}>
                      <Input
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+34 600 000 000"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>
                </div>

                {/* Información Profesional */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Información Profesional
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldWrapper label="Especialidad" required error={errors.specialty}>
                      <Select
                        value={formData.specialty}
                        onValueChange={(value) => updateField("specialty", value)}
                      >
                        <SelectTrigger className={errors.specialty ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecciona una especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldWrapper>

                    <FormFieldWrapper label="Número de Licencia" required error={errors.licenseNumber}>
                      <Input
                        value={formData.licenseNumber}
                        onChange={(e) => updateField("licenseNumber", e.target.value)}
                        placeholder="Número de licencia médica"
                        className={errors.licenseNumber ? "border-red-500" : ""}
                      />
                    </FormFieldWrapper>
                  </div>

                  <FormFieldWrapper label="Dirección" error={errors.address}>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Dirección del consultorio"
                      className={errors.address ? "border-red-500" : ""}
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
                      Médico actualizado exitosamente. Redirigiendo...
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
                      "Actualizar Médico"
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