import { type NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/lib/mercado-pago";

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const { testeId, userEmail, items } = requestBody;

  try {
    const preference = new Preference(mpClient);

    const validItems = items.map(
      (
        item: { name: string; description: string; price: number },
        index: number
      ) => {
        return {
          id: index.toString(),
          title: item.name,
          description: item.description,
          quantity: 1,
          unit_price: item.price,
          currency_id: "BRL",
          category_id: "service",
        };
      }
    );

    const createdPreference = await preference.create({
      body: {
        external_reference: testeId,
        metadata: {
          testeId,
        },
        ...(userEmail && {
          payer: {
            email: userEmail,
          },
        }),
        items: validItems,
        payment_methods: {
          installments: 12,
        },
        auto_return: "approved",
        back_urls: {
          success: `${req.headers.get("origin")}/`,
          failure: `${req.headers.get("origin")}/?status=falha`,
          pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
        },
      },
    });

    console.log(
      "Preferência criada:",
      JSON.stringify(createdPreference, null, 2)
    );

    if (!createdPreference.id) {
      throw new Error("No preferenceId");
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.error("Erro ao criar a preferência:", err);
    return NextResponse.error();
  }
}