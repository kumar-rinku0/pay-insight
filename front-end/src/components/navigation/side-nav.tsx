import { Outlet } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "../ui/separator";
// import BreadCrumb from "./bread-curmb";

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
      <SidebarRail className="relative">
        <SidebarTrigger
          className="
          absolute bottom-1/4 left-1/2 -translate-x-1/2
          h-8 w-8 rounded-full 
          bg-muted hover:bg-muted/70 
          flex items-center justify-center
          transition
        "
        >
          <span className="text-lg sidebar-open:hidden rotate-180">&gt;</span>
          <span className="text-lg sidebar-closed:hidden">&gt;</span>
        </SidebarTrigger>
      </SidebarRail>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex md:hidden items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <BreadCrumb /> */}
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Header;
