import {
  AddressInputSchema,
  AddressUpdateSchema,
  CarouselSchema,
  CartSchema,
  ChangePasswordSchema,
  DeliveryDateSchema,
  ForgotPasswordSchema,
  OrderInputSchema,
  OrderItemSchema,
  PaymentMethodSchema,
  ProductInputSchema,
  ResetPasswordSchema,
  ReviewInputSchema,
  SettingInputSchema,
  ShippingAddressSchema,
  SiteCurrencySchema,
  SiteLanguageSchema,
  UserInputSchema,
  UserNameSchema,
  UserSignInSchema,
  UserSignUpSchema,
  WebPageInputSchema,
} from "@/lib/validator";
import { z } from "zod";

export type IReviewInput = z.infer<typeof ReviewInputSchema>;
export type IReviewDetails = IReviewInput & {
  _id: string;
  createdAt: string;
  user: {
    name: string;
  };
};
export type IProductInput = z.infer<typeof ProductInputSchema>;

export type Data = {
  settings: ISettingInput[];
  webPages: IWebPageInput[];
  users: IUserInput[];
  products: IProductInput[];
  reviews: {
    title: string;
    rating: number;
    comment: string;
  }[];
  headerMenus: {
    name: string;
    href: string;
  }[];
  carousels: {
    image: string;
    url: string;
    title: string;
    buttonCaption: string;
    isPublished: boolean;
  }[];
};
// Order
export type IOrderInput = z.infer<typeof OrderInputSchema>;
export type IOrderList = IOrderInput & {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: Date;
};
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;
export type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};

// user
export type IUserInput = z.infer<typeof UserInputSchema>;
export type IUserSignIn = z.infer<typeof UserSignInSchema>;
export type IUserSignUp = z.infer<typeof UserSignUpSchema>;
export type IUserName = z.infer<typeof UserNameSchema>;
export type IForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type IResetPassword = z.infer<typeof ResetPasswordSchema>;
export type IChangePassword = z.infer<typeof ChangePasswordSchema>;

// address
export type IAddressInput = z.infer<typeof AddressInputSchema>;
export type IAddressUpdate = z.infer<typeof AddressUpdateSchema>;
export type IAddress = ShippingAddress & { _id: string; isDefault: boolean };

// webpage
export type IWebPageInput = z.infer<typeof WebPageInputSchema>;

// setting
export type ICarousel = z.infer<typeof CarouselSchema>;

export type SettingFormInput = z.input<typeof SettingInputSchema>;
export type SettingFormOutput = z.output<typeof SettingInputSchema>;
export type ISettingInput = SettingFormOutput;
export type ClientSetting = ISettingInput & {
  currency: string;
};
export type SiteLanguage = z.infer<typeof SiteLanguageSchema>;
export type SiteCurrency = z.infer<typeof SiteCurrencySchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type DeliveryDate = z.infer<typeof DeliveryDateSchema>;
