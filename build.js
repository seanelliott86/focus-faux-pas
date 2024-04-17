const fs = require('fs');
const terser = require('terser');

// Function to convert JavaScript code into a bookmarklet
const toBookmarklet = (jsCode) => `javascript:${encodeURIComponent(jsCode)}`;

// Read the JavaScript file
const readJSFile = async (filePath) => {
    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading JavaScript file:', error);
        throw error;
    }
};

// Minify the JavaScript code using Terser
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

// Convert minified JavaScript code into a bookmarklet
const generateBookmarklet = (minifiedCode) => toBookmarklet(minifiedCode);

// Read the HTML template file
const readHTMLTemplate = async (filePath) => {
    try {
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (error) {
        console.error('Error reading HTML template file:', error);
        throw error;
    }
};

// Write the updated HTML content to a new file
const writeHTMLFile = async (filePath, htmlContent) => {
    try {
        await fs.promises.writeFile(filePath, htmlContent);
        console.log('New HTML file generated with the bookmarklet code.');
    } catch (error) {
        console.error('Error writing HTML file:', error);
        throw error;
    }
};

// Main function to build the bookmarklet
const buildBookmarklet = async () => {
    try {
        const jsCode = await readJSFile('focus-faux-pas.js');
        const minifiedCode = await minifyJS(jsCode);
        const bookmarkletCode = generateBookmarklet(minifiedCode);
        const htmlTemplate = await readHTMLTemplate('template.html');
        const htmlContent = htmlTemplate.replace('<!-- BOOKMARKLET_PLACEHOLDER -->', `<a href="${bookmarkletCode}">Focus Faux Pas</a>`);
        await writeHTMLFile('index.html', htmlContent);
    } catch (error) {
        console.error('Build failed:', error);
    }
};

// Run the build process
buildBookmarklet();
