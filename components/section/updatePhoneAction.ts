"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export async function updatePhone(phone: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'User not authenticated' };
  }

  if (user.user_metadata.phone) {
    return { error: 'Phone number already exists' };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      phone,
    }
  });
  if (error) {
    console.error('Supabase update error:', error);
    return { error: 'Failed to update phone number in Supabase' };
  }

  try {
    await prisma.user.update({
      where: { supabaseId: user.id },
      data: { phone },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update phone number' };
  }
}
