import prisma from "@/lib/prisma";

export async function GET() {
    const accessCards = await prisma.access_card.findMany({
        include: {
            resident: {
                select: {
                    full_name: true,
                },
            },
        },
    });

    return Response.json(accessCards);
}

export async function POST(req: Request) {
    const body = await req.json();

    const newCard = await prisma.access_card.create({
        data: {
            card_number: body.card_number,
            resident_id: Number(body.resident_id),
            issued_date: new Date(body.issued_date),
            expiry_date: new Date(body.expiry_date),
            is_active: body.is_active ?? true,
        },
    });

    return Response.json(newCard);
}

export async function PUT(req: Request) {
    const body = await req.json();

    const currentCard = await prisma.access_card.findUnique({
        where: { card_id: Number(body.card_id) },
    });

    if (!currentCard) {
        return Response.json({ error: "Card not found" }, { status: 404 });
    }

    const updatedCard = await prisma.access_card.update({
        where: { card_id: Number(body.card_id) },
        data: { is_active: !currentCard.is_active },
    });

    return Response.json(updatedCard);
}
