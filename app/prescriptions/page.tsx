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

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import { api, Prescription } from "@/lib/api"
import { toast } from "sonner"
import { 
  Loader2, 
  Plus, 
  Search, 
  RefreshCw, 
  FileText, 
  Calendar,
  User,
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function PrescriptionsPage() {
  const router = useRouter()
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  useEffect(() => {
    loadPrescriptions()
  }, [])

  const loadPrescriptions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getPrescriptions()
      
      if (response.success) {
        setPrescriptions(response.data || [])
      } else {
        setError(response.error || "Error al cargar prescripciones")
        toast.error("Error al cargar la lista de prescripciones")
      }
    } catch (error) {
      console.error("Error loading prescriptions:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    setIsDeleting(id)
    
    try {
      const response = await api.deletePrescription(id)
      
      if (response.success) {
        toast.success("Prescripción eliminada exitosamente!")
        loadPrescriptions()
      } else {
        toast.error(response.error || "Error al eliminar la prescripción")
      }
    } catch (error) {
      console.error("Error deleting prescription:", error)
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.frequency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (prescription.user?.firstName && prescription.user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prescription.user?.lastName && prescription.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Gestión de Prescripciones</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando prescripciones...</span>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Gestión de Prescripciones</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg font-semibold">Error al cargar prescripciones</div>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={loadPrescriptions} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
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
          <h1 className="text-xl font-semibold">Gestión de Prescripciones</h1>
        </header>

        <div className="flex-1 p-4 md:p-8 pt-6">
          {/* Header con búsqueda y botón de crear */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar prescripciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadPrescriptions} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button onClick={() => router.push("/prescriptions/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Prescripción
              </Button>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Prescripciones</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prescripciones Activas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prescriptions.filter(p => !p.endDate || new Date(p.endDate) >= new Date()).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prescriptions.filter(p => {
                    if (!p.endDate) return false
                    const end = new Date(p.endDate)
                    const today = new Date()
                    return end >= today && end.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000
                  }).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prescriptions.filter(p => p.endDate && new Date(p.endDate) < new Date()).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de prescripciones */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Prescripciones</CardTitle>
              <CardDescription>Gestiona todas las prescripciones médicas registradas</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No se encontraron prescripciones con ese criterio de búsqueda.' : 'No hay prescripciones registradas.'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medicamento</TableHead>
                      <TableHead>Dosis</TableHead>
                      <TableHead>Frecuencia</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead>Fecha Fin</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-blue-600" />
                            {prescription.medication}
                          </div>
                        </TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.frequency}</TableCell>
                        <TableCell>{formatDate(prescription.startDate)}</TableCell>
                        <TableCell>
                          {prescription.endDate ? formatDate(prescription.endDate) : 'Sin fecha fin'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(prescription.endDate)}>
                            {getStatusText(prescription.endDate)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {prescription.user ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Dr. {prescription.user.firstName} {prescription.user.lastName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No disponible</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/prescriptions/${prescription.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/prescriptions/${prescription.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                  </DropdownMenuItem>
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
                                      onClick={() => handleDelete(prescription.id)}
                                      disabled={isDeleting === prescription.id}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isDeleting === prescription.id ? (
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
