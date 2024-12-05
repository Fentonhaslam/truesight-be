import { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { generateNonStreamingHandler, generateResponse, LambdaError } from 'utils/lambda-functions';
import { Insight } from 'types'; // A helper function to fetch data from specified sources
import { z } from 'zod';

import { getOpenAIClient } from 'utils/openai-client';

interface ArticleData {
    url: string;
    h1: string;
    text: string[];
}

interface InputData {
    message: string;
    status: number;
    data: ArticleData[];
}

interface LambdaInput {
    data: InputData;
}

const exampleEvent = {
    "data": {
        "message": "success",
        "status": 200,
        "data": [
            {
                "url": "https://seekingalpha.com/article/4545533-tesco-classic-value-stock-10x-pe-and-5-8-percent-dividend-yield",
                "h1": "No h1 element found",
                "text": []
            },
            {
                "url": "https://retailtimes.co.uk/tesco-launches-mince-pie-range/",
                "h1": "Tesco launches Mince Pie Range",
                "text": [
                    "Photo by Maxim Hopman on Unsplash UK shoppers are turning to overseas sellers more than...",
                    "Starbucks NHS festive giveaway is back! On Thursday 5th December, Starbucks invites NHS staff to pick...",
                    "It’s been a record-breaking year for Fragrance, with TikTok driving a surge of excitement in...",
                    "From 2 December, four major UK cities will become home to the first ever ‘Magical...",
                    "Decentralized forms of payment are revolutionizing e-commerce in a variety of ways. By removing the...",
                    "Ruggable, the washable rug brand founded in the US in 2017, has today announced that...",
                    "Company Name",
                    "Business Market Sector",
                    "First Name",
                    "Last Name",
                    "Job Title",
                    "Email address",
                    "We respect your privacy and will not sell your data to any third party. The newsletter may occasionally include relevant content from our sponsors. You can opt out from receiving the newsletter at any time. We use Mailchimp to manage your data and to deliver the newsletter.",
                    "Learn more about Mailchimp's privacy practices here.",
                    "© Copyright Retail Times. All rights reserved."
                ]
            },
            {
                "url": "https://www.investopedia.com/news/how-many-companies-does-tesco-own/",
                "h1": "How Many Companies Does Tesco Own?",
                "text": [
                    "Tesco (TSCDY) is probably one of the most recognizable retail names in the United Kingdom—at least when it comes to grocery shopping. But what you may not know is that it owns five different companies outside of its grocery business. This allows Tesco to diversify its portfolio to include wholesaling, data and consultancy services, financial services, and mobile phone operations. This article outlines a brief overview of the company's history and the companies it acquired since it was first created.",
                    "Tesco PLC was founded in London in 1919 by Jack Cohen. He began selling groceries from a small stall after returning from the battlefield. It was at this stall where he made a profit of £1 on total sales of £4. Cohen began selling tea under the Tesco brand in the mid-1920s. In 1929, he opened his first Tesco store where he sold dry goods and Tesco tea. Cohen expanded his operations to include new locations and explored self-service stores during the 1930s and 1940s.",
                    "Much of the company's growth has come through acquisitions. Tesco began acquiring other companies in the 1950s—a strategy that continues even today. While the original focus was on groceries, the company has expanded its portfolio of offerings to include a diversified interest in clothing, books, furniture, toys, electronics, software, financial services, and even gasoline.",
                    "Tesco is now one of the world's largest retailers, with 4,859 locations in five different European markets. The majority of these are found in the United Kingdom.",
                    "The company began floating on the London Stock Exchange (LSE) under the name Tesco Stores. It now trades under the ticker symbol TSCO and is part of the FTSE 100 Component index.",
                    "Tesco may have started as a grocery store but it also competes with other retailers like convenience stores and general merchandisers. The British multinational made a name for itself through organic growth and, most notably, through a series of strategic acquisitions."
                ]
            }
        ]
    }
};


const exampleInsights: Insight[] = [
  {
      source: "CNN",
      headline: "Adidas terminates partnership with Kanye West",
      summary: "Adidas has ended its partnership with Kanye West over antisemitic comments.",
      publishedAt: "2022-10-25",
  },
  // Add additional dummy insights here if necessary
];

export const lambdaHandler = generateNonStreamingHandler(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
        const eventBody = parseBodyFromEvent(event, z.object({
            data: z.object({
                message: z.string(),
                status: z.number(),
                data: z.array(
                    z.object({
                        url: z.string(),
                        h1: z.string(),
                        text: z.array(z.string())
                    })
                )
            })
        }));
        if (!eventBody) {
            throw new LambdaError('Missing data', 400);
        }

        console.log('Received data:', eventBody.data);
        const insights = eventBody.data.data.map((article: { url: string; h1: string; text: string[] }) => ({
            source: article.url,
            headline: article.h1,
            content: article.text.join(' ')
        }));

        console.log('Structured insights for analysis:', insights);

        const structuredInsights = await analyzeInsights(insights);

        return generateResponse(200, structuredInsights);
    } catch (error) {
        console.error('Error fetching or analyzing insights:', error);
        throw new LambdaError('Failed to fetch or analyze insights', 500);
    }
});

const analyzeInsights = async (insights: { source: string; headline: string; content: string }[]) => {
    const headlines = insights.map(insight => insight.headline);

    console.log('Analyzing headlines:', headlines);

    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Generate meaningful insights and data from the provided headlines to assist marketing agencies in crafting effective marketing campaigns. The headlines will be about a particular brand and are sourced from various online platforms. The output should include key insights and data statistics in the JSON format.`,
            },
            {
                role: "user",
                content: JSON.stringify(insights),
            },
        ],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
            "type": "json_object"
          },
    });

    console.log('OpenAI response:', response.choices[0].message.content);

    if (response?.choices?.[0]?.message?.content) {
        return JSON.parse(response.choices[0].message.content);
    }

    throw new Error("Failed to parse OpenAI response");
};

export function parseBodyFromEvent<T extends z.ZodRawShape>(
    event: APIGatewayProxyEventV2,
    schema: any
): z.infer<z.ZodObject<T>> {
    if (!event.body) {
        throw new LambdaError('No body provided', 400);
    }
    try {
        const eventBody = JSON.parse(event.body);
        return schema.parse(eventBody);
    } catch (error) {
        console.error(error);
        throw new LambdaError('Invalid body', 400);
    }
}
