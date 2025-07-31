"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { api, Prescription } from "@/lib/api"
import { toast } from "sonner"
import { 
  Loader2, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  User, 
  Pill, 
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PrescriptionDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PrescriptionDetailPage({ params }: PrescriptionDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadPrescription()
  }, [id])

  const loadPrescription = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getPrescription(id)
      
      if (response.success) {
        setPrescription(response.data)
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

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await api.deletePrescription(id)
      
      if (response.success) {
        toast.success("Prescripción eliminada exitosamente!")
        router.push("/prescriptions")
      } else {
        toast.error(response.error || "Error al eliminar la prescripción")
      }
    } catch (error) {
      console.error("Error deleting prescription:", error)
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsDeleting(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (endDate: string | undefined) => {
    if (!endDate) return 'bg-blue-100 text-blue-800'
    
    const end = new Date(endDate)
    const today = new Date()
    
    if (end < today) {
      return 'bg-red-100 text-red-800'
    } else if (end.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return 'bg-yellow-100 text-yellow-800'
    } else {
      return 'bg-green-100 text-green-800'
    }
  }

  const getStatusText = (endDate: string | undefined) => {
    if (!endDate) return 'Activa'
    
    const end = new Date(endDate)
    const today = new Date()
    
    if (end < today) {
      return 'Vencida'
    } else if (end.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return 'Por Vencer'
    } else {
      return 'Activa'
    }
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Detalles de la Prescripción</h1>
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
            <h1 className="text-xl font-semibold">Detalles de la Prescripción</h1>
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
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold">Detalles de la Prescripción</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/prescriptions")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/prescriptions/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente la prescripción de{" "}
                      <strong>{prescription.medication}</strong> y todos sus datos asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          <div className="grid gap-6">
            {/* Información de la Prescripción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Información de la Prescripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Medicamento</label>
                      <p className="text-lg font-semibold">{prescription.medication}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Dosis</label>
                      <p className="text-lg">{prescription.dosage}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Frecuencia</label>
                      <p className="text-lg">{prescription.frequency}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Instrucciones</label>
                      <p className="text-lg">{prescription.instructions}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estado</label>
                      <Badge className={`text-lg px-3 py-1 ${getStatusColor(prescription.endDate)}`}>
                        {getStatusText(prescription.endDate)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha de Inicio</label>
                      <p className="text-lg">{formatDate(prescription.startDate)}</p>
                    </div>
                    {prescription.endDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Fecha de Fin</label>
                        <p className="text-lg">{formatDate(prescription.endDate)}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Duración</label>
                      <p className="text-lg">
                        {prescription.endDate ? (
                          (() => {
                            const start = new Date(prescription.startDate)
                            const end = new Date(prescription.endDate)
                            const diffTime = Math.abs(end.getTime() - start.getTime())
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            return `${diffDays} días`
                          })()
                        ) : (
                          'Sin fecha de fin definida'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del Médico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prescription.user ? (
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">
                        {getInitials(prescription.user.firstName, prescription.user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                          <p className="text-lg font-semibold">Dr. {prescription.user.firstName} {prescription.user.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-lg">{prescription.user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Información del médico no disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Información del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                    <p className="text-lg">{formatDate(prescription.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                    <p className="text-lg">{formatDate(prescription.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 