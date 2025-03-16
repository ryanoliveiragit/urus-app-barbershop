"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarDays, Clock, LogOut, Settings, User, History, Scissors } from "lucide-react";
import { useBooking } from "@/hooks/useBooking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { UserSettingsForm } from "@/components/forms/user-settings-form";
import { Footer } from "@/components/shared/footer/footer";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { upcomingAppointments, historyAppointments, isLoading } = useBooking();

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  if (!session) {
    router.push("/");
    return null;
  }

  const renderAppointmentList = (appointments: any[], isPast: boolean = false) => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <Card key={i} className="mb-4">
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
        </Card>
      ));
    }

    if (appointments.length === 0) {
      return (
        <Card className="mb-4">
          <CardHeader>
            <CardDescription>
              {isPast ? "Nenhum histórico de agendamento encontrado" : "Nenhum agendamento futuro"}
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return appointments.map((appointment) => (
      <Card key={appointment.id} className="mb-4 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            {appointment.service}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {format(new Date(appointment.appointmentDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {appointment.appointmentTime}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6 flex-grow">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">


          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <CardTitle className="text-2xl">{session.user?.name}</CardTitle>
                    <CardDescription>{session.user?.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <h3 className="font-medium">Próximo Agendamento</h3>
                    {upcomingAppointments[0] ? (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(upcomingAppointments[0].appointmentDate), "dd/MM/yyyy")} às{" "}
                        {upcomingAppointments[0].appointmentTime}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum agendamento próximo</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">Total de Visitas</h3>
                    <p className="text-sm text-muted-foreground">
                      {historyAppointments.length} agendamentos realizados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="grid gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Próximos Agendamentos</h2>
                {renderAppointmentList(upcomingAppointments)}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Histórico</h2>
                {renderAppointmentList(historyAppointments, true)}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e preferências
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserSettingsForm user={session.user} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button
            variant="destructive"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sair da Conta
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}