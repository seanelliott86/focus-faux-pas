import { readFile, minifyJS, toBookmarklet, readHTMLTemplate, writeHTMLFile } from './utils.js';

// Run the build process
buildBookmarklet();

async function buildBookmarklet() {
    try {
        const jsCode = await readFile('focus-faux-pas.js');
        const minifiedCode = await minifyJS(jsCode);
        const bookmarkletCode = toBookmarklet(minifiedCode);
        const htmlTemplate = await readHTMLTemplate('template.html');
        const htmlContent = htmlTemplate.replace('<!-- BOOKMARKLET_PLACEHOLDER -->', `<a href="${bookmarkletCode}">Focus Faux Pas</a>`);
        await writeHTMLFile('index.html', htmlContent);
        console.log('Build successful.');
    } catch (error) {
        console.error('Build failed:', error);
    }
}
