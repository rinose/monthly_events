import { useEffect, useState } from 'react'
import OpenAI from "openai";

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true
});

function Analyzer(props) {
    const [analyzing, setAnalyzing] = useState(false);
    const [errors, setErrors] = useState([]);
    const [result, setResult] = useState([]);
    
    const analyzeImage = async () => {
        setAnalyzing(true);
        setErrors([]);
        setResult([]);

        const prompt =                         {
            "type": "text",
            "text": "Questo è un compito di " + props.data.subject + " formato da una o più pagine" + 
             " Fai una approfondita correzione del compito, trova gli errori e restituisci eventuali miglioramenti." +
             " Dai anche un voto finale espresso in decimi." +
             " Dammi anche la probabilità che il compito sia stato svolto da una intelligenza artificiale" +  
             " le valutazioni e gli errori li devi dividere per pagina" +
             " La tua risposta deve essere in formato JSON e strutturata come di seguito: "+
             " { " +
             "  \"vote\": \"\" "+
             "  \"comment\": \"here write your evaulation\" " +
             "  \"ai_generated\": \" valore probabilità da 0 a 100 che il compito sia stato svolto da una intelligenza artificiale\" "+
             "  \"improvements\": \" Scrivi qui gli eventuali miglioramenti possibili\" " + 
             "  \"pages\": [{" +
             "  \"evaluations\": ["+
             "            {\"evaluation\": \"evaluation\", \"position\": [x, y]},\"} " +
             "          ]" +
             "  \"errors\": ["+
             "            {\"error\": \"descrivi qui l'errore. Includi gli errori grammaticali\", \"position\": [x, y]},\"} " +
             "          ]" +
             "  }]" +
             " }" + 
             " La posizione deve essere espressa in percentuale (da 0 a 100) rispetto alle dimensioni dell'immagine"
        };
        let content = [prompt]
        props.data.files.map(file => {
            content.push({
                "type": "image_url",
                "image_url": {
                    "url": file
                }
            })
        })

        console.log("Content:", content)
        const completion = await openai.chat.completions.create({
            model: "chatgpt-4o-latest",
            messages: [
                {
                    role: "user",
                    content: content
                },
            ],
            temperature: 0.5,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
              "type": "json_object"
            },
        });
        setAnalyzing(false);
        console.log(completion.choices[0].message.content);
        //get substring between first and last curly braces
        const firstCurly = completion.choices[0].message.content.indexOf('{');
        const lastCurly = completion.choices[0].message.content.lastIndexOf('}');
        const jsonString = completion.choices[0].message.content.substring(firstCurly, lastCurly + 1);
        try {
            const jsonResult = JSON.parse(jsonString);
            props.onAnalyzed(jsonResult)
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }

    useEffect(() => {
        if(!props.data) return;
        analyzeImage();
    }, [props.data]);

    return (
        <>
            <div>{analyzing ? "Analyzing..." : ""}</div>
        </>
    )
}

export default Analyzer