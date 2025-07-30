"use client"

import { useState } from "react"
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
  FileText,
  Calendar,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Datos de ejemplo de diagnósticos
const diagnoses = [
  {
    id: "DX-001",
    patient: "María González",
    doctor: "Dr. Juan Pérez",
    date: "2024-01-15",
    diagnosis: "Hipertensión arterial esencial",
    icd10: "I10",
    severity: "moderado",
    status: "Activo",
    followUpDate: "2024-02-15",
    symptoms: ["Dolor de cabeza", "Mareos", "Fatiga"],
  },
  {
    id: "DX-002",
    patient: "Carlos Rodríguez",
    doctor: "Dra. Ana López",
    date: "2024-01-12",
    diagnosis: "Infección respiratoria aguda",
    icd10: "J06.9",
    severity: "leve",
    status: "Resuelto",
    followUpDate: "2024-01-19",
    symptoms: ["Tos", "Dolor de garganta", "Fiebre"],
  },
  {
    id: "DX-003",
    patient: "Laura Martín",
    doctor: "Dr. Miguel Torres",
    date: "2024-01-10",
    diagnosis: "Migraña sin aura",
    icd10: "G43.0",
    severity: "severo",
    status: "En tratamiento",
    followUpDate: "2024-01-24",
    symptoms: ["Dolor de cabeza intenso", "Náuseas", "Sensibilidad a la luz"],
  },
  {
    id: "DX-004",
    patient: "Roberto Silva",
    doctor: "Dra. Carmen Ruiz",
    date: "2024-01-08",
    diagnosis: "Diabetes mellitus tipo 2",
    icd10: "E11",
    severity: "moderado",
    status: "Crónico",
    followUpDate: "2024-02-08",
    symptoms: ["Sed excesiva", "Micción frecuente", "Fatiga"],
  },
]

export default function DiagnosesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredDiagnoses = diagnoses.filter(
    (diagnosis) =>
      (diagnosis.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        diagnosis.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || diagnosis.status === statusFilter),
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "leve":
        return "bg-green-100 text-green-800"
      case "moderado":
        return "bg-yellow-100 text-yellow-800"
      case "severo":
        return "bg-red-100 text-red-800"
      case "critico":
        return "bg-red-200 text-red-900"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Activo":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "En tratamiento":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Resuelto":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Crónico":
        return <Stethoscope className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Activo":
        return "default"
      case "En tratamiento":
        return "secondary"
      case "Resuelto":
        return "outline"
      case "Crónico":
        return "destructive"
      default:
        return "outline"
    }
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
            <Link href="/diagnoses/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Diagnóstico
              </Button>
            </Link>
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
                <p className="text-xs text-muted-foreground">+2 nuevos esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Tratamiento</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {diagnoses.filter((d) => d.status === "En tratamiento" || d.status === "Activo").length}
                </div>
                <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Casos Severos</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {diagnoses.filter((d) => d.severity === "severo" || d.severity === "critico").length}
                </div>
                <p className="text-xs text-muted-foreground">Atención prioritaria</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{diagnoses.filter((d) => d.status === "Resuelto").length}</div>
                <p className="text-xs text-muted-foreground">Casos completados</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de diagnósticos */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Diagnósticos</CardTitle>
              <CardDescription>Gestiona todos los diagnósticos médicos del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Severidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiagnoses.map((diagnosis) => (
                    <TableRow key={diagnosis.id}>
                      <TableCell className="font-medium">{diagnosis.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback>
                              {diagnosis.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{diagnosis.patient}</div>
                        </div>
                      </TableCell>
                      <TableCell>{diagnosis.doctor}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{diagnosis.diagnosis}</div>
                          <div className="text-sm text-muted-foreground">CIE-10: {diagnosis.icd10}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(diagnosis.severity)}>
                          {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{diagnosis.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(diagnosis.status)}
                          <Badge variant={getStatusVariant(diagnosis.status)}>{diagnosis.status}</Badge>
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Generar Reporte
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Programar Seguimiento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
