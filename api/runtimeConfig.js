(function () {
    const makeScript = () => {
        const runtimeConfig = {
            SUPABASE_URL: typeof process !== 'undefined' ? (process.env.SUPABASE_URL || '') : '',
            SUPABASE_ANON_KEY: typeof process !== 'undefined' ? (process.env.SUPABASE_ANON_KEY || '') : ''
        };
        return `window.PROJECT_CONFIG = Object.assign({}, window.PROJECT_CONFIG || {}, ${JSON.stringify(runtimeConfig)});`;
    };

    // Browser fallback (opening index.html locally)
    if (typeof window !== 'undefined') {
        try { eval(makeScript()); } catch (_) { /* no-op */ }
    }

    // Vercel/Node serverless export
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = function handler(req, res) {
            const script = makeScript();
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'no-store');
            res.status(200).send(script);
        };
    }
})();
