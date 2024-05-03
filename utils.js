import fs from 'fs';
import * as terser from 'terser';

// Function to convert JavaScript code into a bookmarklet
const toBookmarklet = (jsCode) => `javascript:${encodeURIComponent(jsCode)}`;

// Read the file
const readFile = async (filePath) => {
    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file '${filePath}':`, error);
        throw error;
    }
};

// Minify JavaScript code
const minifyJS = async (jsCode) => {
    try {
        const minifiedResult = await terser.minify(jsCode);
        if (minifiedResult.error) {
            throw minifiedResult.error;
        }
        return minifiedResult.code;
    } catch (error) {
        console.error('Error during minification:', error);
        throw error;
    }
};

// Read HTML template file
const readHTMLTemplate = async (filePath) => {
    try {
        return await readFile(filePath);
    } catch (error) {
        console.error('Error reading HTML template file:', error);
        throw error;
    }
};

// Write HTML content to a file
const writeHTMLFile = async (filePath, htmlContent) => {
    try {
        await fs.promises.writeFile(filePath, htmlContent);
        console.log(`File '${filePath}' written successfully.`);
    } catch (error) {
        console.error(`Error writing file '${filePath}':`, error);
        throw error;
    }
};

export {
    toBookmarklet,
    readFile,
    minifyJS,
    readHTMLTemplate,
    writeHTMLFile,
};
