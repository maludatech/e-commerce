"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import {
  IChangePassword,
  IForgotPassword,
  IResetPassword,
  IUserName,
  IUserSignIn,
  IUserSignUp,
} from "@/types";
import {
  ChangePasswordSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UserSignUpSchema,
  UserUpdateSchema,
} from "../validator";
import { connectToDb } from "@/utils/database";
import User from "@/db/models/user.model";
import { formatError } from "../utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSetting } from "./setting.actions";
import { sendResetPasswordEmail } from "@/emails";
import { isRateLimited } from "@/lib/rate-limit";

export interface IUserDTO {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    });

    await connectToDb();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return { success: false, error: formatError(error) };
  }
}

// DELETE

export async function deleteUser(id: string) {
  try {
    await connectToDb();
    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error("Use not found");
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
// UPDATE

export async function updateUser(user: z.infer<typeof UserUpdateSchema>) {
  try {
    await connectToDb();
    const dbUser = await User.findById(user._id);
    if (!dbUser) throw new Error("User not found");
    dbUser.name = user.name;
    dbUser.email = user.email;
    dbUser.role = user.role;
    const updatedUser = await dbUser.save();
    revalidatePath("/admin/users");
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
export async function updateUserName(user: IUserName) {
  try {
    await connectToDb();
    const session = await auth();
    const currentUser = await User.findById(session?.user?.id);
    if (!currentUser) throw new Error("User not found");
    currentUser.name = user.name;
    const updatedUser = await currentUser.save();
    return {
      success: true,
      message: "User updated successfully",
      data: JSON.parse(JSON.stringify(updatedUser)),
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn("credentials", { ...user, redirect: false });
}
export const SignInWithGoogle = async () => {
  await signIn("google");
};
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};

// GET
export async function getAllUsers({
  limit,
  page,
}: {
  limit?: number;
  page: number;
}): Promise<{ data: IUserDTO[]; totalPages: number }> {
  const {
    common: { pageSize },
  } = await getSetting();
  limit = limit || pageSize;
  await connectToDb();

  const skipAmount = (Number(page) - 1) * limit;
  const users = await User.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(limit);

  const usersCount = await User.countDocuments();

  return {
    data: users.map((u) => ({ ...u.toObject(), _id: u._id.toString() })),
    totalPages: Math.ceil(usersCount / limit),
  };
}
export async function getUserById(userId: string): Promise<IUserDTO> {
  await connectToDb();
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return {
    ...user.toObject(),
    _id: user._id.toString(),
  };
}

// FORGOT / RESET PASSWORD
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function requestPasswordReset(data: IForgotPassword) {
  // Always return the same success message whether or not the email is
  // registered, so this endpoint can't be used to enumerate accounts.
  const genericResponse = {
    success: true,
    message: "If that email is registered, a reset link has been sent.",
  };
  try {
    const { email } = await ForgotPasswordSchema.parseAsync(data);
    // Keyed by email (not IP) so an attacker can't spam one victim's inbox
    // by rotating IPs.
    if (await isRateLimited("forgot-password", email)) return genericResponse;

    await connectToDb();
    const user = await User.findOne({ email });
    if (!user || !user.password) return genericResponse;

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const { site } = await getSetting();
    await sendResetPasswordEmail({
      email: user.email,
      name: user.name,
      resetUrl: `${site.url}/reset-password/${rawToken}`,
    });

    return genericResponse;
  } catch {
    return genericResponse;
  }
}

export async function resetPassword(token: string, data: IResetPassword) {
  try {
    if (await isRateLimited("reset-password")) {
      return {
        success: false,
        message: "Too many attempts. Please try again later.",
      };
    }

    const { password } = await ResetPasswordSchema.parseAsync(data);
    await connectToDb();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      return {
        success: false,
        message: "This reset link is invalid or has expired.",
      };
    }

    if (user.password && (await bcrypt.compare(password, user.password))) {
      return {
        success: false,
        message: "New password must be different from your current password.",
      };
    }

    user.password = await bcrypt.hash(password, 5);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return {
      success: true,
      message: "Password reset successfully. You can now sign in.",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Change password for the currently signed-in user (requires their current
// password, unlike resetPassword which is for when they're locked out).
export async function changePassword(data: IChangePassword) {
  try {
    const { currentPassword, password } =
      await ChangePasswordSchema.parseAsync(data);
    const session = await auth();
    if (!session?.user?.id) throw new Error("Not authenticated");

    if (await isRateLimited("change-password", session.user.id)) {
      return {
        success: false,
        message: "Too many attempts. Please try again later.",
      };
    }

    await connectToDb();
    const user = await User.findById(session.user.id);
    if (!user || !user.password) throw new Error("User not found");

    const isCurrentPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordCorrect) {
      return { success: false, message: "Current password is incorrect." };
    }

    if (await bcrypt.compare(password, user.password)) {
      return {
        success: false,
        message: "New password must be different from your current password.",
      };
    }

    user.password = await bcrypt.hash(password, 5);
    await user.save();

    return { success: true, message: "Password changed successfully." };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
