import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { generateNonStreamingHandler, generateResponse, LambdaError } from 'utils/lambda-functions';
import { Insight } from 'types'; // A helper function to fetch data from specified sources
import { fetchFeedData } from 'utils/scaper';

import { getOpenAIClient } from 'utils/openai-client';

const exampleInsights = [
    {
      url: 'https://www.cnn.com/2022/10/25/business/adidas-ye-ends-partnership/index.html',
      h1: 'Adidas terminates partnership with Kanye West',
      text: [
        'Markets ',
        'Hot Stocks \n\t\n\n',
        'Fear & Greed Index',
        '\n            Latest Market News \n\t\n\n',
        '\n            Hot Stocks \n\t\n\n',
        'Adidas has ended its partnership with Ye, also known as Kanye West, with “immediate effect.”',
        'In a statement Tuesday, the sportswear maker said it “does not tolerate antisemitism and any other sort of hate speech” and said that his recent comments were “unacceptable, hateful and dangerous.” Adidas said they violated the company’s “values of diversity and inclusion, mutual respect and fairness.”',
        'Sales and production of his Yeezy branded products have stopped as well as payments to Ye and his companies. Adidas said it will take a €250 million hit ($246 million) to its fourth quarter sales.',
        'Corporate America is canceling Kanye West',
        'Adidas has partnered with West since 2013, when the company signed his brand away from rival Nike. In 2016, Adidas expanded its relationship with the rapper, calling it “the most significant partnership ever created between a non-athlete and an athletic brand.”',
        'But Adidas put the “partnership under review” in early October after he wore a “White Lives Matter” T-shirt in public. The Anti-Defamation League categorizes the phrase as a “hate slogan” used by White supremacist groups, including the Ku Klux Klan.',
        'Recently, Ye said “I can say antisemitic s*** and Adidas cannot drop me,” during a tirade against Jews on the Drink Champs Podcast. He also threatened on Twitter to “Go death con 3 on JEWISH PEOPLE.”',
        'Anti-Defamation League CEO Jonathan Greenblatt said Adidas’ decision is a “very positive outcome.”',
        '“It illustrates that antisemitism is unacceptable and creates consequences. Without a doubt, Adidas has done the right thing by cutting ties with Ye after his vicious antisemitic rants,” he said in a statement. “In the end, Adidas’ action sends a powerful message that antisemitism and bigotry have no place in society.”',
        'He added on CNN earlier Tuesday that he wish it happened sooner, but Adidas “has made a very strong statement of putting people over profits.”',
        'Shares of Adidas (ADDDF) fell as much as 5% in Frankfurt. Adidas (ADDDF) said it will release additional information about the financial implications of dissolving its partnership with Ye in its upcoming earnings report on November 9.',
        'The list of brands distancing themselves from West is growing. Balenciaga and Vogue publicly cut ties last week, and on Monday, talent agency CAA dropped West as a client. Production company MRC said that it’s shelving a documentary on West.',
        'Also on Tuesday, Gap announced it was removing Yeezy Gap merchandise from its stores and has shut down YeezyGap.com.',
        '“Our former partner’s recent remarks and behavior further underscore why. We are taking immediate steps to remove Yeezy Gap product, ” the retailer said in a statement.',
        'Last month, the rapper said he was ending his rocky two-year relationship with the Gap, citing “substantial noncompliance.” Ye said he was left “no choice but to terminate their collaboration,” alleging the company didn’t open branded Yeezy stores and distribute his merchandise as planned, his lawyer said in a statement.',
        'The saga of Ye, not just with Adidas but with brands like Gap and Balenciaga, “underlines the importance of vetting celebrities thoroughly and avoiding those who are overly controversial or unstable,” wrote Neil Saunders, managing director of GlobalData in a note Tuesday.',
        '“Although there is room for some tension in fashion, this must never cross the line of decency and basic respect for humanity. Companies or brands that fail to heed this will get stung, especially if they become overly reliant on a difficult personality to drive their business,” he added.',
        '– CNN Business’ Parija Kavilanz and Jon Sarlin contributed to this report.',
        'Most stock quote data provided by BATS. US market indices are shown in real time, except for the S&P 500 which is refreshed every two minutes. All times are ET. Factset: FactSet Research Systems Inc. All rights reserved. Chicago Mercantile: Certain market data is the property of Chicago Mercantile Exchange Inc. and its licensors. All rights reserved. Dow Jones: The Dow Jones branded indices are proprietary to and are calculated, distributed and marketed by DJI Opco, a subsidiary of S&P Dow Jones Indices LLC and have been licensed for use to S&P Opco, LLC and CNN. Standard & Poor’s and S&P are registered trademarks of Standard & Poor’s Financial Services LLC and Dow Jones is a registered trademark of Dow Jones Trademark Holdings LLC. All content of the Dow Jones branded indices Copyright S&P Dow Jones Indices LLC and/or its affiliates. Fair value provided by IndexArb.com. Market holidays and trading hours provided by Copp Clark Limited.',
        '© 2024 Cable News Network. A Warner Bros. Discovery Company. All Rights Reserved.\n' +
          'CNN Sans ™ & © 2016 Cable News Network.',
        'Store and/or access information on a device. Use limited data to select advertising. Use profiles to select personalised advertising. Create profiles for personalised advertising. Use profiles to select personalised content. Create profiles to personalise content. Measure advertising performance. Measure content performance. Understand audiences through statistics or combinations of data from different sources. Develop and improve services. List of Partners (vendors)',
        'Cookies, device or similar online identifiers (e.g. login-based identifiers, randomly assigned identifiers, network based identifiers) together with other information (e.g. browser type and information, language, screen size, supported technologies etc.) can be stored or read on your device to recognise it each time it connects to an app or to a website, for one or several of the purposes presented here.',
        'Advertising presented to you on this service can be based on limited data, such as the website or app you are using, your non-precise location, your device type or which content you are (or have been) interacting with (for example, to limit the number of times an ad is presented to you).',
        'Advertising presented to you on this service can be based on your advertising profiles, which can reflect your activity on this service or other websites or apps (like the forms you submit, content you look at), possible interests and personal aspects.',
        'Information about your activity on this service (such as forms you submit, content you look at) can be stored and combined with other information about you (for example, information from your previous activity on this service and other websites or apps) or similar users. This is then used to build or improve a profile about you (that might include possible interests and personal aspects). Your profile can be used (also later) to present advertising that appears more relevant based on your possible interests by this and other entities.',
        'Content presented to you on this service can be based on your content personalisation profiles, which can reflect your activity on this or other services (for instance, the forms you submit, content you look at), possible interests and personal aspects. This can for example be used to adapt the order in which content is shown to you, so that it is even easier for you to find (non-advertising) content that matches your interests.',
        'Information about your activity on this service (for instance, forms you submit, non-advertising content you look at) can be stored and combined with other information about you (such as your previous activity on this service or other websites or apps) or similar users. This is then used to build or improve a profile about you (which might for example include possible interests and personal aspects). Your profile can be used (also later) to present content that appears more relevant based on your possible interests, such as by adapting the order in which content is shown to you, so that it is even easier for you to find content that matches your interests.',
        'Information regarding which advertising is presented to you and how you interact with it can be used to determine how well an advert has worked for you or other users and whether the goals of the advertising were reached. For instance, whether you saw an ad, whether you clicked on it, whether it led you to buy a product or visit a website, etc. This is very helpful to understand the relevance of advertising campaigns.',
        'Information regarding which content is presented to you and how you interact with it can be used to determine whether the (non-advertising) content e.g. reached its intended audience and matched your interests. For instance, whether you read an article, watch a video, listen to a podcast or look at a product description, how long you spent on this service and the web pages you visit etc. This is very helpful to understand the relevance of (non-advertising) content that is shown to you.',
        'Reports can be generated based on the combination of data sets (like user profiles, statistics, market research, analytics data) regarding your interactions and those of other users with advertising or (non-advertising) content to identify common characteristics (for instance, to determine which target audiences are more receptive to an ad campaign or to certain contents).',
        'Information about your activity on this service, such as your interaction with ads or content, can be very helpful to improve products and services and to build new products and services based on user interactions, the type of audience, etc. This specific purpose does not include the development or improvement of user profiles and identifiers.',
        'Your data can be used to monitor for and prevent unusual and possibly fraudulent activity (for example, regarding advertising, ad clicks by bots), and ensure systems and processes work properly and securely. It can also be used to correct any problems you, the publisher or the advertiser may encounter in the delivery of content and ads and in your interaction with them.',
        'Certain information (like an IP address or device capabilities) is used to ensure the technical compatibility of the content or advertising, and to facilitate the transmission of the content or ad to your device.',
        'The choices you make regarding the purposes and entities listed in this notice are saved and made available to those entities in the form of digital signals (such as a string of characters). This is necessary in order to enable both this service and those entities to respect such choices.',
        'Information about your activity on this service may be matched and combined with other information relating to you and originating from various sources (for instance your activity on a separate online service, your use of a loyalty card in-store, or your answers to a survey), in support of the purposes explained in this notice.',
        'In support of the purposes explained in this notice, your device might be considered as likely linked to other devices that belong to you or your household (for instance because you are logged in to the same service on both your phone and your computer, or because you may use the same Internet connection on both devices).',
        'Your device might be distinguished from other devices based on information it automatically sends when accessing the Internet (for instance, the IP address of your Internet connection or the type of browser you are using) in support of the purposes exposed in this notice.',
        'These cookies are necessary for the website to function and cannot be switched off in our systems. You can set your browser to block or alert you about these cookies, but some parts of the site will not work. ',
        '',
        'Adidas has ended its partnership with Ye, also known as Kanye West, with “immediate effect.”',
        'In a statement Tuesday, the sportswear maker said it “does not tolerate antisemitism and any other sort of hate speech” and said that his recent comments were “unacceptable, hateful and dangerous.” Adidas said they violated the company’s “values of diversity and inclusion, mutual respect and fairness.”',
        'Sales and production of his Yeezy branded products have stopped as well as payments to Ye and his companies. Adidas said it will take a €250 million hit ($246 million) to its fourth quarter sales.',
        'Corporate America is canceling Kanye West',
        'Adidas has partnered with West since 2013, when the company signed his brand away from rival Nike. In 2016, Adidas expanded its relationship with the rapper, calling it “the most significant partnership ever created between a non-athlete and an athletic brand.”',
        'But Adidas put the “partnership under review” in early October after he wore a “White Lives Matter” T-shirt in public. The Anti-Defamation League categorizes the phrase as a “hate slogan” used by White supremacist groups, including the Ku Klux Klan.',
        'Recently, Ye said “I can say antisemitic s*** and Adidas cannot drop me,” during a tirade against Jews on the Drink Champs Podcast. He also threatened on Twitter to “Go death con 3 on JEWISH PEOPLE.”',
        'Anti-Defamation League CEO Jonathan Greenblatt said Adidas’ decision is a “very positive outcome.”',
        '“It illustrates that antisemitism is unacceptable and creates consequences. Without a doubt, Adidas has done the right thing by cutting ties with Ye after his vicious antisemitic rants,” he said in a statement. “In the end, Adidas’ action sends a powerful message that antisemitism and bigotry have no place in society.”',
        'He added on CNN earlier Tuesday that he wish it happened sooner, but Adidas “has made a very strong statement of putting people over profits.”',
        'Shares of Adidas (ADDDF) fell as much as 5% in Frankfurt. Adidas (ADDDF) said it will release additional information about the financial implications of dissolving its partnership with Ye in its upcoming earnings report on November 9.',
        'The list of brands distancing themselves from West is growing. Balenciaga and Vogue publicly cut ties last week, and on Monday, talent agency CAA dropped West as a client. Production company MRC said that it’s shelving a documentary on West.',
        'Also on Tuesday, Gap announced it was removing Yeezy Gap merchandise from its stores and has shut down YeezyGap.com.',
        '“Our former partner’s recent remarks and behavior further underscore why. We are taking immediate steps to remove Yeezy Gap product, ” the retailer said in a statement.',
        'Last month, the rapper said he was ending his rocky two-year relationship with the Gap, citing “substantial noncompliance.” Ye said he was left “no choice but to terminate their collaboration,” alleging the company didn’t open branded Yeezy stores and distribute his merchandise as planned, his lawyer said in a statement.',
        'The saga of Ye, not just with Adidas but with brands like Gap and Balenciaga, “underlines the importance of vetting celebrities thoroughly and avoiding those who are overly controversial or unstable,” wrote Neil Saunders, managing director of GlobalData in a note Tuesday.',
        '“Although there is room for some tension in fashion, this must never cross the line of decency and basic respect for humanity. Companies or brands that fail to heed this will get stung, especially if they become overly reliant on a difficult personality to drive their business,” he added.',
        '– CNN Business’ Parija Kavilanz and Jon Sarlin contributed to this report.',
        'Markets ',
        'Hot Stocks \n\t\n\n',
        'Fear & Greed Index',
        '\n            Latest Market News \n\t\n\n',
        '\n            Hot Stocks \n\t\n\n',
        'Adidas has ended its partnership with Ye, also known as Kanye West, with “immediate effect.”',
        'In a statement Tuesday, the sportswear maker said it “does not tolerate antisemitism and any other sort of hate speech” and said that his recent comments were “unacceptable, hateful and dangerous.” Adidas said they violated the company’s “values of diversity and inclusion, mutual respect and fairness.”',
        'Sales and production of his Yeezy branded products have stopped as well as payments to Ye and his companies. Adidas said it will take a €250 million hit ($246 million) to its fourth quarter sales.',
        'Corporate America is canceling Kanye West',
        'Adidas has partnered with West since 2013, when the company signed his brand away from rival Nike. In 2016, Adidas expanded its relationship with the rapper, calling it “the most significant partnership ever created between a non-athlete and an athletic brand.”',
        'But Adidas put the “partnership under review” in early October after he wore a “White Lives Matter” T-shirt in public. The Anti-Defamation League categorizes the phrase as a “hate slogan” used by White supremacist groups, including the Ku Klux Klan.',
        'Recently, Ye said “I can say antisemitic s*** and Adidas cannot drop me,” during a tirade against Jews on the Drink Champs Podcast. He also threatened on Twitter to “Go death con 3 on JEWISH PEOPLE.”',
        'Anti-Defamation League CEO Jonathan Greenblatt said Adidas’ decision is a “very positive outcome.”',
        '“It illustrates that antisemitism is unacceptable and creates consequences. Without a doubt, Adidas has done the right thing by cutting ties with Ye after his vicious antisemitic rants,” he said in a statement. “In the end, Adidas’ action sends a powerful message that antisemitism and bigotry have no place in society.”',
        'He added on CNN earlier Tuesday that he wish it happened sooner, but Adidas “has made a very strong statement of putting people over profits.”',
        'Shares of Adidas (ADDDF) fell as much as 5% in Frankfurt. Adidas (ADDDF) said it will release additional information about the financial implications of dissolving its partnership with Ye in its upcoming earnings report on November 9.',
        'The list of brands distancing themselves from West is growing. Balenciaga and Vogue publicly cut ties last week, and on Monday, talent agency CAA dropped West as a client. Production company MRC said that it’s shelving a documentary on West.',
        'Also on Tuesday, Gap announced it was removing Yeezy Gap merchandise from its stores and has shut down YeezyGap.com.',
        '“Our former partner’s recent remarks and behavior further underscore why. We are taking immediate steps to remove Yeezy Gap product, ” the retailer said in a statement.',
        'Last month, the rapper said he was ending his rocky two-year relationship with the Gap, citing “substantial noncompliance.” Ye said he was left “no choice but to terminate their collaboration,” alleging the company didn’t open branded Yeezy stores and distribute his merchandise as planned, his lawyer said in a statement.',
        'The saga of Ye, not just with Adidas but with brands like Gap and Balenciaga, “underlines the importance of vetting celebrities thoroughly and avoiding those who are overly controversial or unstable,” wrote Neil Saunders, managing director of GlobalData in a note Tuesday.',
        '“Although there is room for some tension in fashion, this must never cross the line of decency and basic respect for humanity. Companies or brands that fail to heed this will get stung, especially if they become overly reliant on a difficult personality to drive their business,” he added.',
        '– CNN Business’ Parija Kavilanz and Jon Sarlin contributed to this report.',
        'Cookies, device or similar online identifiers (e.g. login-based identifiers, randomly assigned identifiers, network based identifiers) together with other information (e.g. browser type and information, language, screen size, supported technologies etc.) can be stored or read on your device to recognise it each time it connects to an app or to a website, for one or several of the purposes presented here.',
        'Advertising presented to you on this service can be based on limited data, such as the website or app you are using, your non-precise location, your device type or which content you are (or have been) interacting with (for example, to limit the number of times an ad is presented to you).',
        'Advertising presented to you on this service can be based on your advertising profiles, which can reflect your activity on this service or other websites or apps (like the forms you submit, content you look at), possible interests and personal aspects.',
        'Information about your activity on this service (such as forms you submit, content you look at) can be stored and combined with other information about you (for example, information from your previous activity on this service and other websites or apps) or similar users. This is then used to build or improve a profile about you (that might include possible interests and personal aspects). Your profile can be used (also later) to present advertising that appears more relevant based on your possible interests by this and other entities.',
        'Content presented to you on this service can be based on your content personalisation profiles, which can reflect your activity on this or other services (for instance, the forms you submit, content you look at), possible interests and personal aspects. This can for example be used to adapt the order in which content is shown to you, so that it is even easier for you to find (non-advertising) content that matches your interests.',
        'Information about your activity on this service (for instance, forms you submit, non-advertising content you look at) can be stored and combined with other information about you (such as your previous activity on this service or other websites or apps) or similar users. This is then used to build or improve a profile about you (which might for example include possible interests and personal aspects). Your profile can be used (also later) to present content that appears more relevant based on your possible interests, such as by adapting the order in which content is shown to you, so that it is even easier for you to find content that matches your interests.',
        'Information regarding which advertising is presented to you and how you interact with it can be used to determine how well an advert has worked for you or other users and whether the goals of the advertising were reached. For instance, whether you saw an ad, whether you clicked on it, whether it led you to buy a product or visit a website, etc. This is very helpful to understand the relevance of advertising campaigns.',
        'Information regarding which content is presented to you and how you interact with it can be used to determine whether the (non-advertising) content e.g. reached its intended audience and matched your interests. For instance, whether you read an article, watch a video, listen to a podcast or look at a product description, how long you spent on this service and the web pages you visit etc. This is very helpful to understand the relevance of (non-advertising) content that is shown to you.',
        'Reports can be generated based on the combination of data sets (like user profiles, statistics, market research, analytics data) regarding your interactions and those of other users with advertising or (non-advertising) content to identify common characteristics (for instance, to determine which target audiences are more receptive to an ad campaign or to certain contents).',
        'Information about your activity on this service, such as your interaction with ads or content, can be very helpful to improve products and services and to build new products and services based on user interactions, the type of audience, etc. This specific purpose does not include the development or improvement of user profiles and identifiers.',
        'Your data can be used to monitor for and prevent unusual and possibly fraudulent activity (for example, regarding advertising, ad clicks by bots), and ensure systems and processes work properly and securely. It can also be used to correct any problems you, the publisher or the advertiser may encounter in the delivery of content and ads and in your interaction with them.',
        'Certain information (like an IP address or device capabilities) is used to ensure the technical compatibility of the content or advertising, and to facilitate the transmission of the content or ad to your device.',
        'The choices you make regarding the purposes and entities listed in this notice are saved and made available to those entities in the form of digital signals (such as a string of characters). This is necessary in order to enable both this service and those entities to respect such choices.',
        'Information about your activity on this service may be matched and combined with other information relating to you and originating from various sources (for instance your activity on a separate online service, your use of a loyalty card in-store, or your answers to a survey), in support of the purposes explained in this notice.',
        'In support of the purposes explained in this notice, your device might be considered as likely linked to other devices that belong to you or your household (for instance because you are logged in to the same service on both your phone and your computer, or because you may use the same Internet connection on both devices).',
      ]
    },
    {
      url: 'https://www.rt.com/business/565353-adidas-cancels-kanye-west/',
      h1: 'Error fetching H1 element',
      text: []
    },
    {
      url: 'https://www.benzinga.com/markets/equities/23/07/33440194/adidas-seeks-next-yeezy-shoes-sale-from-inventories-in-august',
      h1: 'Adidas Seeks Next Yeezy Shoes Sale From Inventories In August',
      text: [
        '',
        'Adidas AG ADDYY plans to sell more Yeezy shoes globally from its inventories throughout August. ',
        'From the proceeds, the company will donate significantly to selected organizations working to combat discrimination and hate, including racism and antisemitism.',
        'The range available will include some of the most popular existing designs, including the YEEZY BOOST 350 V2, 500, and 700 and the YEEZY SLIDE and FOAM RNR.',
        'Also Read: Adidas Receives Orders Worth $565M For Massive Unsold Yeezy Inventory: Report',
        'With the first set of inventory stock released in May, the second round in August would feature products from 2022, the company said.',
        'Since terminating the YEEZY partnership in October, Adidas has been exploring multiple scenarios for the potential use of the existing YEEZY inventory. ',
        'Also See: Adidas Teams Up With Kanye Again To Sell Leftover Yeezys Rather Than Burning Them',
        'Price Action: ADDYY shares were up by 2.68% to $101.78 on the last check Friday.',
        '© 2024 Benzinga.com. Benzinga does not provide investment advice. All rights reserved.',
        'Trade confidently with insights and alerts from analyst ratings, free reports and breaking news that affects the stocks you care about.',
        '',
        ''
      ]
    }
  ]

export const lambdaHandler = generateNonStreamingHandler(async (): Promise<APIGatewayProxyResultV2> => {
    try {
        const sources = ['bbc', 'financial times', 'bloomberg', 'google'];
        const insights = await getInsights(sources);

        // Pass the extracted headlines to OpenAI for analysis
        const structuredInsights = await analyzeInsights(exampleInsights);

        return generateResponse(200, structuredInsights);
    } catch (error) {
        console.error('Error fetching or analyzing insights:', error);
        throw new LambdaError('Failed to fetch or analyze insights', 500);
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

const analyzeInsights = async (insights: Insight[]) => {
    const headlines = insights.map(insight => insight.headline);

    // Prompt OpenAI to analyze the headlines
    const response = await getOpenAIClient().chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Generate meaningful insights and data from the provided headlines to assist marketing agencies in crafting effective marketing campaigns. The headlines will be about a particular brand and are sourced from various online platforms. The output should include key insights and data statistics in the JSON format.`,
            },
            {
                role: "user",
                content: JSON.stringify(headlines),
            },
        ],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    if (response?.choices?.[0]?.message?.content) {
        return JSON.parse(response.choices[0].message.content);
    }

    throw new Error("Failed to parse OpenAI response");
};
