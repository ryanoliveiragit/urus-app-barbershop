"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Clock, MessageSquare, Star, Plus, X, MoreHorizontal, CalendarIcon, CreditCard } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CancelAppointmentDialog } from "./cancel-agendament-dialog"
import { fadeIn } from "../utils/animations"
import { formatCurrency, formatDateMask } from "../utils/formatter"
import { Appointment } from "@/@types/appointment"

interface AppointmentCardProps {
    appointment: Appointment
    isHistory?: boolean
}

export function AppointmentCard({ appointment, isHistory = false }: AppointmentCardProps) {
    const [showCancelDialog, setShowCancelDialog] = useState(false)

    const getStatusColor = (isHistory: boolean, appointment: Appointment): string => {
        if (appointment.isCanceled) return "bg-red-100 text-red-700 border-red-200"
        if (appointment.status === "completed" || isHistory) return "bg-gray-100 text-gray-700 border-gray-200"
        return "bg-primary/10 text-primary border-primary/20"
    }

    const getStatusText = (isHistory: boolean, appointment: Appointment): string => {
        if (appointment.isCanceled) return "Cancelado"
        if (appointment.status === "completed" || isHistory) return "Concluído"
        return "Agendado"
    }

    return (
        <>
            <motion.div {...fadeIn}>
                <Card className="overflow-hidden w-full border rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-0">
                        {/* Cabeçalho com profissional */}
                        <div className="p-4 flex items-center gap-3 border-b">
                            <Avatar className="h-12 w-12 rounded-full border-2 border-primary/10">
                                <Image
                                    src={appointment.professionalImage || "/placeholder.svg?height=48&width=48"}
                                    alt={appointment.professionalName}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                />
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-medium text-foreground">{appointment.professionalName}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {appointment.professionalSpecialty || "Barbeiro Profissional"}
                                </p>
                            </div>
                            <Badge
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium border",
                                    getStatusColor(isHistory, appointment),
                                )}
                            >
                                {getStatusText(isHistory, appointment)}
                            </Badge>
                        </div>

                        {/* Detalhes do serviço */}
                        <div className="p-5">
                            
                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h4 className="font-semibold text-xs text-muted-foreground">{appointment.serviceName}</h4>
                                    <p className="text-sm font-medium text-secondary mt-1 font-bold">{formatCurrency(appointment.price)}</p>
                                </div>
                                <div className=" rounded-lg flex flex-col">
                                    <span className="text-xs text-muted-foreground">Forma de pagamento</span>
                                    <div className="flex items-center mt-0.5">
                                        <CreditCard className="h-4 w-4 mr-1.5 text-primary" />
                                        <span className="text-sm font-medium">No local</span>
                                    </div>
                                </div>

                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        {!isHistory && !appointment.isCanceled && appointment.status !== "completed" && (
                                            <>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    <span>Contatar barbeiro</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                                    <span>Remarcar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-500 cursor-pointer"
                                                    onClick={() => setShowCancelDialog(true)}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    <span>Cancelar</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}

                                        {(isHistory || appointment.status === "completed") && (
                                            <>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Star className="h-4 w-4 mr-2" />
                                                    <span>Avaliar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    <span>Reagendar mesmo serviço</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Data e hora */}
                            <div className="flex gap-4 mt-3">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Calendar className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm">{formatDateMask(appointment.appointmentDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm">{appointment.appointmentTime}</span>
                                </div>
                            </div>

                            {/* Ações - mostradas para telas menores */}
                            {!isHistory && !appointment.isCanceled && appointment.status !== "completed" && (
                                <div className="flex gap-2 mt-4 md:hidden">
                                    <Button variant="outline" size="sm" className="text-xs h-9 w-full">
                                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                                        Contatar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="text-xs h-9 w-full"
                                        onClick={() => setShowCancelDialog(true)}
                                    >
                                        <X className="h-3.5 w-3.5 mr-1.5" />
                                        Cancelar
                                    </Button>
                                </div>
                            )}

                            {(isHistory || appointment.status === "completed") && (
                                <div className="flex gap-2 mt-4 md:hidden">
                                    <Button variant="outline" size="sm" className="text-xs h-9 w-full">
                                        <Star className="h-3.5 w-3.5 mr-1.5" />
                                        Avaliar
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-xs h-9 w-full">
                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                        Reagendar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Diálogo de confirmação para cancelamento */}
            <CancelAppointmentDialog
                isOpen={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                appointmentId={Number(appointment.id)}
                appointmentName={appointment.serviceName}
            />
        </>
    )
}

