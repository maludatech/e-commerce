"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { requestPasswordReset } from "@/lib/actions/user.actions";
import { ForgotPasswordSchema } from "@/lib/validator";
import { IForgotPassword } from "@/types";

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<IForgotPassword>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: IForgotPassword) => {
    const res = await requestPasswordReset(data);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-4 text-sm">
        <p>
          If that email is registered, we&apos;ve sent a password reset link
          to it. The link expires in 1 hour.
        </p>
        <Link className="link" href="/sign-in">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Enter the email address associated with your account and
            we&apos;ll send you a link to reset your password.
          </p>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sending link..." : "Send Reset Link"}
          </Button>

          <div className="text-sm text-center">
            <Link className="link" href="/sign-in">
              Back to Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
