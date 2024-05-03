import chokidar from 'chokidar';
import { readFile, minifyJS, readHTMLTemplate, writeHTMLFile, toBookmarklet } from './utils.js';

// Run the build process initially
buildBookmarklet();

// Watch for changes in JavaScript and HTML files
const watcher = chokidar.watch(['focus-faux-pas.js', 'template.html'], {
    persistent: true,
});

watcher.on('change', async (filePath) => {
    console.log(`File ${filePath} has been changed. Rebuilding bookmarklet...`);
    await buildBookmarklet();
});

console.log('Watching for changes...');

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
