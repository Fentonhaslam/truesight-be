import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { generateNonStreamingHandler, generateResponse, LambdaError } from 'utils/lambda-functions';
import { Insight } from 'types'; // A helper function to fetch data from specified sources
import { fetchFeedData } from 'utils/scaper';

export const lambdaHandler = generateNonStreamingHandler(async (): Promise<APIGatewayProxyResultV2> => {
    try {
        const sources = ['bbc', 'financial times', 'bloomberg', 'google'];
        const insights = await getInsights(sources);
        return generateResponse(200, insights);
    } catch (error) {
        console.error('Error fetching insights:', error);
        throw new LambdaError('Failed to fetch insights', 500);
    }
});

const getInsights = async (sources: string[]): Promise<Insight[]> => {
    const results: Insight[] = [];
    for (const source of sources) {
        const articles = await fetchFeedData(source); // Assume this function fetches and parses XML data
        articles.forEach(article => {
            const insight: Insight = {
                source,
                headline: article.title,
                summary: article.summary,
                publishedAt: article.publishedAt,
            };
            results.push(insight);
        });
    }
    return results;
};
