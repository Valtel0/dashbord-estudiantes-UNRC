import { StudentSidebar } from '@/components/dashboard/student-sidebar'
import { SubjectsBoard } from '@/components/dashboard/subjects-board'

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <StudentSidebar />
      <SubjectsBoard />
    </div>
  )
}
