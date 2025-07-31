"use client"

import { useState, useEffect, use } from "react"
import { EnhancedCreatePatientForm } from "@/components/forms/enhanced-create-patient-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { api, Patient } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface EditPatientPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPatient()
  }, [id])

  const loadPatient = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getPatient(id)
      
      if (response.success) {
        setPatient(response.data)
      } else {
        setError(response.error || "Error al cargar el paciente")
        toast.error("Error al cargar el paciente")
      }
    } catch (error) {
      console.error("Error loading patient:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (patientData: any) => {
    try {
      const response = await api.updatePatient(id, patientData)
      
      if (response.success) {
        toast.success("Paciente actualizado exitosamente!")
        router.push("/patients")
      } else {
        toast.error(response.error || "Error al actualizar el paciente")
      }
    } catch (error) {
      console.error("Error updating patient:", error)
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    }
  }

  const handleCancel = () => {
    router.push("/patients")
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Paciente</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando paciente...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !patient) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Editar Paciente</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error al cargar el paciente</div>
              <p className="text-muted-foreground">{error || "Paciente no encontrado"}</p>
              <button 
                onClick={() => router.push("/patients")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Volver a Pacientes
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
          <h1 className="text-xl font-semibold">Editar Paciente: {patient.firstName} {patient.lastName}</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <EnhancedCreatePatientForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            initialData={patient}
            isEditing={true}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 