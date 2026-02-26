const http = require('http');
const https = require('https');
const fs = require('fs');
const PORT = process.env.PORT || 3001;

// Load .env file manually
try {
    const envPath = require('path').join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const [key, ...value] = trimmed.split('=');
            if (key && value) process.env[key.trim()] = value.join('=').trim();
        });
    }
} catch (e) {
    console.warn("Could not load .env file:", e.message);
}

// ─── MASTER CONFIG ──────────────────────────────────────────────────────────
const MASTER_CONFIG = {
    GOOGLE_DEVELOPER_TOKEN: process.env.GOOGLE_DEVELOPER_TOKEN || 'yLB0NLuGwKPYlHzFlHzp-A',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '695971374779-lgutit2vr7hseki58mo07ksphdg33i3g.apps.googleusercontent.com',
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY || '',
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET || '',
    NANGO_SECRET_KEY: process.env.NANGO_SECRET_KEY || '',
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

        if (!MASTER_CONFIG.SHOPIFY_API_KEY) {
            log(`[Shopify-Auth] ERROR: SHOPIFY_API_KEY is empty in .env!`);
            return res.end('Error: SHOPIFY_API_KEY is not configured in bridge .env');
        }

        const scopes = 'read_orders,read_products,read_inventory';
        const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${MASTER_CONFIG.SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(MASTER_CONFIG.REDIRECT_URI)}`;

        log(`[Shopify-Auth] Redirecting to Shopify: ${authUrl}`);
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

        const postData = JSON.stringify({
            client_id: MASTER_CONFIG.SHOPIFY_API_KEY,
            client_secret: MASTER_CONFIG.SHOPIFY_API_SECRET,
            code: code
        });

        const options = {
            hostname: shop,
            path: '/admin/oauth/access_token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const exchangeReq = https.request(options, (exchangeRes) => {
            let resBody = '';
            exchangeRes.on('data', chunk => resBody += chunk);
            exchangeRes.on('end', () => {
                try {
                    const data = JSON.parse(resBody);
                    if (exchangeRes.statusCode === 200 && data.access_token) {
                        const accessToken = data.access_token;
                        log(`[Shopify-OAuth] SUCCESS: Captured token for ${shop}. (Token: ${accessToken.substring(0, 10)}...)`);

                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(`
                            <html>
                                <body style="background:#0f0a1a; color:white; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; padding:20px; box-sizing:border-box;">
                                    <div style="background:rgba(255,255,255,0.05); padding:40px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); text-align:center; max-width: 450px; width:100%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                                        <div style="width:60px; height:60px; background:#10b981; border-radius:20px; display:flex; align-items:center; justify-content:center; margin: 0 auto 20px; box-shadow: 0 0 20px rgba(16,185,129,0.3);">
                                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <h1 style="color:#10b981; margin:0 0 10px 0; font-size:24px;">Sync Established</h1>
                                        <p style="opacity:0.7; font-size:14px; line-height:1.5; margin-bottom:20px;">HANDSHAKE SUCCESSFUL! Copy this token to the dashboard:</p>
                                        
                                        <div style="background:rgba(0,0,0,0.3); padding:20px; border-radius:15px; border:1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
                                            <code style="color:#10b981; font-family:monospace; font-size:14px; word-break:break-all; display:block;">${accessToken}</code>
                                        </div>

                                        <div id="status" style="margin-top:10px; font-size:12px; color:#3b82f6;">🚀 Communicating with dashboard...</div>
                                        <button onclick="window.close()" style="background:transparent; color:rgba(255,255,255,0.3); border:none; padding:10px; cursor:pointer; font-size:11px; margin-top:20px;">Close this window</button>
                                    </div>
                                    <script>
                                        const token = '${accessToken}';
                                        function sendHandshake() {
                                            if (window.opener) {
                                                window.opener.postMessage({ type: 'SHOPIFY_AUTH_SUCCESS', token, shop: '${shop}' }, '*');
                                                document.getElementById('status').innerText = "✅ Sent to Dashboard!";
                                                setTimeout(() => window.close(), 1500);
                                            }
                                        }
                                        sendHandshake();
                                        setTimeout(sendHandshake, 1000);
                                    </script>
                                </body>
                            </html>
                        `);
                    } else {
                        log(`[Shopify-OAuth] FAILED: ${JSON.stringify(data)}`);
                        res.writeHead(400);
                        res.end(`OAuth Error: ${data.errors || data.error_description || 'Unknown error'}`);
                    }
                } catch (e) {
                    log(`[Shopify-OAuth] Parse Error: ${e.message} | Body: ${resBody}`);
                    res.writeHead(500);
                    res.end(`Internal Server Error during exchange: ${e.message}`);
                }
            });
        });

        exchangeReq.on('error', (e) => {
            log(`[Shopify-OAuth] Request Error: ${e.message}`);
            res.writeHead(500);
            res.end(`Network Error during exchange: ${e.message}`);
        });

        exchangeReq.write(postData);
        exchangeReq.end();
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

    const nangoConnId = req.headers['x-nango-connection-id'];
    const nangoIntegId = req.headers['x-nango-integration-id'];

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Host': nangoConnId ? 'api.nango.dev' : targetHost,
        'User-Agent': 'AntiGravity-Dashboard/1.0'
    };

    if (nangoConnId && nangoIntegId) {
        log(`[Bridge] Nango Neural Proxy active: ${nangoIntegId} (${nangoConnId})`);
        headers['Authorization'] = `Bearer ${MASTER_CONFIG.NANGO_SECRET_KEY}`;
        headers['Provider-Config-Key'] = nangoIntegId;
        headers['Connection-Id'] = nangoConnId;
        targetHost = 'api.nango.dev';
        targetPath = `/proxy${targetPath}`;
    } else {
        if (req.headers['authorization']) headers['Authorization'] = req.headers['authorization'];
        if (req.headers['x-shopify-access-token']) headers['X-Shopify-Access-Token'] = req.headers['x-shopify-access-token'];

        // Inject master dev token if not provided by frontend
        const devToken = req.headers['developer-token'] || MASTER_CONFIG.GOOGLE_DEVELOPER_TOKEN;
        if (devToken && devToken !== 'YOUR_DEVELOPER_TOKEN_HERE') {
            headers['developer-token'] = devToken;
        }
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
