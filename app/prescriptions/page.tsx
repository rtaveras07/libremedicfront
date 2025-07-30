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
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Datos de ejemplo de prescripciones
const prescriptions = [
  {
    id: "RX-001",
    patient: "María González",
    doctor: "Dr. Juan Pérez",
    date: "2024-01-15",
    status: "Activa",
    medications: [
      { name: "Paracetamol 500mg", dosage: "1 tableta cada 8 horas", duration: "7 días" },
      { name: "Ibuprofeno 400mg", dosage: "1 tableta cada 12 horas", duration: "5 días" },
    ],
    diagnosis: "Dolor de cabeza tensional",
    instructions: "Tomar con alimentos. Evitar alcohol.",
    expiryDate: "2024-02-15",
  },
  {
    id: "RX-002",
    patient: "Carlos Rodríguez",
    doctor: "Dra. Ana López",
    date: "2024-01-12",
    status: "Completada",
    medications: [{ name: "Amoxicilina 500mg", dosage: "1 cápsula cada 8 horas", duration: "10 días" }],
    diagnosis: "Infección respiratoria",
    instructions: "Completar todo el tratamiento aunque se sienta mejor.",
    expiryDate: "2024-01-22",
  },
  {
    id: "RX-003",
    patient: "Laura Martín",
    doctor: "Dr. Miguel Torres",
    date: "2024-01-10",
    status: "Pendiente",
    medications: [
      { name: "Atorvastatina 20mg", dosage: "1 tableta por la noche", duration: "30 días" },
      { name: "Metformina 850mg", dosage: "1 tableta con desayuno y cena", duration: "30 días" },
    ],
    diagnosis: "Diabetes tipo 2 y dislipidemia",
    instructions: "Control de glucosa semanal. Dieta baja en carbohidratos.",
    expiryDate: "2024-02-10",
  },
  {
    id: "RX-004",
    patient: "Roberto Silva",
    doctor: "Dra. Carmen Ruiz",
    date: "2024-01-08",
    status: "Vencida",
    medications: [{ name: "Losartán 50mg", dosage: "1 tableta por la mañana", duration: "30 días" }],
    diagnosis: "Hipertensión arterial",
    instructions: "Control de presión arterial diario.",
    expiryDate: "2024-01-08",
  },
]

export default function PrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      (prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || prescription.status === statusFilter),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Activa":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Completada":
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case "Pendiente":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Vencida":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Activa":
        return "default"
      case "Completada":
        return "secondary"
      case "Pendiente":
        return "outline"
      case "Vencida":
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
          <h1 className="text-xl font-semibold">Gestión de Prescripciones</h1>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header con búsqueda y acciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar prescripciones..."
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
            <Link href="/prescriptions/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Prescripción
              </Button>
            </Link>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Prescripciones</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.length}</div>
                <p className="text-xs text-muted-foreground">+3 nuevas esta semana</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prescripciones Activas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.filter((p) => p.status === "Activa").length}</div>
                <p className="text-xs text-muted-foreground">En tratamiento actual</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.filter((p) => p.status === "Pendiente").length}</div>
                <p className="text-xs text-muted-foreground">Requieren atención</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prescriptions.filter((p) => p.status === "Vencida").length}</div>
                <p className="text-xs text-muted-foreground">Necesitan renovación</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de prescripciones */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Prescripciones</CardTitle>
              <CardDescription>Gestiona todas las prescripciones médicas del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Medicamentos</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium">{prescription.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder-user.jpg`} />
                            <AvatarFallback>
                              {prescription.patient
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{prescription.patient}</div>
                        </div>
                      </TableCell>
                      <TableCell>{prescription.doctor}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {prescription.medications.slice(0, 2).map((med, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <Pill className="h-3 w-3 mr-1 text-blue-600" />
                              <span className="font-medium">{med.name}</span>
                            </div>
                          ))}
                          {prescription.medications.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{prescription.medications.length - 2} más
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{prescription.date}</TableCell>
                      <TableCell>
                        <div
                          className={`text-sm ${
                            new Date(prescription.expiryDate) < new Date()
                              ? "text-red-600 font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {prescription.expiryDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(prescription.status)}
                          <Badge variant={getStatusVariant(prescription.status)}>{prescription.status}</Badge>
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
                              Imprimir Receta
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Renovar
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
