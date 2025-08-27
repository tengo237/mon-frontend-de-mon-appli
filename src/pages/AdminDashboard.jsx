import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import AdminOverview from '../components/admin/AdminOverview'
import EmployeeManagement from '../components/admin/EmployeeManagement'
import TaskManagement from '../components/admin/TaskManagement'
import ScheduleManagement from '../components/admin/ScheduleManagement'
import MeetingManagement from '../components/admin/MeetingManagement'
import MessagingAdmin from '../components/admin/MessagingAdmin'
import TimeReports from '../components/admin/TimeReports'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/overview" element={<AdminOverview />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/schedule" element={<ScheduleManagement />} />
        <Route path="/meetings" element={<MeetingManagement />} />
        <Route path="/messaging" element={<MessagingAdmin />} />
        <Route path="/reports" element={<TimeReports />} />
      </Routes>
    </AdminLayout>
  )
}

