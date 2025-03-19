import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReferralHero } from "./components/referral-hero"
import { ReferralDashboard } from "./components/referral-dashboard"
import { InviteFriends } from "./components/invite-friends"
import { CouponRedemption } from "./components/coupon-redemption"

export const metadata: Metadata = {
  title: "Programa de Indicações | Barbearia",
  description: "Indique amigos, ganhe descontos e acompanhe suas economias",
}

export default function IndicationsPage() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-6 md:space-y-8">
    
    <ReferralHero />
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4 md:mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="invite">Indicar Amigos</TabsTrigger>
          <TabsTrigger value="redeem">Usar Cupom</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-0">
          <ReferralDashboard />
        </TabsContent>

        <TabsContent value="invite" className="mt-0">
          <InviteFriends />
        </TabsContent>

        <TabsContent value="redeem" className="mt-0">
          <CouponRedemption />
        </TabsContent>
      </Tabs>
      
    </div>
  )
}

