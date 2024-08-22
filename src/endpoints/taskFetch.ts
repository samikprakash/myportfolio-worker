import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

export class GetPortfolio extends OpenAPIRoute {
  schema = {
    tags: ["Tasks"],
    summary: "Fetch my portflio from the database",
    request: {},
    responses: {
      "200": {
        description: "Returns my portfolio if found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                portfolio: z.array(
                  z
                    .object({
                      created_at: z.string(),
                      id: z.bigint(),
                      name: z.string().optional(),
                      quantity: z.number().int().optional(),
                      symbol: z.string().optional(),
                    })
                    .optional()
                ),
              }),
            }),
          },
        },
      },
      "404": {
        description: "Portflio not found",
        content: {
          "application/json": {
            schema: z.object({
              series: z.object({
                success: Bool(),
                error: Str(),
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();
    const api = c.env.SUPABASE_API_KEY;
    const projetUrl = c.env.SUPABASE_PROJECT_URL;

    const supabase = createClient(projetUrl, api);

    const exists = supabase != null || supabase != undefined;

    let { data: portfolio, error } = await supabase
      .from("portfolio")
      .select("*");

    // @ts-ignore: check if the object exists
    if (exists === false) {
      return Response.json(
        {
          success: false,
          error: "Object not found",
        },
        {
          status: 404,
        }
      );
    }

    if (portfolio) {
      return Response.json(
        {
          success: true,
          portfolio,
        },
        {
          status: 200,
        }
      );
    }
    return Response.json(
      {
        success: false,
        error: "Portflio not found",
      },
      {
        status: 404,
      }
    );
  }
}
