import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingFormInput, SettingFormOutput } from "@/types";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export default function PaymentMethodForm({
  form,
  id,
}: {
  form: UseFormReturn<SettingFormInput, unknown, SettingFormOutput>;
  id: string;
}) {
  const {
    watch,
    control,
    formState: { errors },
  } = form;

  const availablePaymentMethods = watch("availablePaymentMethods");

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment method names are matched literally in the checkout/payment
            code (e.g. paymentMethod === "Stripe"), so this list is
            intentionally not editable here - adding or renaming an entry
            would create a payment option with no actual processing behind
            it, leaving a customer's order stuck unpaid with no way to pay. */}
        <div className="space-y-1">
          <div className="text-sm font-medium">Available Methods</div>
          <ul className="text-sm text-muted-foreground list-disc pl-5">
            {availablePaymentMethods.map((method, index) => (
              <li key={index}>{method.name}</li>
            ))}
          </ul>
        </div>

        <FormField
          control={control}
          name="defaultPaymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Payment Method</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePaymentMethods
                      .filter((x) => x.name)
                      .map((method, index) => (
                        <SelectItem key={index} value={method.name}>
                          {method.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors.defaultPaymentMethod?.message}</FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
