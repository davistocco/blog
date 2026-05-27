# Gerando Handlers com OpenAI Function Calling e NodeJS
Criado: 10/01/2024 00:00

O que faremos? Em vez de interagir com uma interface específica da nossa aplicação, onde precisamos detalhar manualmente o caso de uso desejado e seus argumentos, vamos criar uma interface de linguagem natural para atingir o mesmo objetivo.

Neste exemplo, iremos enviar um prompt à IA para criar um quiz sobre um tópico específico. Nossa solicitação será interpretada, e receberemos um handler, que será a função responsável por criar o quiz. O mais legal é que o handler já incluirá todos os argumentos, previamente definidos pela IA.

Assim, em vez de utilizar algo como **createQuiz(/\*\* objeto colossal do quiz \*\*/)**, poderemos simplesmente usar: **'Cria um quiz ae mano, de nível fácil com 5 perguntas sobre fulano.'**

Para este exemplo vamos utilizar OpenAI Function Calling e Node.js.

## Antes de tudo
Você precisará fazer um [upgrade](https://platform.openai.com/account/billing/overview) e adicionar créditos à sua conta na OpenAI. Você vai precisar colocar no mínimo $5 dólares. Após concluir esse processo, configure sua **OPENAI_KEY** em sua máquina e estaremos prontos. Pau na bala!!!

## OpenAI SDK
Primeiro, instale o sdk da openai:
```sh
npm i openai
```

## Chat Completion
Agora vamos criar um arquivo chamado **get-interpreted-handler.js**, importar o SDK da OpenAI e criar uma função de chat completion:
```javascript
import OpenAI from 'openai'

const openai = new OpenAI()
const GPT_MODEL = 'gpt-3.5-turbo'

const chatCompletion = async (messages, functions = null, model = GPT_MODEL, functionCall = 'auto') => {
  if (functions) {
    return openai.chat.completions.create({ model, messages, functions, function_call: functionCall })
  }
  return openai.chat.completions.create({ model, messages })
}
```

## Função para Gerar o Handler
Copie e cole esta função no mesmo arquivo:
```javascript
export const getInterpretedHandler = async ({ userInput, systemMessage, availableFunctions, functionsSchemas }) => {
  const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userInput }
  ]
  const response = await chatCompletion(messages, functionsSchemas)
  const responseMessage = response.choices[0].message
  const handler = generateHandler(responseMessage, availableFunctions)
  return handler
}
```

O objeto **systemMessage** dentro de **messages** é essencialmente o papel do chatbot e é a primeira mensagem no diálogo. O **userInput** é a primeira mensagem do usuário. Mais adiante, entenderemos isso com mais detalhes:
```javascript
const messages = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userInput }
  ]
```

Aqui é onde enviamos as mensagens e os schemas das funções para que o bot entenda quais funções estão disponíveis para chamar e quais são os parâmetros que essas funções esperam, semelhante a uma especificação de API. Mais adiante veremos mais sobre esses schemas:
```javascript
const response = await chatCompletion(messages, functionsSchemas)
const responseMessage = response.choices[0].message
```

Por fim, passamos a resposta da OpenAI para nossa função de gerar um handler com base na resposta recebida:
```javascript
const handler = generateHandler(responseMessage, availableFunctions)
return handler
```

Se a IA decidir que uma função deve ser chamada, a variável **responseMessage.function_call** conterá o nome e os argumentos da função definida dentro dos schemas que enviamos. Caso contrário, retornaremos um handler de console log com a resposta da IA:
```javascript
const generateHandler = (responseMessage, functions) => {
  if (!responseMessage.function_call) {
    return () => console.log(responseMessage.content)
  }
  const functionName = responseMessage.function_call.name
  const functionArgs = JSON.parse(responseMessage.function_call.arguments)
  const args = Object.values(functionArgs)
  return () => functions[functionName](...args)
}
```

## Criando a Interação
Agora que temos a estrutura pronta, vamos criar o nosso módulo de exemplo para simular uma interação. Crie um arquivo chamado **example-module.js** e cole o seguinte código:

```javascript
const quizzes = []

export const getQuizzes = () => quizzes

export const createQuiz = ({ name, questions }) => {
  quizzes.push({ name, questions })
}

export const quizSchemas = [
  {
    name: 'createQuiz',
    description: 'Create a new quiz',
    parameters: {
      type: 'object',
      properties: {
        quiz: {
          type: 'object',
          description: 'The quiz to create',
          properties: {
            name: {
              type: 'string',
              description: 'The name of the quiz.'
            },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'The name of the question.'
                  },
                  answers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          description: 'The name of the answer.'
                        },
                        isCorrect: {
                          type: 'boolean',
                          description: 'Whether the answer is correct.'
                        }
                      },
                      required: ['name', 'isCorrect']
                    }
                  }
                },
                required: ['name', 'answers']
              }
            }
          }
        }
      },
      required: ['name', 'questions']
    }
  }
]

```

O ponto importante aqui é a constante **quizSchemas**. Nela, definimos quais funções queremos que a IA gere uma chamada. Quanto mais detalhado for, melhor serão os argumentos gerados pela IA.

Por fim, crie o arquivo **main.js** onde montaremos todo esse fluxo:
```javascript
import { createQuiz, getQuizzes, quizSchemas } from './example-module.js'
import { getInterpretedHandler } from './get-interpreted-handler.js'

const availableFunctions = { createQuiz }
const systemMessage = `
You are a chatbot that create quizzes, you are full encharged of the quiz creation process 
and you have access to the following functions: ${Object.keys(availableFunctions).join(', ')}.
Our responses must revolve exclusively around the functions at hand.
Absolutely no assumptions should be made regarding the values for functions.
If a user request seems even slightly ambiguous, please don't hesitate to seek
clarification before proceeding. Moreover, when faced with a question unrelated to these functions,
we must unwaveringly stick to our defined scope and concentrate solely on function-related queries.
`

const handler = await getInterpretedHandler({
  userInput: 'Generate a challenging quiz with 3 questions related to Python programming',
  systemMessage,
  availableFunctions,
  functionsSchemas: quizSchemas
})

handler() // createQuiz(/** Whatever the AI has decided to pass as arguments, respecting the schema */)
console.log(JSON.stringify(getQuizzes(), null, 2))
```

Em systemMessage, escrevemos uma descrição detalhada para que a IA compreenda seu papel e não forneça informações além do contexto. Neste caso, estamos instruindo a IA que sua função é criar quizzes e não fornecer informações fora de contexto.

Finalmente, chamamos nossa função para gerar um handler. Passamos nossa systemMessage, o userInput (no caso, vamos criar um quiz com 3 perguntas sobre Python), as funções em si do nosso módulo e os seus schemas.

Agora, você tem um handler pronto para ser executado quando desejar, com os argumentos que a IA decidiu inserir.

Este é o resultado do quiz gerado pela IA:
```javascript
[
  {
    "name": "Python Programming Quiz",
    "questions": [
      {
        "name": "What is the output of the following code?\n\nx = [1, 2, 3]\ndef change_list(x):\n    x.append(4)\nx.append(5)\nchange_list(x)\nprint(x)",
        "answers": [
          {
            "name": "[1, 2, 3, 4, 5]",
            "isCorrect": true
          },
          {
            "name": "[1, 2, 3, 5, 4]",
            "isCorrect": false
          },
          {
            "name": "[1, 2, 3]",
            "isCorrect": false
          },
          {
            "name": "[1, 2, 3, 4]",
            "isCorrect": false
          }
        ]
      },
      {
        "name": "Which data type cannot be changed once it is created?",
        "answers": [
          {
            "name": "List",
            "isCorrect": false
          },
          {
            "name": "Tuple",
            "isCorrect": true
          },
          {
            "name": "Dictionary",
            "isCorrect": false
          },
          {
            "name": "Set",
            "isCorrect": false
          }
        ]
      },
      {
        "name": "What is the result of the following code?\n\nprint(2 ** 3 ** 2)",
        "answers": [
          {
            "name": "64",
            "isCorrect": false
          },
          {
            "name": "512",
            "isCorrect": true
          },
          {
            "name": "256",
            "isCorrect": false
          },
          {
            "name": "8",
            "isCorrect": false
          }
        ]
      }
    ]
  }
]
```

Se o input do usuário estiver além do escopo estabelecido na mensagem do sistema (**systemMessage**), o handler que mencionamos anteriormente, aquele que gera um console log, será ativado automaticamente por default.

Chamada:
```javascript
const handler = await getInterpretedHandler({
  userInput: 'Recite um poema de Ednaldo Pereira',
  systemMessage,
  availableFunctions,
  functionsSchemas: quizSchemas
})
handler() // console.log(/** AI response **/)
```

Resposta:
```sh
Desculpe, mas não consigo recitar um poema de Ednaldo Pereira, pois minha função é criar quizzes. Posso ajudá-lo(a) com a criação de um quiz se desejar.
```

## Conclusão
De forma abrangente e explicativa, o uso de function calling é extremamente útil para integrar IAs em suas aplicações, especialmente em funções que exigem estruturas de dados específicas e padronizadas. Em vez de simplesmente solicitar à IA que escreva um quiz, você definiu esquemas e criou chamadas de funções para que a IA respeitasse as interfaces de sua aplicação. Agora, por exemplo, você pode criar uma aplicação que gera quizzes sob demanda, os quais podem ser manipulados pelos usuários.

Neste exemplo, definimos apenas uma função nos esquemas, mas você pode definir várias funções nas quais a IA irá interpretar qual delas chamar com base no input do usuário ou até mesmo pedir à IA para executar mais de uma função. As possibilidades são muitas e na seção de referências, coloquei alguns artigos que abordam esse tema em maior profundidade.

## Referências
- [GitHub - código completo do post](https://github.com/davistocco/openai-function-calling)
- [OpenAI Function Call Guide](https://platform.openai.com/docs/guides/function-calling)
- [OpenAI Cookbook - How to call functions with chat models](https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models)
- [How to automate AWS tasks with function-calling](https://cookbook.openai.com/examples/third_party/how_to_automate_s3_storage_with_functions)

Meu LinkedIn: https://linkedin.com/in/davistocco

Qualquer coisa me dá um toque 👊
