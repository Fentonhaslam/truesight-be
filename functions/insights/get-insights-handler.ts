import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { generateNonStreamingHandler, generateResponse, LambdaError } from 'utils/lambda-functions';
import { Insight } from 'types'; // A helper function to fetch data from specified sources
import { searchAndScrapeNewsService } from 'utils/scaper';

import { getOpenAIClient } from 'utils/openai-client';

const exampleInsights: Insight[] = [
  {
      source: "CNN",
      headline: "Adidas terminates partnership with Kanye West",
      summary: "Adidas has ended its partnership with Kanye West over antisemitic comments.",
      publishedAt: "2022-10-25",
  },
  {
      source: "RT",
      headline: "Adidas cancels Kanye West deal",
      summary: "The sportswear giant ends ties with Kanye West following controversial statements.",
      publishedAt: "2022-10-26",
  },
  {
      source: "Benzinga",
      headline: "Adidas to sell Yeezy inventory",
      summary: "Adidas plans to sell leftover Yeezy inventory and donate proceeds to anti-discrimination causes.",
      publishedAt: "2023-07-23",
  },
];

export const lambdaHandler = generateNonStreamingHandler(async (): Promise<APIGatewayProxyResultV2> => {
    try {

        // Pass the extracted headlines to OpenAI for analysis
        console.log('Fetching and analyzing insights...');
        const articles = await searchAndScrapeNewsService("Adidas");
        console.log("Validated articles:", articles);
        
        const structuredInsights = await analyzeInsights(exampleInsights);

        return generateResponse(200, structuredInsights);
    } catch (error) {
        console.error('Error fetching or analyzing insights:', error);
        throw new LambdaError('Failed to fetch or analyze insights', 500);
    }
});

// const getInsights = async (sources: string[]): Promise<Insight[]> => {
//     const results: Insight[] = [];
//     for (const source of sources) {
//         const articles = await searchAndScrapeNewsService(source); // Assume this function fetches and parses XML data
//         articles.forEach(article => {
//             const insight: Insight = {
//                 source,
//                 headline: article.title,
//                 summary: article.summary,
//                 publishedAt: article.publishedAt,
//             };
//             results.push(insight);
//         });
//     }
//     return results;
// };

const analyzeInsights = async (insights: Insight[]) => {
    const headlines = insights.map(insight => insight.headline);

    console.log('Analyzing headlines:', headlines);

    const openai = getOpenAIClient();

    // Prompt OpenAI to analyze the headlines
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

    if (response?.choices?.[0]?.message?.content) {
        return JSON.parse(response.choices[0].message.content);
    }

    throw new Error("Failed to parse OpenAI response");
};
