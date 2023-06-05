import LoginScreen from "./Auth/LoginScreen"
import HomeScreen from "./Home/HomeScreen"
import SignUpScreen from "./Auth/SignUpScreen"
// import CreateReportScreen from "./Reports/CreateReportScreen"
// import ViewReportScreen from "./Reports/ViewReportScreen"
// import InventoryScreen from "./Inventory/InventoryScreen"
// import AddInventoryScreen from "./Inventory/AddInventoryScreen"
// import BillsAndRecieptsScreen from "./BillsAndReciepts/BillsAndRecieptsScreen"
// import AddBillsAndRecieptsScreen from "./BillsAndReciepts/AddBillsAndRecieptsScreen"
// import AddServiceRemarkScreen from "./ServiceQuality/AddServiceRemarkScreen"
// import ViewMaterialRequestsScreen from "./MaterialRequests/ViewMaterialRequestsScreen"
// import AddMaterialRequestScreen from "./MaterialRequests/AddMaterialRequestScreen"
// import AddRentalEquipmentScreen from "./RentalEquipment/AddRentalEquipmentScreen"
// import ViewRentedEquipmentsScreen from "./RentalEquipment/ViewRentedEquipmentsScreen"
// import ViewAllProjects from "./ViewAllProjects"
// import SelectProject from "./ServiceQuality/SelectProject"
// import SelectTask from "./ServiceQuality/SelectTask"

const screens = [
  {
    name: "HomeScreen",
    component: HomeScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  // {
  //   name: "ViewReportScreen",
  //   component: ViewReportScreen,
  //   options: {
  //     title: "View Reports",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "CreateReportScreen",
  //   component: CreateReportScreen,
  //   options: {
  //     title: "Add Report",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "InventoryScreen",
  //   component: InventoryScreen,
  //   options: {
  //     title: "View Inventory",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "AddInventoryScreen",
  //   component: AddInventoryScreen,
  //   options: {
  //     title: "Add Inventory",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "BillsAndRecieptsScreen",
  //   component: BillsAndRecieptsScreen,
  //   options: {
  //     title: "View Your Bills and Reciepts",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "AddBillsAndRecieptsScreen",
  //   component: AddBillsAndRecieptsScreen,
  //   options: {
  //     title: "Add Bills and Receipts",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "AddServiceRemarkScreen",
  //   component: AddServiceRemarkScreen,
  //   options: {
  //     title: "Add Service Remarks",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "SelectProject",
  //   component: SelectProject,
  //   options: {
  //     title: "Select Project",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "SelectTask",
  //   component: SelectTask,
  //   options: {
  //     title: "Select Task",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "ViewMaterialRequestsScreen",
  //   component: ViewMaterialRequestsScreen,
  //   options: {
  //     title: "View Material Requests",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "AddMaterialRequestScreen",
  //   component: AddMaterialRequestScreen,
  //   options: {
  //     title: "View Material Requests",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "ViewRentedEquipmentsScreen",
  //   component: ViewRentedEquipmentsScreen,
  //   options: {
  //     title: "View Rented Equipments",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "ViewAllProjects",
  //   component: ViewAllProjects,
  //   options: {
  //     title: "Select Projects",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  // {
  //   name: "AddRentalEquipmentScreen",
  //   component: AddRentalEquipmentScreen,
  //   options: {
  //     title: "Rent Equipments",
  //     headerShown: true,
  //     gestureEnabled: false,
  //     cardOverlayEnabled: false
  //   }
  // },
  {
    name: "LoginScreen",
    component: LoginScreen,
    options: {
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  },
  {
    name: "SignUpScreen",
    component: SignUpScreen,
    options: {
      gestureEnabled: false,
      cardOverlayEnabled: false
    }
  }
]
export default screens
