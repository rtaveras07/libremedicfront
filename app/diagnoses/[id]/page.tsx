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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { api, Diagnosis } from "@/lib/api"
import { toast } from "sonner"
import { 
  Loader2, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  User, 
  Stethoscope, 
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

interface DiagnosisDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function DiagnosisDetailPage({ params }: DiagnosisDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadDiagnosis()
  }, [id])

  const loadDiagnosis = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getDiagnosis(id)
      
      if (response.success) {
        setDiagnosis(response.data)
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

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await api.deleteDiagnosis(id)
      
      if (response.success) {
        toast.success("Diagnóstico eliminado exitosamente!")
        router.push("/diagnoses")
      } else {
        toast.error(response.error || "Error al eliminar el diagnóstico")
      }
    } catch (error) {
      console.error("Error deleting diagnosis:", error)
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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'leve':
        return 'bg-green-100 text-green-800'
      case 'moderado':
        return 'bg-yellow-100 text-yellow-800'
      case 'grave':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'bg-blue-100 text-blue-800'
      case 'resuelto':
        return 'bg-green-100 text-green-800'
      case 'en seguimiento':
        return 'bg-yellow-100 text-yellow-800'
      case 'crónico':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
            <h1 className="text-xl font-semibold">Detalles del Diagnóstico</h1>
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
            <h1 className="text-xl font-semibold">Detalles del Diagnóstico</h1>
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
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold">Detalles del Diagnóstico</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/diagnoses")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/diagnoses/${id}/edit`)}
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
                      Esta acción no se puede deshacer. Se eliminará permanentemente el diagnóstico{" "}
                      <strong>{diagnosis.diagnosis}</strong> y todos sus datos asociados.
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
            {/* Información del Diagnóstico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Información del Diagnóstico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Diagnóstico Principal</label>
                      <p className="text-lg font-semibold">{diagnosis.diagnosis}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Síntomas</label>
                      <p className="text-lg">{diagnosis.symptoms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tratamiento</label>
                      <p className="text-lg">{diagnosis.treatment}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Severidad</label>
                      <Badge className={`text-lg px-3 py-1 ${getSeverityColor(diagnosis.severity)}`}>
                        {diagnosis.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estado</label>
                      <Badge className={`text-lg px-3 py-1 ${getStatusColor(diagnosis.status)}`}>
                        {diagnosis.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha de Diagnóstico</label>
                      <p className="text-lg">{formatDate(diagnosis.diagnosisDate)}</p>
                    </div>
                    {diagnosis.followUpDate && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Fecha de Seguimiento</label>
                        <p className="text-lg">{formatDate(diagnosis.followUpDate)}</p>
                      </div>
                    )}
                  </div>
                </div>
                {diagnosis.notes && (
                  <div className="mt-6">
                    <label className="text-sm font-medium text-muted-foreground">Notas Adicionales</label>
                    <p className="text-lg mt-2">{diagnosis.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del Paciente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosis.Patient ? (
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">
                        {getInitials(diagnosis.Patient.firstName, diagnosis.Patient.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                          <p className="text-lg font-semibold">{diagnosis.Patient.firstName} {diagnosis.Patient.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-lg">{diagnosis.Patient.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                          <p className="text-lg">{diagnosis.Patient.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
                          <p className="text-lg">{formatDate(diagnosis.Patient.dateOfBirth)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                        <p className="text-lg">{diagnosis.Patient.address}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Información del paciente no disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información del Médico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Información del Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosis.Doctor ? (
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">
                        {getInitials(diagnosis.Doctor.firstName, diagnosis.Doctor.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                          <p className="text-lg font-semibold">Dr. {diagnosis.Doctor.firstName} {diagnosis.Doctor.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-lg">{diagnosis.Doctor.email}</p>
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
                    <p className="text-lg">{formatDate(diagnosis.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                    <p className="text-lg">{formatDate(diagnosis.updatedAt)}</p>
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