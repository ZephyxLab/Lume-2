// lume.js

import NLP from './npl.js';

class Lume {
    constructor(config = {}) {
        this.config = {
            name: 'Lume',
            greeting: '¡Hola! Soy Lume. ¿En qué puedo ayudarte hoy?',
            farewell: 'Gracias por hablar conmigo. ¡Que tengas un gran día!',
            unknownResponse: 'Lo siento, no entiendo completamente. ¿Podrías reformular tu pregunta?',
            ...config
        };
        this.corpus = [];
        this.conversationContext = '';
    }

    async loadCorpus(corpusFile) {
        try {
            const response = await fetch(corpusFile);
            if (!response.ok) throw new Error('No se pudo cargar el archivo del corpus.');
            const text = await response.text();
            this.corpus = text.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    const [question, answer] = line.split('|').map(str => str.trim());
                    return question && answer ? {
                        question: question.toLowerCase(),
                        answer,
                        keywords: NLP.extractKeywords(question)
                    } : null;
                })
                .filter(Boolean);
            console.log('Corpus cargado exitosamente');
        } catch (error) {
            console.error('Error al cargar el corpus:', error);
        }
    }

    getResponse(input) {
        const userKeywords = NLP.extractKeywords(input);
        const bestMatches = this.findBestMatches(userKeywords);

        if (bestMatches.length > 0) {
            const randomMatch = bestMatches[Math.floor(Math.random() * bestMatches.length)];
            this.conversationContext = randomMatch.question;
            return randomMatch.answer;
        }

        if (this.conversationContext) {
            const contextualResponse = this.getContextualResponse(input);
            if (contextualResponse) return contextualResponse;
        }

        this.conversationContext = '';
        return this.getDefaultResponse(input);
    }

    findBestMatches(userKeywords) {
        const matchedEntries = this.corpus
            .map(entry => ({
                entry,
                score: NLP.calculateMatchScore(userKeywords, entry.keywords)
            }))
            .filter(({ score }) => score > 0.4)
            .sort((a, b) => b.score - a.score);

        if (matchedEntries.length === 0) return [];

        const highestScore = matchedEntries[0].score;
        return matchedEntries
            .filter(({ score }) => score === highestScore)
            .map(({ entry }) => entry);
    }

    getContextualResponse(input) {
        const contextEntries = this.corpus.filter(entry =>
            entry.question.toLowerCase().includes(this.conversationContext.toLowerCase())
        );

        if (contextEntries.length > 0) {
            const userKeywords = NLP.extractKeywords(input);
            const bestContextMatches = contextEntries
                .map(entry => ({
                    entry,
                    score: NLP.calculateMatchScore(userKeywords, entry.keywords)
                }))
                .filter(({ score }) => score > 0.3)
                .sort((a, b) => b.score - a.score);

            if (bestContextMatches.length > 0) {
                const highestScore = bestContextMatches[0].score;
                const topMatches = bestContextMatches
                    .filter(({ score }) => score === highestScore)
                    .map(({ entry }) => entry);
                return topMatches[Math.floor(Math.random() * topMatches.length)].answer;
            }
        }
        return null;
    }

    getDefaultResponse(input) {
        const lowerCaseInput = input.toLowerCase();
        const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches'];
        const farewells = ['adiós', 'hasta luego', 'chao', 'nos vemos'];

        if (greetings.some(greeting => lowerCaseInput.includes(greeting))) {
            return this.config.greeting;
        } else if (farewells.some(farewell => lowerCaseInput.includes(farewell))) {
            return this.config.farewell;
        }

        return this.generateResponse(input);
    }

    generateResponse(input) {
        const responses = [
            `Interesante pregunta sobre "${input}". Déjame investigar más y te daré una respuesta más completa en breve.`,
            `"${input}" es un tema fascinante. ¿Podrías darme más detalles sobre qué aspecto te interesa más?`,
            `No tengo información específica sobre "${input}", pero puedo ayudarte a buscar fuentes confiables si lo deseas.`,
            `Tu pregunta sobre "${input}" es muy buena. ¿Te gustaría que exploráramos juntos este tema?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    async initialize(corpusFile) {
        await this.loadCorpus(corpusFile);
        return this.config.greeting;
    }
}

export default Lume;
