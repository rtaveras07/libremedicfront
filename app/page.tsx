"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, FileText, Activity, Calendar, TrendingUp, AlertCircle, Clock, Plus } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo
const stats = [
  {
    title: "Pacientes Activos",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Consultas Hoy",
    value: "156",
    change: "+8%",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Prescripciones",
    value: "1,234",
    change: "+15%",
    icon: FileText,
    color: "text-purple-600",
  },
  {
    title: "Centros Médicos",
    value: "24",
    change: "+2%",
    icon: Building2,
    color: "text-orange-600",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "diagnosis",
    patient: "María González",
    doctor: "Dr. Juan Pérez",
    time: "Hace 15 min",
    status: "completed",
  },
  {
    id: 2,
    type: "prescription",
    patient: "Carlos Rodríguez",
    doctor: "Dra. Ana López",
    time: "Hace 32 min",
    status: "pending",
  },
  {
    id: 3,
    type: "appointment",
    patient: "Laura Martín",
    doctor: "Dr. Miguel Torres",
    time: "Hace 1 hora",
    status: "scheduled",
  },
]

const upcomingAppointments = [
  {
    id: 1,
    patient: "Roberto Silva",
    doctor: "Dr. Juan Pérez",
    time: "10:30 AM",
    type: "Consulta General",
  },
  {
    id: 2,
    patient: "Elena Vásquez",
    doctor: "Dra. Ana López",
    time: "11:15 AM",
    type: "Cardiología",
  },
  {
    id: 3,
    patient: "Diego Morales",
    doctor: "Dr. Miguel Torres",
    time: "2:00 PM",
    type: "Neurología",
  },
]

export default function Dashboard() {
  const [userRole] = useState("doctor") // doctor, admin, patient

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">LibreMedic Dashboard</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {userRole === "doctor" ? "Médico" : userRole === "admin" ? "Administrador" : "Paciente"}
            </Badge>
          </div>
        </header>

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Estadísticas principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Actividad Reciente */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {activity.type === "diagnosis" && (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        {activity.type === "prescription" && (
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                        )}
                        {activity.type === "appointment" && (
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.patient}</p>
                        <p className="text-sm text-gray-500">Atendido por {activity.doctor}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "default"
                              : activity.status === "pending"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {activity.status === "completed"
                            ? "Completado"
                            : activity.status === "pending"
                              ? "Pendiente"
                              : "Programado"}
                        </Badge>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Próximas Citas */}
            <Card className="col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Próximas Citas</CardTitle>
                    <CardDescription>Citas programadas para hoy</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Cita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex-shrink-0">
                        <Clock className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{appointment.patient}</p>
                        <p className="text-xs text-gray-500">{appointment.doctor}</p>
                        <p className="text-xs text-blue-600">{appointment.type}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas y Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Alertas y Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Medicamento en stock bajo</p>
                      <p className="text-xs text-gray-600">Paracetamol 500mg - Solo quedan 15 unidades</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver detalles
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Reporte mensual disponible</p>
                      <p className="text-xs text-gray-600">El reporte de actividades de octubre está listo</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Descargar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
