const http = require('http');
const https = require('https');
const PORT = 3001;

// ─── MASTER CONFIG ──────────────────────────────────────────────────────────
// Update these to your real credentials once for a "Direct" experience.
const MASTER_CONFIG = {
    GOOGLE_DEVELOPER_TOKEN: 'yLB0NLuGwKPYlHzFlHzp-A',
    GOOGLE_CLIENT_ID: '695971374779-lgutit2vr7hseki58mo07ksphdg33i3g.apps.googleusercontent.com',
    SHOPIFY_API_KEY: '', // Optional: Put your Shopify App Client ID here for "One-Click"
    SHOPIFY_API_SECRET: '',
    REDIRECT_URI: 'http://localhost:3001/shopify/callback'
};
// ─────────────────────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Shopify-Access-Token, Authorization, Content-Type, developer-token');

    console.log(`[Bridge] ${req.method} ${req.url}`);
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
        const pReq = https.request(options, (pRes) => {
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
        // This would handle the code -> token exchange
        // For local use, we usually stick to Custom Apps, but this route is ready for Public Apps.
        const code = params.get('code');
        res.end(`OAuth Success! Copy this code to the bridge or configure secret: ${code}`);
        return;
    }

    if (urlParts.length < 2) {
        res.writeHead(400);
        res.end('Invalid request format. Use /[host]/[path]');
        return;
    }

    let targetHost = urlParts[0];
    let targetPath = '/' + urlParts.slice(1).join('/') + queryString;

    console.log(`[Bridge] Incoming Request: ${req.url}`);
    console.log(`[Proxy Mapping] ${urlParts[0]} -> ${targetHost} | Path: ${targetPath}`);

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
        console.log(`[Proxy] Returning MOCK data for: ${targetHost}${targetPath}`);
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
        headers['developer-token'] = devToken;
    }

    console.log(`[Proxy] Proxying to: https://${targetHost}${targetPath}`);

    const options = {
        hostname: targetHost,
        path: targetPath,
        method: req.method,
        headers: headers
    };

    console.log(`[Proxy] Requesting: ${options.method} https://${options.hostname}${options.path}`);
    console.log(`[Proxy] Headers: ${JSON.stringify(Object.keys(options.headers))}`);

    const proxyReq = https.request(options, (proxyRes) => {
        console.log(`[Proxy] Response: ${proxyRes.statusCode} from ${targetHost}`);

        if (proxyRes.statusCode === 404) {
            let body = '';
            proxyRes.on('data', chunk => body += chunk);
            proxyRes.on('end', () => console.log(`[Proxy 404 Body] ${body}`));
        }

        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (e) => {
        console.error(`[Proxy Error] ${e.message}`);
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
