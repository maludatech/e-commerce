"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectToDb } from "@/utils/database";
import User from "@/db/models/user.model";
import { formatError } from "../utils";
import { AddressInputSchema, AddressUpdateSchema } from "../validator";
import { IAddress, IAddressInput, IAddressUpdate } from "@/types";

async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  await connectToDb();
  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");
  return user;
}

export async function getAddresses(): Promise<IAddress[]> {
  const user = await getCurrentUser();
  return JSON.parse(JSON.stringify(user.addresses ?? []));
}

export async function addAddress(data: IAddressInput) {
  try {
    const address = await AddressInputSchema.parseAsync(data);
    const user = await getCurrentUser();

    // First saved address becomes the default automatically.
    const isDefault = user.addresses.length === 0;
    user.addresses.push({ ...address, isDefault } as IAddress);
    await user.save();

    revalidatePath("/account/addresses");
    return { success: true, message: "Address added successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateAddress(data: IAddressUpdate) {
  try {
    const address = await AddressUpdateSchema.parseAsync(data);
    const user = await getCurrentUser();

    const existing = user.addresses.id(address._id);
    if (!existing) throw new Error("Address not found");

    existing.fullName = address.fullName;
    existing.street = address.street;
    existing.city = address.city;
    existing.province = address.province;
    existing.postalCode = address.postalCode;
    existing.country = address.country;
    existing.phone = address.phone;
    await user.save();

    revalidatePath("/account/addresses");
    return { success: true, message: "Address updated successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const user = await getCurrentUser();
    const wasDefault = user.addresses.id(addressId)?.isDefault;
    user.addresses.pull({ _id: addressId });

    // If the deleted address was the default, promote the first remaining
    // one so there's still exactly one default whenever any address exists.
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();

    revalidatePath("/account/addresses");
    return { success: true, message: "Address deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const user = await getCurrentUser();
    user.addresses.forEach((a) => {
      a.isDefault = a._id.toString() === addressId;
    });
    await user.save();

    revalidatePath("/account/addresses");
    return { success: true, message: "Default address updated" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
