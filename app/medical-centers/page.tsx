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
  Phone,
  Mail,
  Building2,
  Award,
  Clock,
  Loader2,
  Trash2,
  MapPin,
  Users,
  Globe
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api, MedicalCenter } from "@/lib/api"
import { toast } from "sonner"
import Link from "next/link"
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

export default function MedicalCentersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadCenters()
  }, [])

  const loadCenters = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getMedicalCenters()
      
      if (response.success) {
        setCenters(response.data || [])
      } else {
        setError(response.error || "Error al cargar centros médicos")
        toast.error("Error al cargar la lista de centros médicos")
      }
    } catch (error) {
      console.error("Error loading medical centers:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCenters = centers.filter(
    (center) =>
      center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      center.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (center.type && center.type.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)
  }

  const getRegistrationDate = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString('es-ES')
  }

  const handleDeleteCenter = async (centerId: number) => {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await api.deleteMedicalCenter(centerId)
      
      if (response.success) {
        toast.success("Centro médico eliminado exitosamente!")
        // Recargar la lista de centros
        loadCenters()
      } else {
        toast.error(response.error || "Error al eliminar el centro médico")
      }
    } catch (error) {
      console.error("Error deleting medical center:", error)
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
            <h1 className="text-xl font-semibold">Gestión de Centros Médicos</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Cargando centros médicos...</span>
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
            <h1 className="text-xl font-semibold">Gestión de Centros Médicos</h1>
          </header>
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-red-500 text-lg font-semibold">Error al cargar centros médicos</div>
                  <p className="text-muted-foreground">{error}</p>
                  <Button onClick={loadCenters} variant="outline">
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
          <h1 className="text-xl font-semibold">Gestión de Centros Médicos</h1>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header con búsqueda y acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar centros médicos..."
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
            <Button onClick={() => router.push("/medical-centers/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Centro Médico
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Centros</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{centers.length}</div>
                <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Centros Activos</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{centers.length}</div>
                <p className="text-xs text-muted-foreground">100% operativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {centers.reduce((total, center) => total + (center.capacity || 0), 0)}
                </div>
                <p className="text-xs text-muted-foreground">Pacientes atendidos</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tipos Diferentes</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(centers.map(center => center.type).filter(Boolean)).size}
                </div>
                <p className="text-xs text-muted-foreground">Categorías únicas</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de centros médicos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Centros Médicos</CardTitle>
              <CardDescription>Gestiona la información de todos los centros médicos registrados</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCenters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No se encontraron centros médicos con ese criterio de búsqueda.' : 'No hay centros médicos registrados.'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Centro Médico</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCenters.map((center) => (
                      <TableRow key={center.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder-building.jpg`} />
                              <AvatarFallback>
                                {getInitials(center.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{center.name}</div>
                              <div className="text-sm text-muted-foreground">{center.type || "Centro Médico"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {center.email}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {center.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {center.address}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1" />
                            {center.capacity ? `${center.capacity} pacientes` : "No especificada"}
                          </div>
                        </TableCell>
                        <TableCell>{getRegistrationDate(center.createdAt)}</TableCell>
                        <TableCell>
                          <Badge variant="default">Activo</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/medical-centers/${center.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/medical-centers/${center.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              {center.website && (
                                <DropdownMenuItem>
                                  <Globe className="mr-2 h-4 w-4" />
                                  <a 
                                    href={center.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center w-full"
                                  >
                                    Visitar Sitio Web
                                  </a>
                                </DropdownMenuItem>
                              )}
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
                                        Esta acción no se puede deshacer. Se eliminará permanentemente el centro médico{" "}
                                        <strong>{center.name}</strong> y todos sus datos asociados.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteCenter(center.id)}
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