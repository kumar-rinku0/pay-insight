import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

type roleInfoProp = {
  _id: string;
  company: {
    companyName: string;
  };
  role: string;
};

const SelcetComp = ({ roleInfo }: { roleInfo: Array<roleInfoProp> }) => {
  const [company, setCompany] = useState({ companyName: "" });
  useEffect(() => {
    axios
      .get(`/api/branch/${roleInfo[0].company}`)
      .then((res) => {
        console.log(res);
        setCompany(res.data.company);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [roleInfo]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{company.companyName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SelcetComp;
