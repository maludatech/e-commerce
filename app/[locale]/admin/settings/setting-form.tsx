"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { SettingInputSchema } from "@/lib/validator";
import {
  ClientSetting,
  ISettingInput,
  SettingFormInput,
  SettingFormOutput,
} from "@/types";
import { updateSetting } from "@/lib/actions/setting.actions";
import useSetting from "@/hooks/use-setting-store";
import CurrencyForm from "./currency-form";
import PaymentMethodForm from "./payment-method-form";
import DeliveryDateForm from "./delivery-date-form";
import SiteInfoForm from "./site-info-form";
import CommonForm from "./common-form";
import CarouselForm from "./carousel-form";

function mapSettingToFormInput(setting: SettingFormOutput): SettingFormInput {
  const mapped = {
    ...setting,
    common: {
      ...setting.common,
      pageSize:
        setting.common.pageSize != null ? String(setting.common.pageSize) : "9",
      freeShippingMinPrice:
        setting.common.freeShippingMinPrice != null
          ? setting.common.freeShippingMinPrice.toFixed(2)
          : "0",
    },
    availableCurrencies: setting.availableCurrencies.map((c) => ({
      ...c,
      convertRate: c.convertRate != null ? c.convertRate.toFixed(4) : "1.0000",
    })),
    availableDeliveryDates: setting.availableDeliveryDates.map((d) => ({
      ...d,
      daysToDeliver: d.daysToDeliver != null ? String(d.daysToDeliver) : "0",
      shippingPrice:
        d.shippingPrice != null ? d.shippingPrice.toFixed(2) : "0.00",
      freeShippingMinPrice:
        d.freeShippingMinPrice != null
          ? d.freeShippingMinPrice.toFixed(2)
          : "0.00",
    })),
  };

  return mapped as unknown as SettingFormInput; // ← double cast
}

const SettingForm = ({ setting }: { setting: ISettingInput }) => {
  const { setSetting } = useSetting();

  const form = useForm<SettingFormInput, unknown, SettingFormOutput>({
    resolver: zodResolver(SettingInputSchema),
    defaultValues: mapSettingToFormInput(setting),
  });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  async function onSubmit(values: SettingFormOutput) {
    const res = await updateSetting({ ...values });
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast(res.message);
      setSetting(values as ClientSetting);
      // Reset the dirty-tracking baseline to what was just saved, so Save
      // goes back to disabled until the admin makes another real change.
      form.reset(mapSettingToFormInput(values));
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SiteInfoForm id="setting-site-info" form={form} />
        <CommonForm id="setting-common" form={form} />
        <CarouselForm id="setting-carousels" form={form} />

        <CurrencyForm id="setting-currencies" form={form} />

        <PaymentMethodForm id="setting-payment-methods" form={form} />

        <DeliveryDateForm id="setting-delivery-dates" form={form} />

        <div>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || !isDirty}
            className="w-full mb-24"
          >
            {isSubmitting ? "Submitting..." : `Save Setting`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SettingForm;
