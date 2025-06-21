import { useLocation, useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const BreadCrumb = () => {
  const router = useNavigate();
  const { pathname } = useLocation();
  const pathArray = pathname.split("/").filter((path) => path !== "");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink
            onClick={() => router("/")}
            className={`cursor-pointer text-black ${
              pathname === "/" ? "font-bold" : ""
            }`}
          >
            home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator className="hidden md:block" /> */}
        {pathArray.map((path, index) => {
          const isLast = index === pathArray.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem key={index}>
                <BreadcrumbPage>
                  <BreadcrumbLink
                    key={index}
                    onClick={() => {
                      const newPath = `/${pathArray
                        .slice(0, index + 1)
                        .join("/")}`;
                      router(newPath);
                    }}
                    className={`cursor-pointer ${isLast ? "font-bold" : ""}`}
                  >
                    {path}
                  </BreadcrumbLink>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumb;
