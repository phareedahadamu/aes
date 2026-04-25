"use client";
import { Controller, useFormContext, FieldValues, Path } from "react-hook-form";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { useState } from "react";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps<
  T extends FieldValues,
> extends React.ComponentProps<"input"> {
  name: Path<T>;
}

export default function PasswordInput<T extends FieldValues>({
  disabled,
  name,
  ...props
}: PasswordInputProps<T>) {
  const { control } = useFormContext<T>();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputGroup>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputGroupInput
            {...field}
            placeholder="Enter password"
            disabled={disabled}
            type={showPassword ? "text" : "password"}
            {...props}
            min={8}
            max={64}
          />
        )}
      />
      <InputGroupButton
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
        type="button"
      >
        {showPassword ? (
          <EyeOff className="text-muted-foreground size-6" />
        ) : (
          <Eye className="text-muted-foreground size-6" />
        )}
      </InputGroupButton>
    </InputGroup>
  );
}
