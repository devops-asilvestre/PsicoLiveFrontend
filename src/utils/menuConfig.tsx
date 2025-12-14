import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import EventIcon from "@mui/icons-material/Event";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import EmailIcon from "@mui/icons-material/Email";

export const getMenuByRole = (role: string) => {
  switch (role) {
    case "clinica":
      return [
        { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        {
          label: "Gestão",
          icon: <SettingsIcon />,
          children: [
            { path: "/agenda", label: "Agenda" },
            { path: "/configuracoes", label: "Configurações" },
          ],
        },
      ];
    case "psicologo":
      return [
        { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { path: "/agenda", label: "Agenda", icon: <EventIcon /> },
        { path: "/videoconferencia", label: "Videoconferência", icon: <VideoCallIcon /> },
      ];
    case "paciente":
      return [
        { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { path: "/agenda", label: "Agenda", icon: <EventIcon /> },
        { path: "/videoconferencia", label: "Videoconferência", icon: <VideoCallIcon /> },
      ];
    default:
      return [
        { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
        { path: "/agenda", label: "Agenda", icon: <EventIcon /> },
      ];
  }
};
