import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const ask = req.body.ask || '';
  if (ask.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ask),
      max_tokens: 150,
      stop: ["\"\"\""],
      top_p: 1,
      temperature: 0,
    });
    console.log(completion.data.usage)
    res.status(200).json({ result: completion.data.choices[0].text });
    
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question) {
  const capitalizedQuestion = question
  //console.log(capitalizedQuestion)
  return `Eres una IA Vendedora de helados.
  IA: ¿Que helado quieres comprar?
  Humano: ${capitalizedQuestion}
  IA: `;
}
