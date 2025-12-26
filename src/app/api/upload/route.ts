import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    // TODO: Uncomment when auth is fully working on client
    // if (!session || !session.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // For now, mock user ID if no session (for testing without login)
    // For now, mock user ID if no session (for testing without login)
    // If we have a session, use it. If not, use our dedicated demo email.
    const userEmail = session?.user?.email || 'demo@example.com';

    let user = await prisma.user.findFirst({ where: { email: userEmail } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: 'demo@example.com',
                name: 'Demo User',
                image: 'https://i.pravatar.cc/150?u=demo',
            }
        });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const caption = data.get('caption') as string;
    const tagsStr = data.get('tags') as string;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
        access: 'public',
    });
    const fileUrl = blob.url;

    // Save to DB
    const type = file.type.startsWith('video') ? 'VIDEO' : 'IMAGE';
    const tagsList = tagsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

    // Transaction to create post and tags
    const newPost = await prisma.post.create({
        data: {
            caption,
            url: fileUrl,
            type,
            userId: user.id,
            tags: {
                connectOrCreate: tagsList.map(tag => ({
                    where: { name: tag },
                    create: { name: tag }
                }))
            }
        }
    });

    return NextResponse.json({ success: true, post: newPost });
}
