import { Outlet } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";

// const Header = () => {
//   return (
//     <div className="flex w-full h-[100vh]">
//       <SideNav />
//       <div className="w-full overflow-x-auto bg-accent dark:bg-primary">
//         {/* <div className="sm:h-[calc(99vh-60px)] overflow-auto"> */}
//         <div className="sm:h-[100vh] overflow-y-auto">
//           {/* <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh-120px)] overflow-y-auto relative"> */}
//           <div className="w-full flex justify-center mx-auto overflow-auto h-[100vh] overflow-y-auto relative">
//             <div className="w-full md:max-w-6xl xl:max-w-none xl:w-7xl pt-1 pl-1">
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const Header = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Header;
