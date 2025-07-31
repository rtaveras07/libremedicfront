"use client"

import { EnhancedCreatePatientForm } from "@/components/forms/enhanced-create-patient-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function NewPatientPage() {
  const router = useRouter()

  const handleSubmit = async (patientData: any) => {
    try {
      const response = await api.createPatient(patientData)
      
      if (response.success) {
        toast.success("Paciente creado exitosamente!")
        router.push("/patients")
      } else {
        toast.error(response.error || "Error al crear el paciente")
      }
    } catch (error) {
      console.error("Error creating patient:", error)
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    }
  }

  const handleCancel = () => {
    router.push("/patients")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Nuevo Paciente</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <EnhancedCreatePatientForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
