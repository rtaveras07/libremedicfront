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

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Eye, EyeOff, Lock, Mail, Shield, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [userType, setUserType] = useState("doctor") // doctor, admin, patient
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await api.login({ email, password })
      
      if (response.success) {
        // Guardar token en localStorage si rememberMe está activado
        if (rememberMe && response.data?.token) {
          localStorage.setItem('authToken', response.data.token)
          localStorage.setItem('userType', userType)
        }
        
        toast.success("Inicio de sesión exitoso")
        
        // Redirigir según el tipo de usuario
        switch (userType) {
          case "doctor":
            router.push("/dashboard")
            break
          case "admin":
            router.push("/admin")
            break
          case "patient":
            router.push("/patient")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        toast.error(response.error || "Error al iniciar sesión")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Error de conexión. Verifica que el servidor esté ejecutándose.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Activity className="size-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">LibreMedic</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión Médica Integral</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Selector de tipo de usuario */}
              <div className="space-y-2">
                <Label>Tipo de Usuario</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={userType === "doctor" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserType("doctor")}
                    className="flex-1"
                  >
                    Médico
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "admin" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserType("admin")}
                    className="flex-1"
                  >
                    Admin
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "patient" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserType("patient")}
                    className="flex-1"
                  >
                    Paciente
                  </Button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Recordar mis credenciales
                </Label>
              </div>

              {/* Login button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {/* Forgot password */}
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-4 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Credenciales de Demostración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span>Médico:</span>
              <Badge variant="outline">doctor@libremedic.com / demo123</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Admin:</span>
              <Badge variant="outline">admin@libremedic.com / admin123</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Paciente:</span>
              <Badge variant="outline">paciente@libremedic.com / paciente123</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 LibreMedic. Todos los derechos reservados.</p>
          <p className="mt-1">Sistema seguro y confiable para la gestión médica</p>
        </div>
      </div>
    </div>
  )
}
