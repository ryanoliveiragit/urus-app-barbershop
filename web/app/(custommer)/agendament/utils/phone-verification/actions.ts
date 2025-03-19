"use server"

import { revalidatePath } from "next/cache"

/**
 * Sends a verification code to the user's email
 */
export async function sendVerificationCode(phoneNumber: string) {
  // In a real application, you would:
  // 1. Generate a random 6-digit code
  // 2. Store it in a database with the user's ID and an expiration time
  // 3. Send the code to the user's email

  // Simulate a delay for the API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return success
  return { success: true }
}

/**
 * Verifies the code entered by the user
 */
export async function verifyCode(phoneNumber: string, code: string) {
  // In a real application, you would:
  // 1. Check if the code matches what's stored in the database
  // 2. Check if the code is still valid (not expired)
  // 3. If valid, update the user's phone number in the database

  // Simulate a delay for the API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // For demo purposes, any 6-digit code is valid
  const isValid = code.length === 6 && /^\d+$/.test(code)

  if (isValid) {
    // In a real app, update the user's phone number in the database
    // await db.user.update({ where: { id: userId }, data: { phone: phoneNumber } });

    // Revalidate the session path to reflect the updated user data
    revalidatePath("/")
  }

  return { success: isValid }
}

/**
 * Saves the user's notification preferences
 */
export async function saveNotificationPreferences(preference: string) {
  // In a real application, you would:
  // 1. Update the user's notification preferences in the database

  // Simulate a delay for the API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Revalidate the session path to reflect the updated user data
  revalidatePath("/")

  return { success: true }
}

