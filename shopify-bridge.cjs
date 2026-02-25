const http = require('http');
const https = require('https');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

// ─── MASTER CONFIG ──────────────────────────────────────────────────────────
// Update these to your real credentials once for a "Direct" experience.
const MASTER_CONFIG = {
    GOOGLE_DEVELOPER_TOKEN: 'yLB0NLuGwKPYlHzFlHzp-A',
    GOOGLE_CLIENT_ID: '695971374779-lgutit2vr7hseki58mo07ksphdg33i3g.apps.googleusercontent.com',
    SHOPIFY_API_KEY: '99d220345090a518f8b67a8f5418318c', // Optional: Put your Shopify App Client ID here for "One-Click"
    SHOPIFY_API_SECRET: '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',
    REDIRECT_URI: 'http://localhost:3001/shopify/callback'
};
// ─────────────────────────────────────────────────────────────────────────────

const log = (msg) => {
    const line = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(msg);
    try {
        fs.appendFileSync('c:/Users/farma/OneDrive/Desktop/ANTIGRAVITY/purchase-dashboard/bridge.log', line);
    } catch (e) {
        console.error("LOG ERROR:", e.message);
    }
};

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Shopify-Access-Token, Authorization, Content-Type, developer-token');

    log(`[Bridge] ${req.method} ${req.url}`);
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/debug-google') {
        const options = {
            hostname: 'googleads.googleapis.com',
            path: '/v18/customers:listAccessibleCustomers',
            method: 'GET',
            headers: {
                'developer-token': MASTER_CONFIG.GOOGLE_DEVELOPER_TOKEN,
                'Authorization': req.headers['authorization'],
                'Content-Type': 'application/json'
            }
        };
        log(`[Debug-Google] Requesting: ${options.method} https://${options.hostname}${options.path}`);
        const pReq = https.request(options, (pRes) => {
            log(`[Debug-Google] Response: ${pRes.statusCode}`);
            res.writeHead(pRes.statusCode, pRes.headers);
            pRes.pipe(res);
        });
        pReq.end();
        return;
    }

    const urlParts = req.url.split('?')[0].split('/').filter(Boolean);
    const queryString = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
    const params = new URLSearchParams(queryString);

    // --- SHOPIFY OAUTH HANDLER ---
    if (req.url.startsWith('/shopify/auth')) {
        const shop = params.get('shop');
        if (!shop) return res.end('Missing shop parameter');
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${MASTER_CONFIG.SHOPIFY_API_KEY}&scope=read_orders,read_products&redirect_uri=${MASTER_CONFIG.REDIRECT_URI}`;
        res.writeHead(302, { 'Location': authUrl });
        return res.end();
    }

    if (req.url.startsWith('/shopify/callback')) {
        const code = params.get('code');
        const shop = params.get('shop');

        if (!code || !shop) {
            res.end(`Missing code or shop. Params: ${queryString}`);
            return;
        }

        log(`[Shopify-OAuth] Exchanging code for token for shop: ${shop}`);

        // In a real app, you'd exchange the code here.
        // For this bridge, we'll show a "Success" page that the frontend can pick up.
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <body style="background:#0f0a1a; color:white; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh;">
                    <div style="background:rgba(255,255,255,0.05); padding:40px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); text-align:center;">
                        <h1 style="color:#10b981;">Sync Established!</h1>
                        <p>OAuth Code: <code style="background:rgba(0,0,0,0.3); padding:5px 10px; border-radius:10px;">${code}</code></p>
                        <p style="opacity:0.6; font-size:12px;">Copy this code back to the dashboard if the window doesn't close automatically.</p>
                        <button onclick="window.close()" style="background:#10b981; color:white; border:none; padding:12px 30px; border-radius:15px; font-weight:bold; cursor:pointer; margin-top:20px;">Return to Dashboard</button>
                    </div>
                    <script>
                        if (window.opener) {
                            window.opener.postMessage({ type: 'SHOPIFY_AUTH_SUCCESS', code: '${code}', shop: '${shop}' }, '*');
                        }
                    </script>
                </body>
            </html>
        `);
        return;
    }

    if (urlParts.length < 2) {
        res.writeHead(400);
        res.end('Invalid request format. Use /[host]/[path]');
        return;
    }

    let targetHost = urlParts[0];
    let targetPath = '/' + urlParts.slice(1).join('/') + queryString;

    // Handle encoded characters like colons (:) which Google Ads requires literal
    targetPath = decodeURIComponent(targetPath);

    // Handle special cases for common platforms if host isn't fully qualified
    if (targetHost === 'meta') targetHost = 'graph.facebook.com';
    else if (targetHost === 'google') targetHost = 'googleads.googleapis.com';
    else if (targetHost === 'tiktok') targetHost = 'business-api.tiktok.com';
    else if (targetHost === 'snapchat') targetHost = 'adsapi.snapchat.com';

    // Special fix for Google Ads v18 structure
    if (targetHost === 'googleads.googleapis.com') {
        if (!targetPath.startsWith('/v')) {
            targetPath = '/v18' + targetPath;
        }
    }

    const authHeader = req.headers['authorization'] || '';
    const isMock = authHeader.includes('simulated') || authHeader.includes('demo');

    if (isMock) {
        log(`[Proxy] Returning MOCK data for: ${targetHost}${targetPath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });

        let mockData = {};
        if (targetHost === 'googleads.googleapis.com') {
            mockData = { resourceNames: ["customers/123-456-7890", "customers/987-654-3210"] };
        } else if (targetHost === 'graph.facebook.com') {
            mockData = { data: [{ id: '123', name: 'Meta Demo Business' }] };
        } else if (targetHost === 'business-api.tiktok.com') {
            mockData = { data: { list: [{ advertiser_id: 'TT123', advertiser_name: 'TikTok Demo' }] } };
        } else if (targetHost === 'adsapi.snapchat.com') {
            mockData = { adaccounts: [{ id: 'SN123', name: 'Snap Demo Account' }] };
        }

        res.end(JSON.stringify(mockData));
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': targetHost,
        'User-Agent': 'AntiGravity-Dashboard/1.0'
    };

    if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];
    if (req.headers['x-shopify-access-token']) headers['X-Shopify-Access-Token'] = req.headers['x-shopify-access-token'];

    // Inject master dev token if not provided by frontend
    const devToken = req.headers['developer-token'] || MASTER_CONFIG.GOOGLE_DEVELOPER_TOKEN;
    if (devToken && devToken !== 'YOUR_DEVELOPER_TOKEN_HERE') {
        headers['developer-token'] = devToken;
    }

    const options = {
        hostname: targetHost,
        path: targetPath,
        method: req.method,
        headers: headers
    };

    log(`[Proxy] Requesting: ${options.method} https://${options.hostname}${options.path}`);
    log(`[Proxy] Headers: ${JSON.stringify(Object.keys(options.headers))}`);

    const proxyReq = https.request(options, (proxyRes) => {
        log(`[Proxy] Response: ${proxyRes.statusCode} from ${targetHost}`);

        if (proxyRes.statusCode >= 400) {
            let body = '';
            proxyRes.on('data', chunk => body += chunk);
            proxyRes.on('end', () => {
                log(`[Proxy Error Body] ${body}`);
            });
        }

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
        log(`[Proxy Error] ${e.message}`);
        res.writeHead(500);
        res.end(e.message);
    });

    req.pipe(proxyReq);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use.`);
        console.error(`💡 Try closing other terminal windows running the bridge or use: Taskkill /F /IM node.exe /T\n`);
    } else {
        console.error(`\n❌ Server Error: ${e.message}\n`);
    }
    process.exit(1);
});

server.listen(PORT, () => {
    console.log(`\n🚀 AntiGravity Multi-Platform Bridge running at http://localhost:${PORT}`);
    console.log(`🔗 Standardized CORS bypass for Shopify, Meta, Google, TikTok, & Snap.\n`);
});
