import { Routes, Route, Navigate } from 'react-router-dom'
import EmployeeLayout from '../components/EmployeeLayout'
import EmployeeOverview from '../components/employee/EmployeeOverview'
import EmployeeTasks from '../components/employee/EmployeeTasks'
import EmployeeSchedule from '../components/employee/EmployeeSchedule'
import EmployeeTimeTracking from '../components/employee/EmployeeTimeTracking'
import EmployeeMeetings from '../components/employee/EmployeeMeetings'
import EmployeeMessaging from '../components/employee/EmployeeMessaging'

export default function EmployeeDashboard() {
  return (
    <EmployeeLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/employee/overview" replace />} />
        <Route path="/overview" element={<EmployeeOverview />} />
        <Route path="/tasks" element={<EmployeeTasks />} />
        <Route path="/schedule" element={<EmployeeSchedule />} />
        <Route path="/timetracking" element={<EmployeeTimeTracking />} />
        <Route path="/meetings" element={<EmployeeMeetings />} />
        <Route path="/messaging" element={<EmployeeMessaging />} />
      </Routes>
    </EmployeeLayout>
  )
}

