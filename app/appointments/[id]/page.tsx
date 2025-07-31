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
import { api, Appointment } from "@/lib/api"
import { toast } from "sonner"
import { 
  Loader2, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock,
  FileText,
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

interface AppointmentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function AppointmentDetailPage({ params }: AppointmentDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadAppointment()
  }, [id])

  const loadAppointment = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getAppointment(id)
      
      if (response.success) {
        setAppointment(response.data)
      } else {
        setError(response.error || "Error al cargar la cita")
        toast.error("Error al cargar la cita")
      }
    } catch (error) {
      console.error("Error loading appointment:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await api.deleteAppointment(id)
      
      if (response.success) {
        toast.success("Cita eliminada exitosamente!")
        router.push("/appointments")
      } else {
        toast.error(response.error || "Error al eliminar la cita")
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
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

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'programada':
        return 'bg-blue-100 text-blue-800'
      case 'confirmada':
        return 'bg-green-100 text-green-800'
      case 'completada':
        return 'bg-purple-100 text-purple-800'
      case 'cancelada':
        return 'bg-red-100 text-red-800'
      case 'en progreso':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'programada':
        return <Calendar className="h-4 w-4" />
      case 'confirmada':
        return <CheckCircle className="h-4 w-4" />
      case 'completada':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelada':
        return <XCircle className="h-4 w-4" />
      case 'en progreso':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
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
            <h1 className="text-xl font-semibold">Detalles de la Cita</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando cita...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error || !appointment) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Detalles de la Cita</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error al cargar la cita</div>
              <p className="text-muted-foreground">{error || "Cita no encontrada"}</p>
              <button 
                onClick={() => router.push("/appointments")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Volver a Citas
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
            <h1 className="text-xl font-semibold">Detalles de la Cita</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/appointments")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/appointments/${id}/edit`)}
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
                      Esta acción no se puede deshacer. Se eliminará permanentemente la cita del{" "}
                      <strong>{formatDate(appointment.appointmentDate)}</strong> y todos sus datos asociados.
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
            {/* Información de la Cita */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Información de la Cita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                      <p className="text-lg font-semibold">{formatDate(appointment.appointmentDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Hora</label>
                      <p className="text-lg">{formatTime(appointment.appointmentTime)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Motivo</label>
                      <p className="text-lg">{appointment.reason}</p>
                    </div>
                    {appointment.notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Notas</label>
                        <p className="text-lg">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Estado</label>
                      <Badge className={`text-lg px-3 py-1 ${getStatusColor(appointment.status)}`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </div>
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ID de la Cita</label>
                      <p className="text-lg font-mono">#{appointment.id}</p>
                    </div>
                  </div>
                </div>
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
                {appointment.Patient ? (
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">
                        {getInitials(appointment.Patient.firstName, appointment.Patient.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                          <p className="text-lg font-semibold">{appointment.Patient.firstName} {appointment.Patient.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-lg">{appointment.Patient.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                          <p className="text-lg">{appointment.Patient.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
                          <p className="text-lg">{formatDate(appointment.Patient.dateOfBirth)}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                        <p className="text-lg">{appointment.Patient.address}</p>
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
                  <User className="h-5 w-5" />
                  Información del Médico
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointment.Doctor ? (
                  <div className="flex items-start space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">
                        {getInitials(appointment.Doctor.firstName, appointment.Doctor.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                          <p className="text-lg font-semibold">Dr. {appointment.Doctor.firstName} {appointment.Doctor.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Email</label>
                          <p className="text-lg">{appointment.Doctor.email}</p>
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
                    <p className="text-lg">{formatDate(appointment.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                    <p className="text-lg">{formatDate(appointment.updatedAt)}</p>
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