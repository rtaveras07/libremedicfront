"use client"

import { CreatePrescriptionForm } from "@/components/forms/create-prescription-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function NewPrescriptionPage() {
  const router = useRouter()

  const handleSubmit = (prescriptionData: any) => {
    console.log("Nueva prescripción:", prescriptionData)
    // Aquí iría la lógica para guardar la prescripción
    alert("Prescripción creada exitosamente!")
    router.push("/prescriptions")
  }

  const handleCancel = () => {
    router.push("/prescriptions")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Nueva Prescripción</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <CreatePrescriptionForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
