"use client"

import { CreatePatientForm } from "@/components/forms/create-patient-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function NewPatientPage() {
  const router = useRouter()

  const handleSubmit = (patientData: any) => {
    console.log("Nuevo paciente:", patientData)
    // Aquí iría la lógica para guardar el paciente
    alert("Paciente creado exitosamente!")
    router.push("/patients")
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
          <CreatePatientForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
