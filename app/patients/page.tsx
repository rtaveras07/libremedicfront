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
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, FileText, Calendar, Phone, Mail, Loader2, Trash2 } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api, Patient } from "@/lib/api"
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

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await api.getPatients()
      
      if (response.success) {
        setPatients(response.data || [])
      } else {
        setError(response.error || "Error al cargar pacientes")
        toast.error("Error al cargar la lista de pacientes")
      }
    } catch (error) {
      console.error("Error loading patients:", error)
      setError("Error de conexión")
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const getPatientName = (patient: Patient) => `${patient.firstName} ${patient.lastName}`
  
  const getPatientAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getGenderDisplay = (gender: string) => {
    return gender === 'male' ? 'Masculino' : gender === 'female' ? 'Femenino' : gender
  }

  const handleDeletePatient = async (patientId: number) => {
    if (isDeleting) return
    
    setIsDeleting(true)
    
    try {
      const response = await api.deletePatient(patientId)
      
      if (response.success) {
        toast.success("Paciente eliminado exitosamente!")
        // Recargar la lista de pacientes
        loadPatients()
      } else {
        toast.error(response.error || "Error al eliminar el paciente")
      }
    } catch (error) {
      console.error("Error deleting patient:", error)
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
            <h1 className="text-xl font-semibold">Gestión de Pacientes</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            {/* Header con búsqueda y acciones */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pacientes..."
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
              <Link href="/patients/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Paciente
                </Button>
              </Link>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <p className="text-xs text-muted-foreground">+2 nuevos esta semana</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pacientes Masculinos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients.filter((p) => p.gender === "male").length}</div>
                  <p className="text-xs text-muted-foreground">
                    {patients.length > 0 ? Math.round((patients.filter((p) => p.gender === "male").length / patients.length) * 100) : 0}% del total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Edad Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(patients.reduce((acc, p) => acc + getPatientAge(p.dateOfBirth), 0) / patients.length)} años
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rango: {Math.min(...patients.map((p) => getPatientAge(p.dateOfBirth)))} - {Math.max(...patients.map((p) => getPatientAge(p.dateOfBirth)))} años
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Con Alergias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patients.filter((p) => p.allergies && p.allergies !== "Ninguna").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Requieren atención especial</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabla de pacientes */}
            <Card>
              <CardHeader>
                <CardTitle>Lista de Pacientes</CardTitle>
                <CardDescription>Gestiona la información de todos los pacientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Edad</TableHead>
                      <TableHead>Tipo Sangre</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Alergias</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="mt-2">Cargando pacientes...</p>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-red-500">
                          {error}
                        </TableCell>
                      </TableRow>
                    ) : filteredPatients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No se encontraron pacientes.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/placeholder-user.jpg`} />
                                <AvatarFallback>
                                  {getInitials(patient.firstName, patient.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{getPatientName(patient)}</div>
                                <div className="text-sm text-muted-foreground">{getGenderDisplay(patient.gender)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Mail className="h-3 w-3 mr-1" />
                                {patient.email}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1" />
                                {patient.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getPatientAge(patient.dateOfBirth)} años</TableCell>
                          <TableCell>
                            <Badge variant="outline">{patient.bloodType}</Badge>
                          </TableCell>
                          <TableCell>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>
                            <Badge variant={patient.allergies && patient.allergies !== "Ninguna" ? "default" : "secondary"}>
                              {patient.allergies && patient.allergies !== "Ninguna" ? patient.allergies : "Ninguna"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/edit`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="mr-2 h-4 w-4" />
                                  Historial Médico
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Nueva Cita
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
                                          Esta acción no se puede deshacer. Se eliminará permanentemente el paciente{" "}
                                          <strong>{getPatientName(patient)}</strong> y todos sus datos asociados.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeletePatient(patient.id)}
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
                      ))
                    )}
                  </TableBody>
                </Table>
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
          <h1 className="text-xl font-semibold">Gestión de Pacientes</h1>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header con búsqueda y acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pacientes..."
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
            <Link href="/patients/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paciente
              </Button>
            </Link>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">+2 nuevos esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pacientes Masculinos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.filter((p) => p.gender === "male").length}</div>
                <p className="text-xs text-muted-foreground">
                  {patients.length > 0 ? Math.round((patients.filter((p) => p.gender === "male").length / patients.length) * 100) : 0}% del total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Edad Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(patients.reduce((acc, p) => acc + getPatientAge(p.dateOfBirth), 0) / patients.length)} años
                </div>
                <p className="text-xs text-muted-foreground">
                  Rango: {Math.min(...patients.map((p) => getPatientAge(p.dateOfBirth)))} - {Math.max(...patients.map((p) => getPatientAge(p.dateOfBirth)))} años
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Con Alergias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.filter((p) => p.allergies && p.allergies !== "Ninguna").length}
                </div>
                <p className="text-xs text-muted-foreground">Requieren atención especial</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de pacientes */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
              <CardDescription>Gestiona la información de todos los pacientes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Tipo Sangre</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead>Alergias</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2">Cargando pacientes...</p>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-red-500">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No se encontraron pacientes.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder-user.jpg`} />
                              <AvatarFallback>
                                {getInitials(patient.firstName, patient.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{getPatientName(patient)}</div>
                              <div className="text-sm text-muted-foreground">{getGenderDisplay(patient.gender)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {patient.email}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {patient.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPatientAge(patient.dateOfBirth)} años</TableCell>
                        <TableCell>
                          <Badge variant="outline">{patient.bloodType}</Badge>
                        </TableCell>
                        <TableCell>{patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={patient.allergies && patient.allergies !== "Ninguna" ? "default" : "secondary"}>
                            {patient.allergies && patient.allergies !== "Ninguna" ? patient.allergies : "Ninguna"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Historial Médico
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Nueva Cita
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
                                        Esta acción no se puede deshacer. Se eliminará permanentemente el paciente{" "}
                                        <strong>{getPatientName(patient)}</strong> y todos sus datos asociados.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeletePatient(patient.id)}
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
