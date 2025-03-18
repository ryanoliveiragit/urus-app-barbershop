import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AppointmentSkeleton() {
  return (
    <div className="mb-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-3 border-b border-border/30">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex gap-4 mt-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

