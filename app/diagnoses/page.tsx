"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Calendar,
  Stethoscope,
  User,
  Clock,
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api, Diagnosis } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
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

export default function DiagnosesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadDiagnoses()
  }, [])

  const loadDiagnoses = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getDiagnoses()
      
      if (response.success) {
        setDiagnoses(response.data || [])
      } else {
        setError(response.error || "Error al cargar diagnósticos")
        toast.error("Error al cargar la lista de diagnósticos")
      }
    } catch (error) {
      console.error("Error loading diagnoses:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDiagnoses = diagnoses.filter(
    (diagnosis) =>
      diagnosis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (diagnosis.Patient && `${diagnosis.Patient.firstName} ${diagnosis.Patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (diagnosis.Doctor && `${diagnosis.Doctor.firstName} ${diagnosis.Doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getDiagnosisDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
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

  const handleDeleteDiagnosis = async (diagnosisId: number) => {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await api.deleteDiagnosis(diagnosisId)
      
      if (response.success) {
        toast.success("Diagnóstico eliminado exitosamente!")
        loadDiagnoses()
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

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Gestión de Diagnósticos</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando diagnósticos...</span>
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
            <h1 className="text-xl font-semibold">Gestión de Diagnósticos</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-red-500 text-lg font-semibold">Error al cargar diagnósticos</div>
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={loadDiagnoses} variant="outline">
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <h1 className="text-xl font-semibold">Gestión de Diagnósticos</h1>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header con búsqueda y acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar diagnósticos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
            <Button onClick={() => router.push("/diagnoses/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Diagnóstico
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Diagnósticos</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{diagnoses.length}</div>
                <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {diagnoses.filter(d => d.status.toLowerCase() === 'activo').length}
                </div>
                <p className="text-xs text-muted-foreground">En tratamiento</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {diagnoses.filter(d => d.status.toLowerCase() === 'resuelto').length}
                </div>
                <p className="text-xs text-muted-foreground">Completados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graves</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {diagnoses.filter(d => d.severity.toLowerCase() === 'grave').length}
                </div>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de diagnósticos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Diagnósticos</CardTitle>
              <CardDescription>Gestiona todos los diagnósticos médicos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDiagnoses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No se encontraron diagnósticos con ese criterio de búsqueda.' : 'No hay diagnósticos registrados.'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Severidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDiagnoses.map((diagnosis) => (
                      <TableRow key={diagnosis.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback>
                                {diagnosis.Patient ? getInitials(diagnosis.Patient.firstName, diagnosis.Patient.lastName) : 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {diagnosis.Patient ? `${diagnosis.Patient.firstName} ${diagnosis.Patient.lastName}` : 'Paciente no encontrado'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {diagnosis.Patient?.email || 'Sin email'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{diagnosis.diagnosis}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {diagnosis.symptoms}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback className="text-xs">
                                {diagnosis.Doctor ? getInitials(diagnosis.Doctor.firstName, diagnosis.Doctor.lastName) : 'M'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {diagnosis.Doctor ? `Dr. ${diagnosis.Doctor.firstName} ${diagnosis.Doctor.lastName}` : 'Médico no encontrado'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(diagnosis.severity)}>
                            {diagnosis.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(diagnosis.status)}>
                            {diagnosis.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {getDiagnosisDate(diagnosis.diagnosisDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/diagnoses/${diagnosis.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/diagnoses/${diagnosis.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                              >
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <div className="flex items-center w-full">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Eliminar
                                    </div>
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
                                        onClick={() => handleDeleteDiagnosis(diagnosis.id)}
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
                              </DropdownMenuItem>
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
