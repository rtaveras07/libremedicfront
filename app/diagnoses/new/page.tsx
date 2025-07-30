"use client"

import { CreateDiagnosisForm } from "@/components/forms/create-diagnosis-form"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export default function NewDiagnosisPage() {
  const router = useRouter()

  const handleSubmit = (diagnosisData: any) => {
    console.log("Nuevo diagnóstico:", diagnosisData)
    // Aquí iría la lógica para guardar el diagnóstico
    alert("Diagnóstico creado exitosamente!")
    router.push("/diagnoses")
  }

  const handleCancel = () => {
    router.push("/diagnoses")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Nuevo Diagnóstico</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <CreateDiagnosisForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
