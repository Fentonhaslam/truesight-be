import OpenAI from 'openai';

interface UserProfileData {
  fullName: string;
  email: string;
  experienceYears: string;
  educationLevel: string;
  employmentStatus: string;
  skills: string;
  professionalInterests: string;
  personalInterests: string;
}

async function generateUserProfileFile(userProfile: UserProfileData): Promise<void> {
  try {
    // Prepare the content for OpenAI
    const content = `
      Full Name: ${userProfile.fullName}
      Email: ${userProfile.email}
      Years of Experience: ${userProfile.experienceYears}
      Highest Education Level: ${userProfile.educationLevel}
      Current Employment Status: ${userProfile.employmentStatus}
      Skills: ${userProfile.skills}
      Professional Interests: ${userProfile.professionalInterests}
      Personal Interests: ${userProfile.personalInterests}
    `;

    // Generate content using OpenAI
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a professional CV based on the following user profile data:\n${content}`,
      max_tokens: 150,
    });

    // Check the response
    if (response.choices && response.choices.length > 0) {
      const generatedContent = response.choices[0].text.trim();

      // Simulate file creation (this would be saving the file to a server, S3, etc.)
      console.log("Generated User Profile Summary:");
      console.log(generatedContent);

      // You can save this content to a file or return it as needed
      // For example, saving to a file on disk:
      const fs = require('fs');
      const fileName = `${userProfile.fullName.replace(/\s+/g, '_')}_Profile_Summary.txt`;
      fs.writeFileSync(fileName, generatedContent, 'utf8');

      console.log(`Profile summary saved as ${fileName}`);
    } else {
      console.error("Failed to generate content from OpenAI.");
    }
  } catch (error) {
    console.error("Error generating user profile file:", error);
  }
}

// Example usage:
const exampleUserProfile: UserProfileData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  experienceYears: "5",
  educationLevel: "Bachelor's Degree",
  employmentStatus: "Employed",
  skills: "JavaScript, React, Node.js",
  professionalInterests: "Software Development, AI Research",
  personalInterests: "Reading, Traveling, Cooking",
};

generateUserProfileFile(exampleUserProfile);
