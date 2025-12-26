'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleLike(postId: string) {
    const session = await getServerSession(authOptions);
    // Mock user for now if not logged in
    let userId = session?.user?.email;

    if (!userId) {
        // For demo purposes, we need a user ID. 
        // In a real app, we would return error or redirect to login.
        // Let's try to find the 'demo' user we created in upload
        const demoUser = await prisma.user.findFirst({ where: { email: 'demo@example.com' } });
        if (demoUser) userId = demoUser.id;
        else return { error: 'Unauthorized' };
    } else {
        // If we have an email from session, get the user object ID
        const user = await prisma.user.findUnique({ where: { email: userId } });
        if (user) userId = user.id;
        else return { error: 'User not found' };
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_postId: {
                userId,
                postId,
            },
        },
    });

    if (existingLike) {
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId,
                    postId,
                },
            },
        });
    } else {
        await prisma.like.create({
            data: {
                userId,
                postId,
            },
        });
    }

    revalidatePath('/');
    return { success: true };
}
