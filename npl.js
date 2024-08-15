// npl.js

// Extraer palabras clave de una frase
function extractKeywords(phrase) {
    const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si', 'no', 'en', 'a', 'de', 'con', 'por', 'para', 'como', 'que', 'me', 'te', 'se', 'lo', 'le', 'tu', 'su', 'mi', 'es', 'son'];
    return phrase.toLowerCase()
                 .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                 .split(/\s+/)
                 .filter(word => word.length > 2 && !stopWords.includes(word));
}

// Calcular puntuación de coincidencia entre palabras clave
function calculateMatchScore(userKeywords, entryKeywords) {
    const matchingKeywords = userKeywords.filter(keyword => 
        entryKeywords.some(entryKeyword => 
            entryKeyword.includes(keyword) || keyword.includes(entryKeyword)
        )
    );
    return matchingKeywords.length / Math.max(userKeywords.length, entryKeywords.length);
}

// Exportar como objeto por defecto
const NLP = {
    extractKeywords,
    calculateMatchScore
};

export default NLP;
