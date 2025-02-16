import { Mail, Home } from "react-feather"
import AdminPortal from "@src/views/admin/AdminPortal"

export default [
  {
    id: "dashboard",
    title: "Admin Dashboard",
    icon: <Home size={20} />,
    navLink: "/admin-dashboard"
  },
  {
    id: "places",
    title: "Manage Place",
    icon: <Mail size={20} />,
    navLink: "/manage-place"
  }
]
