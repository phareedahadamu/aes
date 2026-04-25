"use client";

import { Item, ItemGroup, ItemMedia, ItemContent } from "../ui/item";
import { CircleX, CircleCheck } from "lucide-react";
export default function PasswordValidationDisplay({
  watchedPassword,
}: {
  watchedPassword: string;
}) {
  const validatePassword = [
    {
      msg: "Must be at least 8 characters",
      status: watchedPassword.split("").length > 7,
    },
    {
      msg: "Cannot exceed 64 characters",
      status: watchedPassword.split("").length < 65,
    },
    {
      msg: "Must include an uppercase letter",
      status: watchedPassword.split("").find((val) => /[A-Z]/.test(val))
        ? true
        : false,
    },
    {
      msg: "Must include a lowercase letter",
      status: watchedPassword.split("").find((val) => /[a-z]/.test(val))
        ? true
        : false,
    },
    {
      msg: "Must include a number",
      status: watchedPassword.split("").find((val) => /\d/.test(val))
        ? true
        : false,
    },
    {
      msg: "Must include a special character",
      status: watchedPassword
        .split("")
        .find((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
        ? true
        : false,
    },
  ];
  const validatePasswordComp = validatePassword.map((item, index) => (
    <Item key={index} className="">
      <ItemMedia>
        {item.status ? (
          <CircleCheck
            size={16}
            className={`text-white ${
              item.status ? "fill-success" : "fill-destructive"
            }`}
          />
        ) : (
          <CircleX
            size={16}
            className={`text-white ${
              item.status ? "fill-success" : "fill-destructive"
            }`}
          />
        )}
      </ItemMedia>
      <ItemContent
        className={`${item.status ? "text-success" : "text-destructive"}`}
      >
        {item.msg}
      </ItemContent>
    </Item>
  ));
  return <ItemGroup className="absolute top-full mt-2 bg-background rounded-mid shadow-md z-10 gap-1!">
                  {validatePasswordComp}
                </ItemGroup>;
}
