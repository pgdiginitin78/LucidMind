// Dynamic import to load the ES Module backend
async function start() {
    try {
        await import('./backend/server.js');
    } catch (err) {
        console.error("Failed to start backend:", err);
    }
}
start();
