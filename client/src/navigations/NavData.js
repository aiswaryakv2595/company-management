import {
  AssignmentTurnedInOutlined,
  CoPresentOutlined,
  DangerousOutlined,
  FactCheckOutlined,
  GroupsOutlined,
  HomeOutlined,
  PresentToAllOutlined,
  Task,
  TimerSharp,
  VideoCall,
  Work,
  WorkHistory,
  WorkOff,
  WorkspacePremium,
} from "@mui/icons-material";

export const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    route: "admin/dashboard",
    subItems: [],
  },
  {
    text: "Employee",
    icon: null,
    subItems: [
      {
        route: "admin/department",
        text: "Department",
        icon: <WorkspacePremium />,
      },
      {
        route: "admin/employees",
        text: "All Employees",
        icon: <GroupsOutlined />,
      },
      {
        route: "admin/leaves",
        text: "Leaves",
        icon: <FactCheckOutlined />,
      },
      {
        route: "admin/attendance",
        text: "Attendance",
        icon: <CoPresentOutlined />,
      },
    ],
  },
  {
    text: "Leaves",
    icon: null,
    subItems: [
      
      {
        route: "admin/leave-approval",
        text: "Leave Approval",
        icon: <WorkOff />,
      },
      {
        route: "admin/holiday",
        text: "My Holiday",
        icon: <FactCheckOutlined />,
      },
    ],
  },
  {
    text: "On Duty",
    icon: null,
    subItems: [
      {
        route: "admin/onduty-approval",
        text: "Duty Approval",
        icon: <Work />,
      },
      
    ],
  },
  {
    text: "Projects",
    icon: null,
    subItems: [
      {
        route: "admin/projects",
        text: "All Project",
        icon: <PresentToAllOutlined />,
      },
    
    ],
  },
  {
    text: "Complaints",
    icon: null,
    subItems: [
      {
        route: "admin/requests",
        text: "View Requests",
        icon: <DangerousOutlined />,
      },
    ],
  },
  {
    text: "Payroll",
    icon: null,
    subItems: [],
  },
];

// employee navs
export const navItemsEmp = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    route: "dashboard",
    subItems: [],
  },
  {
    text: "Leaves",
    icon: null,
    subItems: [
      {
        route: "leaves",
        text: "My Leaves",
        icon: <GroupsOutlined />,
      },
      {
        route: "holiday",
        text: "My Holiday",
        icon: <FactCheckOutlined />,
      },
    ],
  },
  {
    text: "Attendance",
    icon: null,
    subItems: [
      {
        route: "attendance",
        text: "Attendance Report",
        icon: <PresentToAllOutlined />,
      },
    ],
  },
  {
    text: "On Duty",
    icon: null,
    subItems: [
      {
        route: "onduty",
        text: "On Duty Listing",
        icon: <Work />,
      },
      
    ],
  },
  {
    text: "Projects",
    icon: null,
    subItems: [
      {
        route: "view-project",
        text: "All Projects",
        icon: <WorkHistory />,
      },
    ],
  },

  {
    text: "Time Sheet",
    icon: null,
    subItems: [
      {
        route: "timesheet",
        text: "My Time Sheet",
        icon: <TimerSharp />,
      },
    ],
  },
  {
    text: "Complaints",
    icon: null,
    subItems: [
      {
        route: "request",
        text: "My Request",
        icon: <DangerousOutlined />,
      },
    ],
  },
  {
    text: "Meet",
    icon: <VideoCall />,
    route: "meet",
    subItems: [],
  },
];

//team teamlead
export const navItemsteamlead = [
  {
    text: "Dashboard",
    icon: <HomeOutlined />,
    route: "teamlead/dashboard",
    subItems: [],
  },
  {
    text: "Leaves",
    icon: null,
    subItems: [
      {
        route: "teamlead/leaves",
        text: "My Leaves",
        icon: <GroupsOutlined />,
      },
      {
        route: "teamlead/leave-approval",
        text: "Leave Approval",
        icon: <WorkOff />,
      },
      {
        route: "teamlead/holiday",
        text: "My Holiday",
        icon: <FactCheckOutlined />,
      },
    ],
  },
  {
    text: "Attendance",
    icon: null,
    subItems: [
      {
        route: "teamlead/attendance",
        text: "Attendance Report",
        icon: <PresentToAllOutlined />,
      },
    ],
  },
  {
    text: "On Duty",
    icon: null,
    subItems: [
      {
        route: "teamlead/onduty",
        text: "On Duty Listing",
        icon: <Work />,
      },
      {
        route: "teamlead/onduty-approval",
        text: "Duty Approval",
        icon: <Work />,
      },
    ],
  },
  {
    text: "Time Sheet",
    icon: null,
    subItems: [
      {
        route: "teamlead/timesheet",
        text: "My Time Sheet",
        icon: <TimerSharp />,
      },
    ],
  },
  {
    text: "Projects",
    icon: null,
    subItems: [
      {
        route: "teamlead/view-project",
        text: "All Projects",
        icon: <WorkHistory />,
      },
      {
        route: "teamlead/view-tasks",
        text: "All Tasks",
        icon: <Task />,
      },
    ],
  },

  {
    text: "Complaints",
    icon: null,
    subItems: [
      {
        route: "teamlead/request",
        text: "My Request",
        icon: <DangerousOutlined />,
      },
    ],
  },
  {
    text: "Meet",
    icon: <VideoCall />,
    route: "teamlead/meet",
    subItems: [],
  },
];
