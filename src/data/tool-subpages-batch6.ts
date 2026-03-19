import type { ToolSubpage } from "./tool-subpages";

export const batch6Subpages: Record<string, ToolSubpage[]> = {
  "json-formatter": [
    {
      slug: "python-json-format",
      title: "Python JSON Formatter",
      metaTitle: "Python JSON Formatter — Format & Pretty Print JSON Online",
      metaDescription:
        "Format and pretty print JSON for Python projects. Validate JSON before json.loads(), see Python code examples, and format JSON instantly in your browser.",
      h1: "Python JSON Formatter & Pretty Printer",
      intro:
        "Format and validate JSON for your Python projects. Paste your JSON below to instantly format it, then use the Python code examples to parse it in your application. All processing happens in your browser — your data never leaves your device.",
      content: [
        {
          heading: "How to format JSON in Python",
          body: "Python's built-in json module handles JSON formatting with json.dumps(). To pretty print JSON: import json; formatted = json.dumps(data, indent=2, sort_keys=True). To read a JSON file: with open('data.json') as f: data = json.load(f). To write formatted JSON: with open('output.json', 'w') as f: json.dump(data, f, indent=2). The indent parameter controls spacing (2 or 4 spaces are standard), and sort_keys alphabetizes object keys for consistent output.",
        },
        {
          heading: "Common Python JSON errors and how to fix them",
          body: "json.decoder.JSONDecodeError is the most common error when parsing JSON in Python. Common causes: trailing commas (invalid in JSON but valid in Python dicts), single quotes instead of double quotes, unquoted keys, comments in JSON, and NaN/Infinity values. Use this formatter to validate your JSON before calling json.loads(). If you're converting Python dicts to JSON, remember that Python True/False/None become true/false/null in JSON — json.dumps() handles this automatically.",
        },
        {
          heading: "Why use an online JSON formatter for Python development",
          body: "When debugging API responses, inspecting configuration files, or validating webhook payloads, an online formatter is faster than writing a script. Paste the raw JSON, verify it's valid, format it for readability, then copy it into your Python code. This tool is especially useful when working with requests library responses (response.json()), FastAPI/Flask request bodies, or AWS Lambda event payloads. Since DevBolt processes everything client-side, it's safe to paste production API responses containing tokens or credentials.",
        },
      ],
      faqs: [
        {
          question: "How do I pretty print JSON in Python?",
          answer:
            "Use json.dumps(data, indent=2) to pretty print JSON in Python. For a JSON string, first parse it with json.loads(json_string), then format it with json.dumps(parsed, indent=2, sort_keys=True). The indent parameter sets the number of spaces for indentation.",
        },
        {
          question: "How do I fix JSONDecodeError in Python?",
          answer:
            "JSONDecodeError usually means the JSON is malformed. Common fixes: replace single quotes with double quotes, remove trailing commas, remove comments, ensure keys are quoted strings, and replace Python None/True/False with null/true/false. Use this formatter to validate your JSON and pinpoint the exact error location.",
        },
        {
          question: "Can I use this formatter for Python dict output?",
          answer:
            "Yes. If you have a Python dict printed with print(), note that Python uses single quotes and None/True/False, which are not valid JSON. Convert it first with json.dumps(your_dict) in Python, then paste the output here to format it.",
        },
      ],
      keywords: [
        "python json format",
        "python json pretty print",
        "python format json",
        "python json.dumps indent",
        "python json formatter",
        "python json beautify",
        "python json loads",
        "python parse json",
      ],
      parentToolSlug: "json-formatter",
      parentToolName: "JSON Formatter",
    },
    {
      slug: "go-json-format",
      title: "Go JSON Formatter",
      metaTitle: "Go JSON Formatter — Format & Marshal JSON for Go Online",
      metaDescription:
        "Format JSON for Go projects. Validate JSON before json.Unmarshal(), see Go struct examples, and format JSON instantly in your browser.",
      h1: "Go JSON Formatter & Validator",
      intro:
        "Format and validate JSON for your Go projects. Paste your JSON below to format it, then use the Go code examples to marshal and unmarshal it in your application. Everything runs in your browser — safe for production data.",
      content: [
        {
          heading: "How to format JSON in Go",
          body: "Go's encoding/json package provides json.MarshalIndent() for pretty printing: output, err := json.MarshalIndent(data, \"\", \"  \"). To parse JSON into a struct: err := json.Unmarshal([]byte(jsonStr), &result). For compact JSON, use json.Marshal(). To format raw JSON bytes, use json.Indent(): var buf bytes.Buffer; json.Indent(&buf, rawJSON, \"\", \"  \"). Go's json package uses struct tags to map JSON keys: type User struct { Name string `json:\"name\"` }.",
        },
        {
          heading: "Common Go JSON patterns",
          body: "For dynamic JSON without predefined structs, use map[string]interface{} or json.RawMessage. Go 1.18+ generics don't directly help with JSON, but packages like go-json and sonic offer faster marshaling. For streaming large JSON, use json.NewDecoder(reader) and json.NewEncoder(writer). Handle missing fields with pointer types (*string) or the omitempty tag. Custom marshaling: implement the json.Marshaler interface with MarshalJSON() ([]byte, error).",
        },
        {
          heading: "Why validate JSON before json.Unmarshal()",
          body: "Go's json.Unmarshal returns generic errors that don't always pinpoint the exact issue. Using this formatter first, you can identify syntax errors (missing commas, unclosed brackets, trailing commas) before writing Go code. This is especially useful when debugging HTTP response bodies from http.Get() or API clients, testing Go struct tag mappings against real payloads, and validating configuration files used with json.NewDecoder().",
        },
      ],
      faqs: [
        {
          question: "How do I pretty print JSON in Go?",
          answer:
            "Use json.MarshalIndent(data, \"\", \"  \") for struct data. For raw JSON bytes, use json.Indent(&buf, rawBytes, \"\", \"  \") with a bytes.Buffer. Both produce formatted JSON with 2-space indentation.",
        },
        {
          question: "How do I handle unknown JSON fields in Go?",
          answer:
            "Use map[string]interface{} to unmarshal arbitrary JSON: var result map[string]interface{}; json.Unmarshal(data, &result). For partial parsing, embed json.RawMessage in your struct to defer decoding of specific fields.",
        },
        {
          question: "Why does json.Marshal escape HTML characters?",
          answer:
            "Go's json.Marshal escapes <, >, and & to \\u003c, \\u003e, \\u0026 for safe HTML embedding. To disable this, use json.NewEncoder with SetEscapeHTML(false): enc := json.NewEncoder(&buf); enc.SetEscapeHTML(false); enc.Encode(data).",
        },
      ],
      keywords: [
        "go json format",
        "golang json format",
        "go json marshal indent",
        "go json pretty print",
        "golang json formatter",
        "go json unmarshal",
        "go json struct tags",
        "golang parse json",
      ],
      parentToolSlug: "json-formatter",
      parentToolName: "JSON Formatter",
    },
  ],

  base64: [
    {
      slug: "javascript-base64-encode",
      title: "JavaScript Base64 Encode & Decode",
      metaTitle: "JavaScript Base64 Encode & Decode — btoa() & atob() Online",
      metaDescription:
        "Encode and decode Base64 in JavaScript. Test btoa(), atob(), and Buffer methods online. Code examples for browser and Node.js Base64 encoding.",
      h1: "JavaScript Base64 Encoder & Decoder",
      intro:
        "Encode and decode Base64 strings for JavaScript projects. Test your Base64 operations instantly, then use the code examples for browser (btoa/atob) and Node.js (Buffer) implementations. 100% client-side — your data stays in your browser.",
      content: [
        {
          heading: "How to encode Base64 in JavaScript",
          body: "In the browser, use btoa() to encode: const encoded = btoa('Hello World'). For Node.js, use Buffer: const encoded = Buffer.from('Hello World').toString('base64'). Important: btoa() only handles Latin-1 characters. For Unicode strings, first encode to UTF-8: const encoded = btoa(unescape(encodeURIComponent(unicodeString))). Or in modern environments: const encoded = btoa(new TextEncoder().encode(str).reduce((s, b) => s + String.fromCharCode(b), '')).",
        },
        {
          heading: "How to decode Base64 in JavaScript",
          body: "Browser decoding: const decoded = atob(encodedString). Node.js: const decoded = Buffer.from(encodedString, 'base64').toString('utf-8'). For Base64URL (used in JWTs and URLs), replace - with + and _ with / before decoding, or use a library. Common error: 'InvalidCharacterError: The string to be decoded is not correctly encoded' — this means your Base64 string has invalid characters or incorrect padding. Use this tool to verify your Base64 string is valid before decoding in code.",
        },
        {
          heading: "Base64 in JavaScript: browser vs Node.js",
          body: "Browser JavaScript uses btoa()/atob() (Binary to ASCII and ASCII to Binary). Node.js uses Buffer.from(str, 'base64') and buffer.toString('base64'). In Deno and Bun, both APIs are available. For isomorphic code that works everywhere, consider the base64-js npm package or a polyfill. The Fetch API also supports Base64 via: await (await fetch('data:;base64,' + encoded)).text(). For file uploads, FileReader.readAsDataURL() returns a Base64 data URL automatically.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between btoa() and Buffer.from().toString('base64')?",
          answer:
            "btoa() is a browser API that encodes Latin-1 strings to Base64. Buffer.from().toString('base64') is Node.js-specific and handles any encoding including UTF-8. btoa() throws an error on non-Latin-1 characters; Buffer handles Unicode natively.",
        },
        {
          question: "How do I Base64 encode Unicode strings in JavaScript?",
          answer:
            "Use TextEncoder: btoa(String.fromCharCode(...new TextEncoder().encode(str))). In Node.js: Buffer.from(str, 'utf-8').toString('base64'). The key is encoding the string to UTF-8 bytes first, then Base64 encoding those bytes.",
        },
        {
          question: "How do I decode a Base64 data URL in JavaScript?",
          answer:
            "Split the data URL to get the Base64 part: const base64 = dataUrl.split(',')[1]. Then decode: atob(base64) for text, or fetch(dataUrl).then(r => r.blob()) for binary data like images.",
        },
      ],
      keywords: [
        "javascript base64 encode",
        "javascript base64 decode",
        "js btoa atob",
        "javascript btoa",
        "node base64 encode",
        "javascript base64",
        "js base64 encode string",
        "buffer base64 nodejs",
      ],
      parentToolSlug: "base64",
      parentToolName: "Base64 Encoder & Decoder",
    },
    {
      slug: "python-base64-encode",
      title: "Python Base64 Encode & Decode",
      metaTitle: "Python Base64 Encode & Decode — b64encode & b64decode Online",
      metaDescription:
        "Encode and decode Base64 in Python. Test base64.b64encode() and b64decode() online with code examples for strings, files, and URLs.",
      h1: "Python Base64 Encoder & Decoder",
      intro:
        "Encode and decode Base64 for Python projects. Test your Base64 operations instantly, then copy the Python code examples for your application. All processing happens locally in your browser.",
      content: [
        {
          heading: "How to encode Base64 in Python",
          body: "Python's base64 module handles encoding: import base64; encoded = base64.b64encode(b'Hello World').decode('utf-8'). Note that b64encode() takes bytes and returns bytes — use .decode('utf-8') to get a string. For strings: base64.b64encode('Hello World'.encode('utf-8')).decode('utf-8'). For files: with open('file.pdf', 'rb') as f: encoded = base64.b64encode(f.read()).decode('utf-8'). For URL-safe Base64 (replacing + and / with - and _): base64.urlsafe_b64encode(data).",
        },
        {
          heading: "How to decode Base64 in Python",
          body: "Decode with: decoded = base64.b64decode(encoded_string). The input can be a string or bytes. For URL-safe Base64: base64.urlsafe_b64decode(encoded). Common error: binascii.Error: Invalid base64-encoded string — this means incorrect padding or invalid characters. Fix padding issues with: encoded += '=' * (4 - len(encoded) % 4). To decode Base64 image data: image_data = base64.b64decode(base64_string); with open('image.png', 'wb') as f: f.write(image_data).",
        },
        {
          heading: "Python Base64 use cases",
          body: "Base64 encoding in Python is commonly used for: embedding images in HTML/CSS (data URIs), encoding email attachments (email.mime), API authentication headers (requests library: headers = {'Authorization': 'Basic ' + base64.b64encode(f'{user}:{pass}'.encode()).decode()}), storing binary data in JSON, encoding file uploads in REST APIs, and JWT token handling. The base64 module also supports Base16, Base32, and Base85 encoding variants.",
        },
      ],
      faqs: [
        {
          question: "Why does Python Base64 require bytes, not strings?",
          answer:
            "Base64 encodes binary data. Python 3 distinguishes between str (text) and bytes (binary). You must encode strings to bytes first: 'text'.encode('utf-8'), then Base64 encode the bytes. This prevents encoding errors with Unicode characters.",
        },
        {
          question: "How do I fix 'Incorrect padding' errors in Python Base64?",
          answer:
            "Base64 strings must be a multiple of 4 characters. Add padding: encoded += '=' * (4 - len(encoded) % 4). Or use base64.urlsafe_b64decode() which is more lenient. You can also strip whitespace first: encoded.strip().",
        },
        {
          question: "What is the difference between b64encode and urlsafe_b64encode?",
          answer:
            "Standard b64encode uses + and / characters, which have special meaning in URLs. urlsafe_b64encode replaces them with - and _ respectively. Use urlsafe variants for data that appears in URLs, filenames, or JWT tokens.",
        },
      ],
      keywords: [
        "python base64 encode",
        "python base64 decode",
        "python b64encode",
        "python base64 string",
        "python base64 encode file",
        "python base64 image",
        "base64 python",
        "python base64 encode decode",
      ],
      parentToolSlug: "base64",
      parentToolName: "Base64 Encoder & Decoder",
    },
  ],

  "jwt-decoder": [
    {
      slug: "nodejs-jwt-decode",
      title: "Node.js JWT Decode & Verify",
      metaTitle: "Node.js JWT Decode & Verify — jsonwebtoken Online Tester",
      metaDescription:
        "Decode and inspect JWTs for Node.js. Test tokens before jsonwebtoken.verify(), see code examples for Express middleware, and debug JWT claims online.",
      h1: "Node.js JWT Decoder & Verifier",
      intro:
        "Decode and inspect JSON Web Tokens for your Node.js applications. Paste a JWT to see its header, payload, and signature, then use the code examples to implement verification in Express, Fastify, or plain Node.js. Your tokens stay in your browser.",
      content: [
        {
          heading: "How to decode and verify JWTs in Node.js",
          body: "Install the jsonwebtoken package: npm install jsonwebtoken. To decode without verification (inspect claims): const decoded = jwt.decode(token, { complete: true }). To verify with a secret: const payload = jwt.verify(token, secretOrPublicKey). For RS256 tokens, pass the public key or certificate. Common pattern: try { const payload = jwt.verify(token, secret); } catch (err) { if (err.name === 'TokenExpiredError') { /* handle expiry */ } }. Use this tool to inspect token claims before writing verification logic.",
        },
        {
          heading: "Express JWT middleware pattern",
          body: "Standard Express authentication middleware: const authMiddleware = (req, res, next) => { const token = req.headers.authorization?.split(' ')[1]; if (!token) return res.status(401).json({ error: 'No token' }); try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); } catch { res.status(403).json({ error: 'Invalid token' }); } }. For production, consider express-jwt or passport-jwt which handle edge cases. Always validate the iss (issuer) and aud (audience) claims in addition to the signature.",
        },
        {
          heading: "Debugging JWT issues in Node.js",
          body: "Common JWT errors: 'jwt expired' (check exp claim — paste your token here to see the exact timestamp), 'invalid signature' (wrong secret/key or token was modified), 'jwt malformed' (not a valid JWT format — should be three dot-separated Base64URL segments), 'jwt not active' (nbf claim is in the future). The jsonwebtoken library also supports clockTolerance for clock skew between servers. For RS256/ES256, ensure you're using the matching public key — paste the token here to check the alg header.",
        },
      ],
      faqs: [
        {
          question: "How do I decode a JWT in Node.js without verifying it?",
          answer:
            "Use jwt.decode(token, { complete: true }) from the jsonwebtoken package. This returns { header, payload, signature } without checking the signature. Useful for inspecting claims, but never trust unverified tokens for authorization.",
        },
        {
          question: "Should I use jsonwebtoken or jose in Node.js?",
          answer:
            "jsonwebtoken is the most popular (15M+ weekly downloads) and simpler for basic HS256/RS256 use cases. jose is newer, supports Web Crypto API, works in Edge runtimes (Vercel Edge, Cloudflare Workers), and handles JWE (encrypted tokens). Use jose for modern runtimes; jsonwebtoken for traditional Node.js servers.",
        },
        {
          question: "How do I handle JWT expiration in Express?",
          answer:
            "Catch the TokenExpiredError in your middleware: if (err.name === 'TokenExpiredError') { /* refresh or re-authenticate */ }. Set reasonable exp times (15 minutes for access tokens, 7 days for refresh tokens). Implement token refresh with a separate /refresh endpoint that issues new access tokens.",
        },
      ],
      keywords: [
        "nodejs jwt decode",
        "node jwt verify",
        "jsonwebtoken nodejs",
        "express jwt middleware",
        "node js jwt decode",
        "jwt verify nodejs",
        "jsonwebtoken verify",
        "node jwt token",
      ],
      parentToolSlug: "jwt-decoder",
      parentToolName: "JWT Decoder",
    },
    {
      slug: "python-jwt-decode",
      title: "Python JWT Decode & Verify",
      metaTitle: "Python JWT Decode & Verify — PyJWT Online Tester",
      metaDescription:
        "Decode and verify JWTs in Python. Test tokens before PyJWT decode(), see Flask/Django middleware examples, and inspect JWT claims online.",
      h1: "Python JWT Decoder & Verifier",
      intro:
        "Decode and inspect JSON Web Tokens for your Python applications. Paste a JWT to see its header, payload, and claims, then use the code examples for PyJWT, Flask-JWT-Extended, or Django REST Framework. All decoding is client-side.",
      content: [
        {
          heading: "How to decode JWTs in Python",
          body: "Install PyJWT: pip install PyJWT. To decode and verify: import jwt; payload = jwt.decode(token, secret, algorithms=['HS256']). To decode without verification (inspection only): payload = jwt.decode(token, options={'verify_signature': False}). For RS256 tokens: payload = jwt.decode(token, public_key, algorithms=['RS256']). Always specify the algorithms parameter explicitly to prevent algorithm confusion attacks. Note: the package is 'PyJWT' on pip but imported as 'jwt' — don't confuse with the deprecated 'jwt' package.",
        },
        {
          heading: "Python JWT in Flask and Django",
          body: "Flask-JWT-Extended simplifies JWT auth: from flask_jwt_extended import jwt_required, get_jwt_identity; @app.route('/protected'); @jwt_required(); def protected(): user = get_jwt_identity(). For Django REST Framework: pip install djangorestframework-simplejwt, then add 'rest_framework_simplejwt.authentication.JWTAuthentication' to DEFAULT_AUTHENTICATION_CLASSES. Both libraries handle token creation, refresh, blacklisting, and claim validation automatically. For FastAPI: pip install python-jose; use OAuth2PasswordBearer + jwt.decode() in a Depends() dependency.",
        },
        {
          heading: "Common Python JWT pitfalls",
          body: "Pitfall 1: importing 'jwt' when you have both PyJWT and python-jose installed — they conflict. Pitfall 2: not specifying algorithms= allows algorithm switching attacks. Pitfall 3: jwt.decode() in PyJWT 2.x requires algorithms parameter (breaking change from 1.x). Pitfall 4: DecodeError vs ExpiredSignatureError vs InvalidSignatureError — handle each differently. Use this tool to inspect your token's algorithm (alg header) and expiration (exp claim) before writing Python decode logic.",
        },
      ],
      faqs: [
        {
          question: "How do I decode a JWT without verification in Python?",
          answer:
            "Use jwt.decode(token, options={'verify_signature': False}) with PyJWT 2.x. In PyJWT 1.x, use jwt.decode(token, verify=False). This is safe for inspecting claims but never use unverified tokens for authorization decisions.",
        },
        {
          question: "What is the difference between PyJWT and python-jose?",
          answer:
            "PyJWT (import jwt) is the most popular Python JWT library with 100M+ downloads. python-jose (import jose) supports JWE (encrypted tokens) and JWK (JSON Web Keys) in addition to JWS. Use PyJWT for standard JWT needs; use python-jose if you need JWE encryption or JWK key management.",
        },
        {
          question: "How do I handle expired JWTs in Python?",
          answer:
            "Catch jwt.ExpiredSignatureError: try: payload = jwt.decode(token, secret, algorithms=['HS256']); except jwt.ExpiredSignatureError: # Token has expired — refresh or re-authenticate. Set expiration when creating: jwt.encode({'exp': datetime.utcnow() + timedelta(hours=1), ...}, secret).",
        },
      ],
      keywords: [
        "python jwt decode",
        "python jwt verify",
        "pyjwt decode",
        "python json web token",
        "flask jwt",
        "django jwt",
        "python jwt token",
        "pyjwt example",
      ],
      parentToolSlug: "jwt-decoder",
      parentToolName: "JWT Decoder",
    },
  ],

  "hash-generator": [
    {
      slug: "python-sha256",
      title: "Python SHA-256 Hash Generator",
      metaTitle: "Python SHA-256 Hash — hashlib.sha256() Online Generator",
      metaDescription:
        "Generate SHA-256 hashes for Python. Test hashlib.sha256() output online, see code examples for file hashing and HMAC, and verify hashes instantly.",
      h1: "Python SHA-256 Hash Generator",
      intro:
        "Generate SHA-256 hashes and verify them against your Python hashlib output. Paste text to hash it instantly, then use the Python code examples for strings, files, and HMAC. All hashing runs in your browser via Web Crypto API.",
      content: [
        {
          heading: "How to generate SHA-256 hashes in Python",
          body: "Python's hashlib module provides SHA-256: import hashlib; hash = hashlib.sha256(b'Hello World').hexdigest(). For strings, encode first: hashlib.sha256('Hello World'.encode('utf-8')).hexdigest(). For large files, read in chunks: h = hashlib.sha256(); with open('file', 'rb') as f: for chunk in iter(lambda: f.read(8192), b''): h.update(chunk); print(h.hexdigest()). The update() method lets you hash data incrementally without loading everything into memory.",
        },
        {
          heading: "Python HMAC-SHA256 for API authentication",
          body: "Many APIs (AWS, Stripe webhooks, GitHub) use HMAC-SHA256 for request signing: import hmac; signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest(). To verify a webhook: expected = hmac.new(key, payload, hashlib.sha256).hexdigest(); if hmac.compare_digest(expected, received_signature): # Valid. Always use hmac.compare_digest() instead of == to prevent timing attacks. For AWS Signature V4, Python's boto3 handles HMAC signing automatically.",
        },
        {
          heading: "SHA-256 for password hashing in Python",
          body: "While SHA-256 is a secure hash, do NOT use plain SHA-256 for passwords — it is too fast and vulnerable to brute force. Use purpose-built password hashing: import bcrypt; hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()). Or use hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000) which uses SHA-256 internally with key stretching. For new projects, argon2-cffi is the recommended choice. Use this tool to generate SHA-256 hashes for checksums, data integrity, and non-password applications.",
        },
      ],
      faqs: [
        {
          question: "How do I generate a SHA-256 hash of a file in Python?",
          answer:
            "Read the file in binary chunks: h = hashlib.sha256(); with open('file.bin', 'rb') as f: for chunk in iter(lambda: f.read(8192), b''): h.update(chunk); print(h.hexdigest()). This handles files of any size without loading them entirely into memory.",
        },
        {
          question: "Is hashlib.sha256() safe for passwords?",
          answer:
            "No. Plain SHA-256 is too fast for password hashing, making it vulnerable to brute-force attacks. Use bcrypt, scrypt, or argon2 instead — they are intentionally slow and include salt. hashlib.pbkdf2_hmac('sha256', ...) with 100,000+ iterations is also acceptable.",
        },
        {
          question: "How do I verify an HMAC-SHA256 signature in Python?",
          answer:
            "Use hmac.compare_digest(): expected = hmac.new(secret_bytes, message_bytes, hashlib.sha256).hexdigest(); is_valid = hmac.compare_digest(expected, received_sig). Never use == for signature comparison — it is vulnerable to timing attacks.",
        },
      ],
      keywords: [
        "python sha256",
        "python hashlib sha256",
        "python sha256 hash",
        "python hmac sha256",
        "python hash string",
        "hashlib sha256",
        "python generate hash",
        "python sha256 file",
      ],
      parentToolSlug: "hash-generator",
      parentToolName: "Hash Generator",
    },
    {
      slug: "javascript-sha256",
      title: "JavaScript SHA-256 Hash Generator",
      metaTitle: "JavaScript SHA-256 Hash — Web Crypto API & Node.js Online",
      metaDescription:
        "Generate SHA-256 hashes in JavaScript. Test crypto.subtle.digest() and Node.js crypto output online with code examples for browser and server.",
      h1: "JavaScript SHA-256 Hash Generator",
      intro:
        "Generate SHA-256 hashes and test them against your JavaScript output. Paste text to hash it instantly, then use the code examples for browser (Web Crypto API) and Node.js (crypto module) implementations. All hashing is client-side.",
      content: [
        {
          heading: "How to generate SHA-256 hashes in JavaScript",
          body: "Browser (Web Crypto API): async function sha256(message) { const encoder = new TextEncoder(); const data = encoder.encode(message); const hash = await crypto.subtle.digest('SHA-256', data); return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''); }. Node.js: const crypto = require('crypto'); const hash = crypto.createHash('sha256').update('Hello World').digest('hex'). Note: Web Crypto API is async (returns a Promise); Node.js crypto is synchronous by default.",
        },
        {
          heading: "SHA-256 hashing patterns in web development",
          body: "Common use cases: Subresource Integrity (SRI) for script tags — generate a SHA-256 hash of your CDN scripts and add integrity='sha256-...' to prevent tampering. Content hashing for cache busting — hash file contents to generate unique URLs. Webhook verification — HMAC-SHA256 to validate incoming webhooks from Stripe, GitHub, or Slack. In Node.js: const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex'). For client-side, Web Crypto API also supports HMAC: crypto.subtle.sign('HMAC', key, data).",
        },
        {
          heading: "SHA-256 performance in JavaScript",
          body: "Web Crypto API is significantly faster than pure JavaScript implementations because it uses native C/C++ code under the hood. For Node.js, the built-in crypto module is also native. Avoid pure JS libraries like js-sha256 unless you need compatibility with very old browsers. In Web Workers, crypto.subtle is available for off-main-thread hashing. For hashing large files: read in chunks with FileReader or ReadableStream, and use crypto.subtle.digest() on the complete ArrayBuffer, or use Node.js createHash() with stream.pipe().",
        },
      ],
      faqs: [
        {
          question: "How do I generate a SHA-256 hash in the browser?",
          answer:
            "Use the Web Crypto API: const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)). Convert the ArrayBuffer result to hex: Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').",
        },
        {
          question: "Can I use SHA-256 synchronously in Node.js?",
          answer:
            "Yes. Node.js crypto is synchronous: require('crypto').createHash('sha256').update(data).digest('hex'). For async streaming of large files, use createHash() with readable.pipe().",
        },
        {
          question: "How do I verify a webhook signature with SHA-256 in JavaScript?",
          answer:
            "Node.js: const expected = crypto.createHmac('sha256', secret).update(requestBody).digest('hex'); if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) { /* valid */ }. Use timingSafeEqual() to prevent timing attacks.",
        },
      ],
      keywords: [
        "javascript sha256",
        "js sha256 hash",
        "javascript crypto sha256",
        "web crypto api sha256",
        "node sha256",
        "javascript hash string",
        "crypto subtle digest",
        "nodejs sha256",
      ],
      parentToolSlug: "hash-generator",
      parentToolName: "Hash Generator",
    },
  ],

  "uuid-generator": [
    {
      slug: "python-uuid-generate",
      title: "Python UUID Generator",
      metaTitle: "Python UUID Generator — uuid4() & uuid1() Online",
      metaDescription:
        "Generate UUIDs for Python projects. Test uuid.uuid4() output online, see code examples for UUID v1/v4/v5, and understand UUID formats for databases.",
      h1: "Python UUID Generator",
      intro:
        "Generate UUIDs and test them for your Python projects. Generate random UUIDs instantly, then use the Python code examples for uuid4, uuid1, uuid5, and database integration. All generation happens in your browser.",
      content: [
        {
          heading: "How to generate UUIDs in Python",
          body: "Python's uuid module: import uuid; id = uuid.uuid4() generates a random UUID v4. Other versions: uuid.uuid1() (MAC address + timestamp — includes machine identity), uuid.uuid3(uuid.NAMESPACE_DNS, 'example.com') (MD5-based deterministic), uuid.uuid5(uuid.NAMESPACE_DNS, 'example.com') (SHA-1-based deterministic). Access as string: str(uuid.uuid4()) returns '550e8400-e29b-41d4-a716-446655440000'. As hex without dashes: uuid.uuid4().hex. As bytes: uuid.uuid4().bytes (16 bytes).",
        },
        {
          heading: "UUIDs in Python databases",
          body: "SQLAlchemy: from sqlalchemy import Column; from sqlalchemy.dialects.postgresql import UUID; id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4). Django: from django.db import models; id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False). For PostgreSQL, use the native uuid type. For SQLite/MySQL, store as CHAR(36) or BINARY(16). Performance tip: uuid.uuid4().bytes (16 bytes) is more storage-efficient than the 36-character string representation. Consider UUIDv7 (via uuid6 package) for database-friendly time-sortable IDs.",
        },
        {
          heading: "When to use each UUID version in Python",
          body: "UUID v4 (uuid.uuid4()): Best general purpose — 122 bits of randomness, no information leakage. Use for database primary keys, API identifiers, session tokens. UUID v1 (uuid.uuid1()): Includes timestamp and MAC address — use when you need time-ordering but note it exposes machine identity. UUID v5 (uuid.uuid5()): Deterministic — same input always produces the same UUID. Use for generating consistent IDs from names (e.g., converting email addresses to UUIDs). UUID v7 (pip install uuid6): Time-sortable random UUIDs — best for database primary keys where insert order matters.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between uuid1() and uuid4() in Python?",
          answer:
            "uuid4() generates a random UUID using the OS random number generator — it is the most common choice. uuid1() uses the machine's MAC address and current timestamp, making UUIDs sortable by time but leaking hardware identity. Use uuid4() unless you specifically need time-ordering.",
        },
        {
          question: "How do I use UUIDs as Django model primary keys?",
          answer:
            "Use models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False). Note: pass uuid.uuid4 without parentheses — Django calls the function for each new instance. This replaces the default auto-incrementing integer primary key.",
        },
        {
          question: "Are Python uuid4() UUIDs truly random?",
          answer:
            "Yes. Python's uuid.uuid4() uses os.urandom() which provides cryptographically secure random bytes from the operating system. With 122 random bits, the probability of collision is negligible — you would need to generate 2.7 quintillion UUIDs to have a 50% chance of one collision.",
        },
      ],
      keywords: [
        "python uuid",
        "python uuid4",
        "python generate uuid",
        "python uuid generator",
        "uuid python",
        "python uuid module",
        "python uuid to string",
        "django uuid field",
      ],
      parentToolSlug: "uuid-generator",
      parentToolName: "UUID Generator",
    },
    {
      slug: "nodejs-uuid-generate",
      title: "Node.js UUID Generator",
      metaTitle: "Node.js UUID Generator — crypto.randomUUID() Online",
      metaDescription:
        "Generate UUIDs for Node.js. Test crypto.randomUUID() and uuid package output online with code examples for Express, databases, and APIs.",
      h1: "Node.js UUID Generator",
      intro:
        "Generate UUIDs for your Node.js applications. Create random UUIDs instantly, then use the code examples for native crypto.randomUUID(), the uuid npm package, and database integration. All generation is client-side.",
      content: [
        {
          heading: "How to generate UUIDs in Node.js",
          body: "Native (Node.js 19+): const id = crypto.randomUUID() — no package needed, cryptographically secure UUID v4. With the uuid package: npm install uuid; const { v4: uuidv4 } = require('uuid'); const id = uuidv4(). For older Node.js: require('crypto').randomBytes(16) and manually format as UUID. In browsers and Deno, crypto.randomUUID() is also available globally. The native method is fastest and has zero dependencies.",
        },
        {
          heading: "UUID patterns in Node.js applications",
          body: "Express route with UUID validation: app.get('/users/:id', (req, res) => { if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(req.params.id)) return res.status(400).json({ error: 'Invalid UUID' }); }). Prisma: model User { id String @id @default(uuid()) }. Sequelize: { id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 } }. For MongoDB, ObjectId is typically preferred over UUID, but UUID works with Binary type for cross-database compatibility.",
        },
        {
          heading: "UUID vs other ID formats in Node.js",
          body: "UUID v4 (36 chars): Universal standard, no coordination needed, but large for URLs and indexes. nanoid (npm install nanoid): Shorter IDs (21 chars default), URL-safe, cryptographically secure. CUID2 (npm install @paralleldrive/cuid2): Collision-resistant, sortable, secure. ULID: UUID-compatible but time-sortable, better for database indexes. For most Node.js APIs and databases, UUID v4 via crypto.randomUUID() is the safest default — universally understood and supported by every database.",
        },
      ],
      faqs: [
        {
          question: "Should I use crypto.randomUUID() or the uuid npm package?",
          answer:
            "Use crypto.randomUUID() if you're on Node.js 19+ or targeting modern browsers/Deno — it's native, fast, and zero dependencies. Use the uuid package if you need UUID v1, v3, or v5, or need to support older Node.js versions.",
        },
        {
          question: "How do I validate a UUID in Node.js?",
          answer:
            "Regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id). With the uuid package: const { validate } = require('uuid'); validate(id) returns true/false. For strict v4 validation, check that the 13th character is '4' and the 17th is '8', '9', 'a', or 'b'.",
        },
        {
          question: "Are UUIDs good for database primary keys in Node.js?",
          answer:
            "UUIDs work well but have trade-offs. Pros: globally unique, no coordination needed, safe to expose in APIs. Cons: larger than integers (16 bytes vs 4), random UUIDs fragment B-tree indexes. For PostgreSQL, use the native uuid type. Consider UUIDv7 or ULID for time-sortable IDs that reduce index fragmentation.",
        },
      ],
      keywords: [
        "nodejs uuid",
        "node uuid generate",
        "crypto randomuuid",
        "nodejs uuid v4",
        "node js generate uuid",
        "uuid npm",
        "express uuid",
        "node random uuid",
      ],
      parentToolSlug: "uuid-generator",
      parentToolName: "UUID Generator",
    },
  ],

  "url-encoder": [
    {
      slug: "python-url-encode",
      title: "Python URL Encode & Decode",
      metaTitle: "Python URL Encode & Decode — urllib.parse Online Tester",
      metaDescription:
        "URL encode and decode strings for Python. Test urllib.parse.quote() and unquote() output online with code examples for requests, query strings, and APIs.",
      h1: "Python URL Encoder & Decoder",
      intro:
        "Encode and decode URLs for your Python projects. Test URL encoding instantly, then use the Python code examples with urllib.parse for your application. All processing happens in your browser.",
      content: [
        {
          heading: "How to URL encode in Python",
          body: "Python's urllib.parse module: from urllib.parse import quote, quote_plus, urlencode. For path segments: quote('hello world') returns 'hello%20world'. For query parameters: quote_plus('hello world') returns 'hello+world' (spaces become +). For full query strings: urlencode({'key': 'value with spaces', 'q': 'a&b'}) returns 'key=value+with+spaces&q=a%26b'. The safe parameter controls which characters are NOT encoded: quote('/path/to/file', safe='/') preserves slashes.",
        },
        {
          heading: "URL encoding with the requests library",
          body: "Python's requests library handles URL encoding automatically: requests.get('https://api.example.com/search', params={'q': 'hello world', 'page': '1'}). This correctly encodes the URL as ...?q=hello+world&page=1. For manual URL construction: from urllib.parse import urljoin, urlparse; full_url = urljoin(base_url, path). Never concatenate URLs with string formatting — use params= in requests or urlencode() to prevent injection and encoding errors.",
        },
        {
          heading: "Common Python URL encoding pitfalls",
          body: "Pitfall 1: Double encoding — if a string is already encoded, encoding again turns %20 into %2520. Check first: unquote(s) == s means it's not encoded. Pitfall 2: quote() vs quote_plus() — use quote() for URL paths (spaces become %20), quote_plus() for query parameters (spaces become +). Pitfall 3: Unicode URLs — Python 3 handles Unicode natively, but some APIs expect punycode for international domain names: domain.encode('idna'). Use this tool to verify your encoded output matches what your API expects.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between quote() and quote_plus() in Python?",
          answer:
            "quote() encodes spaces as %20, which is correct for URL paths. quote_plus() encodes spaces as +, which is correct for query string parameters (application/x-www-form-urlencoded). Use quote() for URL paths and quote_plus() for form data and query parameters.",
        },
        {
          question: "How do I URL encode a dictionary in Python?",
          answer:
            "Use urllib.parse.urlencode(): from urllib.parse import urlencode; query = urlencode({'name': 'John Doe', 'city': 'New York'}). This returns 'name=John+Doe&city=New+York'. For nested data or lists, use urlencode(params, doseq=True).",
        },
        {
          question: "How do I decode a URL-encoded string in Python?",
          answer:
            "Use urllib.parse.unquote() for %20-style encoding: unquote('hello%20world') returns 'hello world'. Use unquote_plus() for +-style encoding: unquote_plus('hello+world') returns 'hello world'. For full query strings: parse_qs('a=1&b=2') returns {'a': ['1'], 'b': ['2']}.",
        },
      ],
      keywords: [
        "python url encode",
        "python url decode",
        "python urllib quote",
        "python urlencode",
        "python url encode string",
        "urllib parse quote",
        "python percent encode",
        "python requests url encode",
      ],
      parentToolSlug: "url-encoder",
      parentToolName: "URL Encoder & Decoder",
    },
    {
      slug: "javascript-url-encode",
      title: "JavaScript URL Encode & Decode",
      metaTitle:
        "JavaScript URL Encode & Decode — encodeURIComponent() Online",
      metaDescription:
        "URL encode and decode in JavaScript. Test encodeURIComponent() and decodeURIComponent() output online with code examples for fetch, query strings, and APIs.",
      h1: "JavaScript URL Encoder & Decoder",
      intro:
        "Encode and decode URLs for JavaScript. Test encoding instantly, then use the code examples for browser fetch(), Node.js, and URL construction. Everything runs in your browser.",
      content: [
        {
          heading: "How to URL encode in JavaScript",
          body: "JavaScript provides two encoding functions: encodeURIComponent('hello world') returns 'hello%20world' — encodes everything except A-Z, a-z, 0-9, -, _, ., ~. Use this for query parameter values. encodeURI('https://example.com/path with spaces') preserves the URL structure (://?#& are not encoded). For query strings: new URLSearchParams({ q: 'hello world', page: '1' }).toString() returns 'q=hello+world&page=1'. The URL class handles encoding automatically: new URL('https://example.com/search?q=' + encodeURIComponent(query)).",
        },
        {
          heading: "URL encoding with fetch() and Axios",
          body: "With fetch(): const params = new URLSearchParams({ q: query }); fetch(`/api/search?${params}`). With Axios: axios.get('/search', { params: { q: query } }) — encoding is automatic. For POST form data: fetch('/api', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ name: 'John', email: 'john@example.com' }) }). Never manually concatenate user input into URLs — always use URLSearchParams or encodeURIComponent to prevent injection.",
        },
        {
          heading: "Common JavaScript URL encoding mistakes",
          body: "Mistake 1: Using encodeURI() instead of encodeURIComponent() for query values — encodeURI() doesn't encode &, =, +, so 'a&b=c' would break query parsing. Mistake 2: Double encoding — encoding an already-encoded string turns %20 into %2520. Check with decodeURIComponent() first. Mistake 3: Not handling the + character — URLSearchParams encodes spaces as +, but some APIs expect %20. Force %20 with: new URLSearchParams(params).toString().replace(/\\+/g, '%20'). Mistake 4: Forgetting that encodeURIComponent() doesn't encode ' (single quote) — manually replace if needed for SQL or HTML contexts.",
        },
      ],
      faqs: [
        {
          question:
            "What is the difference between encodeURI() and encodeURIComponent()?",
          answer:
            "encodeURI() encodes a complete URL, preserving :, /, ?, #, &, =. encodeURIComponent() encodes individual values, including those characters. Rule: use encodeURIComponent() for query parameter values; use encodeURI() only for complete URLs where the structure should be preserved.",
        },
        {
          question: "How do I build a URL with query parameters in JavaScript?",
          answer:
            "Best approach: const url = new URL('https://api.example.com/search'); url.searchParams.set('q', 'hello world'); url.searchParams.set('page', '1'); fetch(url). The URL class handles all encoding automatically and is available in browsers and Node.js 10+.",
        },
        {
          question: "How do I decode a URL string in JavaScript?",
          answer:
            "Use decodeURIComponent('hello%20world') for individual values, or decodeURI() for complete URLs. For query strings: Object.fromEntries(new URLSearchParams('a=1&b=hello%20world')) returns { a: '1', b: 'hello world' }.",
        },
      ],
      keywords: [
        "javascript url encode",
        "javascript encodeURIComponent",
        "js url encode",
        "javascript url decode",
        "encodeURIComponent vs encodeURI",
        "javascript urlencode",
        "javascript url encode string",
        "fetch url encode",
      ],
      parentToolSlug: "url-encoder",
      parentToolName: "URL Encoder & Decoder",
    },
  ],

  "epoch-converter": [
    {
      slug: "python-epoch-timestamp",
      title: "Python Epoch & Timestamp Converter",
      metaTitle:
        "Python Epoch Converter — datetime.fromtimestamp() Online Tester",
      metaDescription:
        "Convert epoch timestamps in Python. Test datetime.fromtimestamp() and time.time() output online with code examples for timezone handling and date formatting.",
      h1: "Python Epoch & Timestamp Converter",
      intro:
        "Convert between epoch timestamps and human-readable dates for Python. Test conversions instantly, then use the code examples with datetime, time, and dateutil in your application. All conversions happen in your browser.",
      content: [
        {
          heading: "How to convert epoch timestamps in Python",
          body: "Get current epoch: import time; epoch = int(time.time()). Epoch to datetime: from datetime import datetime; dt = datetime.fromtimestamp(1616000000). Datetime to epoch: int(datetime(2024, 1, 15, 12, 0).timestamp()). For millisecond timestamps (JavaScript-style): datetime.fromtimestamp(1616000000000 / 1000). For UTC explicitly: datetime.utcfromtimestamp(epoch) or datetime.fromtimestamp(epoch, tz=timezone.utc). Always use timezone-aware datetimes in production to avoid bugs.",
        },
        {
          heading: "Timezone handling with Python timestamps",
          body: "Python's datetime is timezone-naive by default — a common source of bugs. Use timezone-aware datetimes: from datetime import timezone; dt = datetime.now(timezone.utc). With pytz: import pytz; eastern = pytz.timezone('US/Eastern'); dt = datetime.now(eastern). With zoneinfo (Python 3.9+): from zoneinfo import ZoneInfo; dt = datetime.now(ZoneInfo('America/New_York')). Convert between timezones: dt.astimezone(ZoneInfo('Europe/London')). Store timestamps as UTC epoch integers in databases, convert to local time only for display.",
        },
        {
          heading: "Date formatting and parsing in Python",
          body: "Format dates: dt.strftime('%Y-%m-%d %H:%M:%S') returns '2024-01-15 12:00:00'. Parse dates: datetime.strptime('2024-01-15', '%Y-%m-%d'). ISO 8601 format: dt.isoformat() returns '2024-01-15T12:00:00+00:00'. Parse ISO 8601: datetime.fromisoformat('2024-01-15T12:00:00+00:00'). For complex date parsing, use python-dateutil: from dateutil.parser import parse; dt = parse('January 15, 2024 12:00 PM EST'). Common strftime codes: %Y (4-digit year), %m (month), %d (day), %H (24h hour), %M (minute), %S (second), %z (timezone offset).",
        },
      ],
      faqs: [
        {
          question: "How do I get the current epoch timestamp in Python?",
          answer:
            "Use int(time.time()) for seconds since Unix epoch (January 1, 1970). For milliseconds: int(time.time() * 1000). For a timezone-aware datetime: datetime.now(timezone.utc).timestamp().",
        },
        {
          question:
            "What is the difference between fromtimestamp() and utcfromtimestamp()?",
          answer:
            "fromtimestamp(epoch) returns a naive datetime in your local timezone. utcfromtimestamp(epoch) returns a naive datetime in UTC. Both are naive (no timezone info). Best practice: datetime.fromtimestamp(epoch, tz=timezone.utc) which returns a timezone-aware UTC datetime.",
        },
        {
          question: "How do I handle millisecond timestamps in Python?",
          answer:
            "JavaScript and many APIs use millisecond epochs. Divide by 1000: datetime.fromtimestamp(ms_epoch / 1000). To generate millisecond epochs: int(time.time() * 1000). Be careful: if a timestamp has 13 digits, it is milliseconds; 10 digits means seconds.",
        },
      ],
      keywords: [
        "python epoch",
        "python timestamp",
        "python epoch to datetime",
        "python datetime to epoch",
        "python time.time",
        "python fromtimestamp",
        "python unix timestamp",
        "python datetime timestamp",
      ],
      parentToolSlug: "epoch-converter",
      parentToolName: "Epoch Converter",
    },
    {
      slug: "javascript-epoch-timestamp",
      title: "JavaScript Epoch & Timestamp Converter",
      metaTitle:
        "JavaScript Epoch Converter — Date.now() & new Date() Online",
      metaDescription:
        "Convert epoch timestamps in JavaScript. Test Date.now(), new Date(), and timestamp operations online with code examples for browser and Node.js.",
      h1: "JavaScript Epoch & Timestamp Converter",
      intro:
        "Convert between epoch timestamps and dates for JavaScript. Test conversions instantly, then use the code examples with Date, Intl, and date-fns in your application. All conversions are client-side.",
      content: [
        {
          heading: "How to work with epoch timestamps in JavaScript",
          body: "Get current epoch: Date.now() returns milliseconds. For seconds: Math.floor(Date.now() / 1000). Epoch to date: new Date(1616000000 * 1000) — JavaScript Date expects milliseconds. Date to epoch: Math.floor(new Date('2024-01-15').getTime() / 1000). Parse ISO string: new Date('2024-01-15T12:00:00Z').getTime() / 1000. Important: JavaScript timestamps are milliseconds (13 digits), while Unix timestamps are seconds (10 digits). Always check which format your API uses.",
        },
        {
          heading: "Date formatting in JavaScript",
          body: "Native formatting: date.toISOString() returns '2024-01-15T12:00:00.000Z'. Localized: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) returns 'January 15, 2024'. Intl.DateTimeFormat: new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long', timeZone: 'America/New_York' }).format(date). For complex formatting, use date-fns: format(date, 'yyyy-MM-dd HH:mm:ss'). Avoid Moment.js in new projects — it's in maintenance mode. Temporal API (Stage 3) will eventually replace Date.",
        },
        {
          heading: "Timezone handling in JavaScript",
          body: "JavaScript Date is always UTC internally, displayed in local timezone by default. Force UTC display: date.toISOString() or date.toUTCString(). Display in specific timezone: date.toLocaleString('en-US', { timeZone: 'Europe/London' }). Get timezone offset: date.getTimezoneOffset() returns minutes (e.g., -300 for EST). For robust timezone handling, use Intl.DateTimeFormat with timeZone option. In Node.js, process timezone: process.env.TZ = 'UTC'. Store timestamps as UTC epoch in databases, convert to local time for display only.",
        },
      ],
      faqs: [
        {
          question: "How do I get the current epoch timestamp in JavaScript?",
          answer:
            "Date.now() returns the current time in milliseconds since Unix epoch. For seconds: Math.floor(Date.now() / 1000). In older environments: new Date().getTime(). Both are equivalent.",
        },
        {
          question:
            "Why does JavaScript use milliseconds instead of seconds?",
          answer:
            "JavaScript's Date object was designed with millisecond precision for animation and timing purposes. Most other systems (Unix, Python, PHP) use seconds. Always divide by 1000 when converting JavaScript timestamps to Unix: Math.floor(Date.now() / 1000).",
        },
        {
          question: "How do I parse a date string to epoch in JavaScript?",
          answer:
            "new Date('2024-01-15T12:00:00Z').getTime() / 1000 returns the Unix epoch. For non-ISO formats, parsing is unreliable across browsers — use date-fns parse() or manually construct: new Date(year, month - 1, day).getTime() / 1000. Note: month is 0-indexed in JavaScript.",
        },
      ],
      keywords: [
        "javascript epoch",
        "javascript timestamp",
        "javascript date to epoch",
        "javascript epoch to date",
        "Date.now javascript",
        "javascript unix timestamp",
        "js timestamp",
        "javascript date timestamp",
      ],
      parentToolSlug: "epoch-converter",
      parentToolName: "Epoch Converter",
    },
  ],

  "regex-tester": [
    {
      slug: "python-regex",
      title: "Python Regex Tester",
      metaTitle:
        "Python Regex Tester — re Module Pattern Testing Online",
      metaDescription:
        "Test regular expressions for Python's re module. Verify re.match(), re.search(), and re.findall() patterns online with code examples and flag reference.",
      h1: "Python Regex Tester & Reference",
      intro:
        "Test regular expressions for Python's re module. Paste your pattern and test string to see matches instantly, then copy the Python code examples into your project. All testing happens in your browser using JavaScript regex (syntax is nearly identical to Python).",
      content: [
        {
          heading: "How to use regex in Python",
          body: "Python's re module: import re. Key functions: re.search(pattern, string) returns the first match or None. re.match(pattern, string) matches only at the start. re.findall(pattern, string) returns all matches as a list. re.sub(pattern, replacement, string) replaces matches. re.compile(pattern) creates a reusable pattern object. Always use raw strings for patterns: re.search(r'\\d+', text) — the r prefix prevents Python from interpreting backslashes before the regex engine sees them.",
        },
        {
          heading: "Python regex vs JavaScript regex differences",
          body: "Most patterns work identically in Python and JavaScript. Key differences: Python supports named groups with (?P<name>...) while JavaScript uses (?<name>...) — both syntaxes work in Python 3.6+. Python has re.VERBOSE (x flag) for commented patterns. Python supports lookbehind assertions of variable length; JavaScript requires fixed-length. Python's re.split() keeps captured groups in the result; JavaScript's String.split() does the same. The \\b, \\d, \\w, \\s character classes work the same in both. Test your pattern here — if it works in this tester, it will work in Python with minimal changes.",
        },
        {
          heading: "Common Python regex patterns",
          body: "Email: r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'. URL: r'https?://[^\\s]+'. IP address: r'\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b'. Phone: r'\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}'. Date (YYYY-MM-DD): r'\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])'. Python variable: r'[a-zA-Z_][a-zA-Z0-9_]*'. For production email validation, use a library — regex alone cannot fully validate RFC 5322 email addresses.",
        },
      ],
      faqs: [
        {
          question: "What is the difference between re.match() and re.search()?",
          answer:
            "re.match() only checks for a match at the beginning of the string. re.search() scans the entire string for the first match. Use re.search() unless you specifically need to match from the start. For full-string matching, use re.fullmatch() or anchor your pattern with ^ and $.",
        },
        {
          question: "Why should I use raw strings (r'') for Python regex?",
          answer:
            "Raw strings prevent Python from interpreting backslashes. Without r'', you'd need to double-escape: '\\\\d+' instead of r'\\d+'. Since regex patterns use many backslashes, raw strings make them much more readable and less error-prone.",
        },
        {
          question: "How do I use regex flags in Python?",
          answer:
            "Pass flags to re functions: re.search(pattern, text, re.IGNORECASE | re.MULTILINE). Common flags: re.IGNORECASE (re.I) for case-insensitive matching, re.MULTILINE (re.M) makes ^ and $ match line boundaries, re.DOTALL (re.S) makes . match newlines, re.VERBOSE (re.X) allows comments and whitespace in patterns.",
        },
      ],
      keywords: [
        "python regex",
        "python re module",
        "python regex tester",
        "python regular expression",
        "python re.search",
        "python re.match",
        "python re.findall",
        "python regex examples",
      ],
      parentToolSlug: "regex-tester",
      parentToolName: "Regex Tester",
    },
  ],

  "csv-json": [
    {
      slug: "python-csv-to-json",
      title: "Python CSV to JSON Converter",
      metaTitle:
        "Python CSV to JSON — csv & json Module Online Converter",
      metaDescription:
        "Convert CSV to JSON for Python. Test conversions online, see code examples with csv.DictReader and pandas, and convert CSV data instantly in your browser.",
      h1: "Python CSV to JSON Converter",
      intro:
        "Convert CSV data to JSON for your Python projects. Paste CSV below to convert it instantly, then use the Python code examples with csv.DictReader or pandas in your application. All conversion is client-side.",
      content: [
        {
          heading: "How to convert CSV to JSON in Python",
          body: "Using the csv module: import csv, json; with open('data.csv') as f: reader = csv.DictReader(f); rows = list(reader); with open('data.json', 'w') as f: json.dump(rows, f, indent=2). DictReader automatically uses the first row as keys. For custom delimiters: csv.DictReader(f, delimiter=';'). One-liner with pandas: import pandas as pd; pd.read_csv('data.csv').to_json('data.json', orient='records', indent=2). The orient='records' option produces a JSON array of objects — the most common format for APIs.",
        },
        {
          heading: "Handling CSV encoding and edge cases in Python",
          body: "Encoding: open('data.csv', encoding='utf-8-sig') handles BOM-prefixed Excel CSVs. For unknown encoding: import chardet; encoding = chardet.detect(open('data.csv', 'rb').read())['encoding']. Missing values: csv.DictReader returns empty strings; pandas returns NaN. Handle nulls: json.dumps(data, default=str) converts non-serializable values to strings. Large files: use chunked reading: for chunk in pd.read_csv('large.csv', chunksize=10000): process(chunk). Type inference: pandas auto-detects integers, floats, and dates; csv module returns everything as strings.",
        },
        {
          heading: "JSON to CSV conversion in Python",
          body: "Reverse conversion with pandas: pd.read_json('data.json').to_csv('output.csv', index=False). With csv module: import csv, json; data = json.load(open('data.json')); writer = csv.DictWriter(open('output.csv', 'w', newline=''), fieldnames=data[0].keys()); writer.writeheader(); writer.writerows(data). For nested JSON, flatten first: pd.json_normalize(data) handles nested objects by creating dot-separated column names (e.g., 'address.city').",
        },
      ],
      faqs: [
        {
          question: "How do I convert CSV to JSON in Python without pandas?",
          answer:
            "Use csv.DictReader: import csv, json; data = list(csv.DictReader(open('file.csv'))); json.dump(data, open('output.json', 'w'), indent=2). DictReader uses headers as keys and returns an ordered dict for each row. No external dependencies needed.",
        },
        {
          question: "How do I handle large CSV files in Python?",
          answer:
            "Process in chunks: for chunk in pd.read_csv('large.csv', chunksize=10000): result = chunk.to_dict('records'); process_batch(result). With csv module, iteration is already lazy: for row in csv.DictReader(f) reads one row at a time. Avoid list(reader) on large files as it loads everything into memory.",
        },
        {
          question: "How do I convert nested JSON to CSV in Python?",
          answer:
            "Use pandas json_normalize: pd.json_normalize(data, sep='_').to_csv('output.csv'). This flattens nested objects into dot-separated columns (e.g., 'address.city' becomes 'address_city'). For deeply nested structures, specify the record_path and meta parameters.",
        },
      ],
      keywords: [
        "python csv to json",
        "python csv json",
        "python convert csv to json",
        "python csv dictreader",
        "pandas csv to json",
        "python json to csv",
        "python csv to json example",
        "csv to json python script",
      ],
      parentToolSlug: "csv-json",
      parentToolName: "CSV ↔ JSON Converter",
    },
  ],

  "case-converter": [
    {
      slug: "python-case-convert",
      title: "Python Case Converter",
      metaTitle:
        "Python Case Converter — snake_case, camelCase, PascalCase Online",
      metaDescription:
        "Convert text between cases for Python. Test snake_case, camelCase, and PascalCase conversions online with Python code examples for string formatting.",
      h1: "Python Case Converter",
      intro:
        "Convert text between naming conventions for Python projects. Transform between snake_case, camelCase, PascalCase, and more, then use the Python code examples for programmatic conversion. All processing is client-side.",
      content: [
        {
          heading: "Python naming conventions (PEP 8)",
          body: "PEP 8 defines Python's naming conventions: variables and functions use snake_case (my_variable, calculate_total). Classes use PascalCase (MyClass, HttpResponse). Constants use UPPER_SNAKE_CASE (MAX_RETRIES, API_BASE_URL). Module names use lowercase (my_module.py). Private attributes use leading underscore (_internal_value). Name-mangled attributes use double underscore (__private). When working with APIs that use camelCase (JavaScript conventions), you need to convert between cases at the API boundary.",
        },
        {
          heading: "How to convert between cases in Python",
          body: "Snake to camel: def to_camel(s): parts = s.split('_'); return parts[0] + ''.join(p.capitalize() for p in parts[1:]). Snake to Pascal: def to_pascal(s): return ''.join(p.capitalize() for p in s.split('_')). Camel/Pascal to snake: import re; def to_snake(s): return re.sub(r'(?<=[a-z0-9])(?=[A-Z])', '_', s).lower(). For production code, use the inflection library: pip install inflection; inflection.underscore('CamelCase') returns 'camel_case'; inflection.camelize('snake_case') returns 'SnakeCase'.",
        },
        {
          heading: "Converting API responses between Python and JavaScript conventions",
          body: "When Python APIs interact with JavaScript frontends, you often need to convert dict keys between snake_case and camelCase. Recursive converter: def keys_to_camel(d): if isinstance(d, dict): return {to_camel(k): keys_to_camel(v) for k, v in d.items()}; if isinstance(d, list): return [keys_to_camel(i) for i in d]; return d. Libraries: pydantic's model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True) handles this automatically. FastAPI + Pydantic make case conversion seamless between Python backend and React frontend.",
        },
      ],
      faqs: [
        {
          question: "What naming convention should I use in Python?",
          answer:
            "Follow PEP 8: snake_case for variables, functions, and methods; PascalCase for class names; UPPER_SNAKE_CASE for constants. Module and package names use lowercase. These conventions are enforced by linters like flake8, pylint, and ruff.",
        },
        {
          question: "How do I convert camelCase to snake_case in Python?",
          answer:
            "Use regex: import re; re.sub(r'(?<=[a-z0-9])(?=[A-Z])', '_', 'camelCase').lower() returns 'camel_case'. For production use, the inflection library handles edge cases: inflection.underscore('HTMLParser') returns 'html_parser'.",
        },
        {
          question: "How do I convert dict keys from camelCase to snake_case in Python?",
          answer:
            "Recursively convert keys: def to_snake_keys(d): return {to_snake(k): to_snake_keys(v) if isinstance(v, (dict, list)) else v for k, v in d.items()} for dicts, or use humps library: pip install pyhumps; humps.decamelize(data) converts all keys recursively.",
        },
      ],
      keywords: [
        "python case converter",
        "python snake_case",
        "python camelCase",
        "python naming convention",
        "python pep 8 naming",
        "python convert case",
        "python string case",
        "camelcase to snake_case python",
      ],
      parentToolSlug: "case-converter",
      parentToolName: "Case Converter",
    },
  ],

  "http-request-builder": [
    {
      slug: "curl-generator",
      title: "cURL Command Generator",
      metaTitle: "cURL Command Generator Online — Build cURL Visually",
      metaDescription:
        "Generate cURL commands visually with a form-based builder. Set method, headers, auth, and body without memorizing flags. Free online cURL generator.",
      h1: "cURL Command Generator Online",
      intro:
        "Build cURL commands without memorizing flags. Use the visual form above to set method, URL, headers, authentication, and request body — the tool generates a ready-to-paste cURL command instantly.",
      content: [
        {
          heading: "Why generate cURL commands visually?",
          body: "cURL has over 200 command-line flags, and constructing complex requests with multiple headers, authentication, and JSON bodies is error-prone. A visual builder eliminates quoting issues, flag typos, and ensures proper escaping. The generated command is ready to paste into a terminal, CI/CD pipeline, or API documentation.",
          codeExample: '# Simple GET request\ncurl -X GET "https://api.example.com/users"\n\n# POST with JSON body and auth\ncurl -X POST "https://api.example.com/users" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer eyJ..." \\\n  -d \'{"name": "John", "email": "john@example.com"}\'',
        },
        {
          heading: "Common cURL flags",
          body: "-X sets the HTTP method, -H adds a header, -d sends a request body, -u provides basic auth credentials, -o saves output to a file, -L follows redirects, and -k skips SSL verification. The visual builder handles all of these through form fields, so you do not need to remember the flags.",
        },
      ],
      faqs: [
        {
          question: "How do I send a POST request with cURL?",
          answer:
            "Use -X POST with -d for the body and -H for the Content-Type header. For JSON: curl -X POST -H \"Content-Type: application/json\" -d '{\"key\":\"value\"}' URL. The visual builder above generates this automatically.",
        },
        {
          question: "How do I add authentication to a cURL command?",
          answer:
            "For Bearer token: -H \"Authorization: Bearer TOKEN\". For Basic auth: -u username:password. For API key: -H \"X-API-Key: KEY\". The visual builder supports all three auth types.",
        },
      ],
      keywords: [
        "curl generator",
        "curl command builder",
        "generate curl command",
        "curl builder online",
        "build curl request",
        "curl command generator",
      ],
      parentToolSlug: "http-request-builder",
      parentToolName: "HTTP Request Builder",
    },
    {
      slug: "fetch-api-generator",
      title: "JavaScript Fetch API Generator",
      metaTitle: "JavaScript Fetch API Generator — Build fetch() Visually",
      metaDescription:
        "Generate JavaScript fetch() calls visually. Set method, headers, body, and auth with a form — get ready-to-use fetch code. Free online tool.",
      h1: "JavaScript Fetch API Code Generator",
      intro:
        "Generate JavaScript fetch() calls without writing boilerplate. Configure your request visually and get clean, copy-paste-ready fetch code with proper headers, body serialization, and error handling.",
      content: [
        {
          heading: "The Fetch API basics",
          body: "The Fetch API is the modern standard for making HTTP requests in JavaScript, replacing XMLHttpRequest. It returns Promises and integrates with async/await. A basic fetch call takes a URL and an options object with method, headers, and body. The visual builder above generates properly structured fetch() calls with JSON.stringify for body, correct Content-Type headers, and response parsing.",
          codeExample: '// GET request with fetch\nconst response = await fetch("https://api.example.com/users", {\n  method: "GET",\n  headers: {\n    "Accept": "application/json",\n    "Authorization": "Bearer eyJ..."\n  }\n});\n\nconst data = await response.json();\nconsole.log(data);',
        },
        {
          heading: "POST with JSON body",
          body: "To send JSON with fetch, set the Content-Type header to application/json and pass JSON.stringify(data) as the body. The visual builder handles this automatically when you select JSON body type. Remember that fetch does not reject on HTTP error status codes (4xx, 5xx) — you need to check response.ok or response.status manually.",
          codeExample: '// POST with JSON body\nconst response = await fetch("https://api.example.com/users", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({\n    name: "John Doe",\n    email: "john@example.com"\n  })\n});\n\nconst data = await response.json();',
        },
      ],
      faqs: [
        {
          question: "What is the difference between fetch and axios?",
          answer:
            "fetch() is built into browsers and Node.js 18+ — no dependencies needed. axios is a third-party library that adds automatic JSON parsing, request interceptors, timeout support, and progress events. For simple requests, fetch is sufficient. For complex apps with retry logic and interceptors, axios adds value.",
        },
        {
          question: "Does fetch work in Node.js?",
          answer:
            "Yes, since Node.js 18. The global fetch() is available without imports. For older Node.js versions, use the node-fetch package or the built-in http/https modules.",
        },
      ],
      keywords: [
        "fetch api generator",
        "javascript fetch builder",
        "generate fetch request",
        "fetch api example",
        "fetch post json",
        "javascript http request",
      ],
      parentToolSlug: "http-request-builder",
      parentToolName: "HTTP Request Builder",
    },
    {
      slug: "python-requests-generator",
      title: "Python Requests Code Generator",
      metaTitle: "Python Requests Generator — Build HTTP Requests for Python",
      metaDescription:
        "Generate Python requests code visually. Set method, headers, auth, and JSON body with a form — get ready-to-use Python code. Free online tool.",
      h1: "Python Requests Code Generator",
      intro:
        "Generate Python requests library code without writing boilerplate. Configure your HTTP request visually and get clean, copy-paste-ready Python code with proper auth, headers, and JSON handling.",
      content: [
        {
          heading: "Python requests library basics",
          body: "The requests library is the most popular HTTP client for Python with over 300 million monthly downloads. It provides a simple API: requests.get(), requests.post(), requests.put(), etc. The visual builder generates idiomatic Python code using the correct convenience method and kwargs for headers, auth, json, and data parameters.",
          codeExample: 'import requests\n\n# GET with Bearer token\nresponse = requests.get(\n    "https://api.example.com/users",\n    headers={"Authorization": "Bearer eyJ..."},\n)\n\nprint(response.status_code)\nprint(response.json())',
        },
        {
          heading: "POST with JSON in Python",
          body: "Use the json= parameter instead of data= to send JSON. The requests library automatically serializes the dict to JSON and sets the Content-Type header. For form data, use data= with a dict. The visual builder generates the correct parameter based on your body type selection.",
          codeExample: 'import requests\n\n# POST with JSON — use json= not data=\nresponse = requests.post(\n    "https://api.example.com/users",\n    json={"name": "John", "email": "john@example.com"},\n    auth=("admin", "secret"),  # Basic Auth\n)\n\nprint(response.json())',
        },
      ],
      faqs: [
        {
          question: "Should I use json= or data= in Python requests?",
          answer:
            "Use json= for JSON payloads — it auto-serializes and sets Content-Type. Use data= for form-encoded or raw string bodies. Using data= with a dict sends form-encoded data, not JSON.",
        },
        {
          question: "How do I add authentication in Python requests?",
          answer:
            "For Basic Auth: auth=(\"user\", \"pass\"). For Bearer tokens: headers={\"Authorization\": \"Bearer TOKEN\"}. For API keys: headers={\"X-API-Key\": \"KEY\"}. The requests library also supports digest and custom auth handlers.",
        },
      ],
      keywords: [
        "python requests generator",
        "python http request builder",
        "generate python requests code",
        "python requests example",
        "python post json",
        "python api request",
      ],
      parentToolSlug: "http-request-builder",
      parentToolName: "HTTP Request Builder",
    },
  ],
};
