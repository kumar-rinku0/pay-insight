import { useLocation, useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const BreadCrumb = () => {
  const { pathname } = useLocation();
  const router = useNavigate();

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex">
        <BreadcrumbItem>
          <BreadcrumbPage>
            <BreadcrumbLink
              onClick={() => router("/")}
              className={`cursor-pointer select-none text-black ${
                pathname === "/" ? "font-bold" : ""
              }`}
            >
              Pay Insight
            </BreadcrumbLink>
          </BreadcrumbPage>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator className="hidden md:block" /> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;

// old code:

// const BreadCrumb = () => {
//   const router = useNavigate();
//   const { pathname } = useLocation();
//   const pathArray = pathname.split("/").filter((path) => path !== "");
//   return (
//     <Breadcrumb>
//       <BreadcrumbList>
//         <BreadcrumbItem>
//           <BreadcrumbPage>
//             <BreadcrumbLink
//               onClick={() => router("/")}
//               className={`cursor-pointer select-none text-black ${
//                 pathname === "/" ? "font-bold" : ""
//               }`}
//             >
//               home
//             </BreadcrumbLink>
//           </BreadcrumbPage>
//         </BreadcrumbItem>
//         {/* <BreadcrumbSeparator className="hidden md:block" /> */}
//         {pathArray.map((path, index) => {
//           const isLast = index === pathArray.length - 1;
//           return (
//             <Fragment key={index}>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem key={index}>
//                 <BreadcrumbPage>
//                   <BreadcrumbLink
//                     key={index}
//                     onClick={() => {
//                       const newPath = `/${pathArray
//                         .slice(0, index + 1)
//                         .join("/")}`;
//                       router(newPath);
//                     }}
//                     className={`cursor-pointer ${isLast ? "font-bold" : ""}`}
//                   >
//                     {path}
//                   </BreadcrumbLink>
//                 </BreadcrumbPage>
//               </BreadcrumbItem>
//             </Fragment>
//           );
//         })}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// };
