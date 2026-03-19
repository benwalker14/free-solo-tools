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

  "tailwind-to-css": [
    {
      slug: "tailwind-spacing-to-css",
      title: "Tailwind Spacing to CSS Guide",
      metaTitle: "Tailwind Spacing to CSS — Complete Padding, Margin & Gap Reference",
      metaDescription:
        "Convert Tailwind spacing utilities (p-4, mx-auto, gap-6) to CSS. Full reference for padding, margin, gap, width, and height classes with pixel/rem values.",
      h1: "Tailwind Spacing Classes to CSS Reference",
      intro:
        "Tailwind's spacing scale uses a consistent numbering system where each unit equals 0.25rem (4px). This guide maps every spacing utility — padding, margin, gap, width, and height — to its CSS equivalent.",
      content: [
        {
          heading: "Understanding the Spacing Scale",
          body: "Tailwind uses a numeric scale where 1 = 0.25rem (4px), 2 = 0.5rem (8px), 4 = 1rem (16px), and so on. The scale covers values from 0 to 96 (24rem). Special values include 'px' (1px), 'auto', 'full' (100%), 'screen' (100vw/vh), and fractional values like '1/2' (50%).",
          codeExample: `/* p-4 */\npadding: 1rem; /* 16px */\n\n/* mx-auto */\nmargin-left: auto;\nmargin-right: auto;\n\n/* gap-6 */\ngap: 1.5rem; /* 24px */\n\n/* w-1/2 */\nwidth: 50%;\n\n/* h-screen */\nheight: 100vh;`,
          codeLanguage: "css",
        },
        {
          heading: "Directional Spacing",
          body: "Tailwind provides axis-specific shortcuts: px/py for horizontal/vertical padding, mx/my for margins, and individual sides (pt, pr, pb, pl, mt, mr, mb, ml). The space-x and space-y utilities add margin between child elements using the > * + * selector.",
          codeExample: `/* px-4 py-2 */\npadding-left: 1rem;\npadding-right: 1rem;\npadding-top: 0.5rem;\npadding-bottom: 0.5rem;\n\n/* space-y-4 → applies to > * + * */\nmargin-top: 1rem;`,
          codeLanguage: "css",
        },
        {
          heading: "Arbitrary Spacing Values",
          body: "When the default scale doesn't fit, use bracket notation: p-[13px], m-[2.5rem], gap-[clamp(1rem,3vw,2rem)]. The converter handles arbitrary values and outputs them as-is in the CSS.",
        },
      ],
      faqs: [
        {
          question: "What does p-4 equal in CSS?",
          answer: "p-4 equals padding: 1rem (16px). Each unit in Tailwind's spacing scale is 0.25rem, so 4 × 0.25rem = 1rem.",
        },
        {
          question: "How do I center an element with Tailwind?",
          answer: "Use mx-auto for horizontal centering (margin-left: auto; margin-right: auto;). For flexbox centering, combine flex items-center justify-center.",
        },
      ],
      keywords: [
        "tailwind spacing to css",
        "tailwind p-4 css",
        "tailwind margin to css",
        "tailwind padding css equivalent",
        "tailwind gap to css",
        "tailwind spacing scale",
      ],
      parentToolSlug: "tailwind-to-css",
      parentToolName: "Tailwind to CSS Converter",
    },
    {
      slug: "tailwind-flexbox-to-css",
      title: "Tailwind Flexbox to CSS Guide",
      metaTitle: "Tailwind Flexbox to CSS — Flex, Justify, Align Class Reference",
      metaDescription:
        "Convert Tailwind flexbox utilities to CSS. Complete reference for flex, flex-col, items-center, justify-between, gap, grow, shrink, and order classes.",
      h1: "Tailwind Flexbox Classes to CSS Reference",
      intro:
        "Tailwind's flexbox utilities let you build layouts with classes like flex, flex-col, items-center, and justify-between. This guide shows the CSS each class generates.",
      content: [
        {
          heading: "Flex Container Properties",
          body: "The flex class sets display: flex, while inline-flex sets display: inline-flex. Direction is controlled by flex-row (default) and flex-col. Wrapping uses flex-wrap, flex-nowrap, and flex-wrap-reverse.",
          codeExample: `/* flex flex-col flex-wrap */\ndisplay: flex;\nflex-direction: column;\nflex-wrap: wrap;\n\n/* inline-flex flex-row-reverse */\ndisplay: inline-flex;\nflex-direction: row-reverse;`,
          codeLanguage: "css",
        },
        {
          heading: "Alignment and Justification",
          body: "justify-* controls the main axis (justify-content), items-* controls the cross axis (align-items), and self-* overrides alignment for individual items (align-self). content-* controls multi-line alignment (align-content).",
          codeExample: `/* items-center justify-between */\nalign-items: center;\njustify-content: space-between;\n\n/* self-end */\nalign-self: flex-end;`,
          codeLanguage: "css",
        },
        {
          heading: "Flex Item Properties",
          body: "flex-1 (flex: 1 1 0%), flex-auto (flex: 1 1 auto), flex-initial (flex: 0 1 auto), and flex-none (flex: none) control how items grow and shrink. grow/grow-0 and shrink/shrink-0 provide fine control.",
          codeExample: `/* flex-1 */\nflex: 1 1 0%;\n\n/* grow-0 shrink */\nflex-grow: 0;\nflex-shrink: 1;`,
          codeLanguage: "css",
        },
      ],
      faqs: [
        {
          question: "What CSS does 'flex items-center justify-center' produce?",
          answer: "It produces: display: flex; align-items: center; justify-content: center; — the classic centering pattern.",
        },
        {
          question: "What is the difference between flex-1 and flex-auto?",
          answer: "flex-1 sets flex: 1 1 0% (items share space equally regardless of content size), while flex-auto sets flex: 1 1 auto (items grow but respect their content size as a starting point).",
        },
      ],
      keywords: [
        "tailwind flex to css",
        "tailwind items-center css",
        "tailwind justify-between css",
        "tailwind flexbox css equivalent",
        "flex-col css",
        "tailwind flex classes",
      ],
      parentToolSlug: "tailwind-to-css",
      parentToolName: "Tailwind to CSS Converter",
    },
    {
      slug: "tailwind-typography-to-css",
      title: "Tailwind Typography to CSS Guide",
      metaTitle: "Tailwind Typography to CSS — Font Size, Weight & Text Classes",
      metaDescription:
        "Convert Tailwind typography utilities to CSS. Reference for text-lg, font-bold, leading-tight, tracking-wide, uppercase, truncate, and more.",
      h1: "Tailwind Typography Classes to CSS Reference",
      intro:
        "Tailwind's typography utilities control font size, weight, family, line height, letter spacing, text alignment, decoration, and more. This guide maps each class to its CSS output.",
      content: [
        {
          heading: "Font Size and Line Height",
          body: "Tailwind's text-* classes set both font-size and a default line-height. For example, text-sm sets font-size: 0.875rem with line-height: 1.25rem. Override the line height with leading-* classes.",
          codeExample: `/* text-xl */\nfont-size: 1.25rem;\nline-height: 1.75rem;\n\n/* text-4xl leading-tight */\nfont-size: 2.25rem;\nline-height: 2.5rem;\nline-height: 1.25; /* leading-tight overrides */`,
          codeLanguage: "css",
        },
        {
          heading: "Font Weight and Style",
          body: "font-thin (100) through font-black (900) map to numeric font-weight values. font-normal is 400, font-semibold is 600, font-bold is 700. italic sets font-style: italic.",
          codeExample: `/* font-bold italic */\nfont-weight: 700;\nfont-style: italic;\n\n/* font-semibold */\nfont-weight: 600;`,
          codeLanguage: "css",
        },
        {
          heading: "Text Transform, Decoration, and Overflow",
          body: "uppercase, lowercase, and capitalize map directly. underline, line-through, and no-underline control text-decoration-line. truncate is a shorthand that sets overflow: hidden, text-overflow: ellipsis, and white-space: nowrap.",
          codeExample: `/* uppercase underline */\ntext-transform: uppercase;\ntext-decoration-line: underline;\n\n/* truncate */\noverflow: hidden;\ntext-overflow: ellipsis;\nwhite-space: nowrap;`,
          codeLanguage: "css",
        },
      ],
      faqs: [
        {
          question: "What CSS does text-lg produce?",
          answer: "text-lg sets font-size: 1.125rem (18px) and line-height: 1.75rem (28px).",
        },
        {
          question: "How do I set a custom font size in Tailwind?",
          answer: "Use arbitrary values with bracket notation: text-[22px] or text-[1.375rem]. The converter outputs these as font-size with the exact value specified.",
        },
      ],
      keywords: [
        "tailwind font size to css",
        "tailwind text-lg css",
        "tailwind font-bold css",
        "tailwind typography css",
        "tailwind truncate css",
        "tailwind text classes reference",
      ],
      parentToolSlug: "tailwind-to-css",
      parentToolName: "Tailwind to CSS Converter",
    },
  ],

  "github-actions-validator": [
    {
      slug: "workflow-syntax-guide",
      title: "GitHub Actions Workflow Syntax Guide",
      metaTitle: "GitHub Actions Workflow Syntax Guide — YAML Reference & Validator",
      metaDescription:
        "Complete GitHub Actions workflow YAML syntax reference. Validate triggers, jobs, steps, expressions, and permissions. Free online validator.",
      h1: "GitHub Actions Workflow Syntax Guide",
      intro:
        "Learn the complete syntax for GitHub Actions workflow YAML files. Use the validator above to check your workflows for errors, then reference this guide to fix them. All processing runs in your browser.",
      content: [
        {
          heading: "Workflow file structure",
          body: "Every GitHub Actions workflow requires a YAML file in .github/workflows/ with at minimum two fields: 'on' (trigger events) and 'jobs' (the work to execute). Optional top-level fields include 'name' (display name in the UI), 'permissions' (GITHUB_TOKEN scopes), 'env' (global environment variables), 'concurrency' (prevents duplicate runs), and 'defaults' (shared step settings like shell and working-directory).",
          codeExample: "name: CI\n\non:\n  push:\n    branches: [main]\n  pull_request:\n\npermissions:\n  contents: read\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm test",
        },
        {
          heading: "Trigger events and filters",
          body: "The 'on' field accepts a single event string, an array, or a mapping with filters. Common triggers: push and pull_request with branch/path filters, schedule with cron syntax, workflow_dispatch for manual triggers with inputs, and workflow_call for reusable workflows. Filter examples: branches, branches-ignore, paths, paths-ignore, tags, and types (opened, synchronize, closed for pull_request).",
          codeExample: "on:\n  push:\n    branches: [main, 'release/**']\n    paths:\n      - 'src/**'\n      - '!src/**/*.test.ts'\n  pull_request:\n    types: [opened, synchronize]\n  schedule:\n    - cron: '0 9 * * 1'  # Every Monday at 9 AM\n  workflow_dispatch:\n    inputs:\n      environment:\n        type: choice\n        options: [staging, production]",
        },
        {
          heading: "Jobs and steps",
          body: "Each job runs on a fresh runner VM specified by runs-on. Jobs run in parallel by default — use 'needs' to create dependencies. Each job contains steps that run sequentially. Steps use either 'uses' (to call an action) or 'run' (to execute shell commands). Steps can have 'id' for referencing outputs, 'if' for conditional execution, 'with' for action inputs, and 'env' for environment variables.",
          codeExample: "jobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        node: [18, 20, 22]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: ${{ matrix.node }}\n      - run: npm ci\n      - run: npm test\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    steps:\n      - run: echo 'Deploying...'",
        },
      ],
      faqs: [
        {
          question: "What is the minimum required structure for a GitHub Actions workflow?",
          answer:
            "A valid workflow needs 'on' (at least one trigger event) and 'jobs' (at least one job with runs-on and steps). The 'name' field is optional but recommended. Each step needs either 'uses' or 'run'.",
        },
        {
          question: "How do I run jobs in sequence instead of parallel?",
          answer:
            "Add 'needs: job-id' to dependent jobs. For example, 'deploy' with 'needs: [build, test]' waits for both to complete. Without 'needs', all jobs start simultaneously.",
        },
        {
          question: "What runners are available for GitHub Actions?",
          answer:
            "GitHub-hosted runners include ubuntu-latest, ubuntu-24.04, ubuntu-22.04, windows-latest, windows-2022, macos-latest, macos-15, macos-14, and macos-13. You can also use self-hosted runners for custom environments.",
        },
      ],
      keywords: [
        "github actions workflow syntax",
        "github actions yaml reference",
        "github actions workflow structure",
        "github actions on trigger",
        "github actions jobs steps",
        "github actions yaml guide",
      ],
      parentToolSlug: "github-actions-validator",
      parentToolName: "GitHub Actions Validator",
    },
    {
      slug: "deprecated-actions-checker",
      title: "GitHub Actions Deprecated Actions Checker",
      metaTitle: "Deprecated GitHub Actions Checker — Find Outdated Action Versions",
      metaDescription:
        "Check your GitHub Actions workflow for deprecated and outdated action versions. Get upgrade recommendations for checkout, setup-node, upload-artifact, and more.",
      h1: "Deprecated GitHub Actions Checker",
      intro:
        "Check your workflow for outdated action versions. The validator above flags deprecated actions and suggests the latest stable versions. Pin to current versions for security and reliability.",
      content: [
        {
          heading: "Why pinning action versions matters",
          body: "Unpinned or outdated action versions create security and reliability risks. Action maintainers can push breaking changes to mutable tags. Older versions may have known vulnerabilities or miss performance improvements. GitHub recommends pinning to a specific major version tag (v4) or full commit SHA for maximum security. DevBolt's validator checks against a database of known deprecated versions and suggests current alternatives.",
          codeExample: "# Bad — unpinned or outdated\n- uses: actions/checkout@v2     # Outdated\n- uses: actions/checkout@main   # Mutable, can break\n- uses: actions/checkout@latest  # Not recommended\n\n# Good — pinned to current major\n- uses: actions/checkout@v4\n- uses: actions/setup-node@v4\n- uses: actions/upload-artifact@v4\n\n# Best — pinned to commit SHA\n- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11",
        },
        {
          heading: "Common outdated actions and their replacements",
          body: "actions/checkout: v1/v2/v3 → v4 (faster sparse checkout, improved performance). actions/setup-node: v1/v2/v3 → v4 (corepack support, better caching). actions/upload-artifact and download-artifact: v1/v2/v3 → v4 (major rewrite with faster transfers and compression). actions/cache: v1/v2/v3 → v4 (improved restore and save speeds). actions/setup-python: v1-v4 → v5. actions/setup-go: v1-v4 → v5. actions/setup-java: v1-v3 → v4.",
        },
      ],
      faqs: [
        {
          question: "What happens if I use an outdated action version?",
          answer:
            "Outdated versions may have security vulnerabilities, miss bug fixes, and lack new features. GitHub will eventually deprecate Node 16-based actions (v3 and earlier for many). Your workflows will continue to run but may show deprecation warnings and eventually fail.",
        },
        {
          question: "Should I pin to a commit SHA or a version tag?",
          answer:
            "For maximum security, pin to a full commit SHA (40 characters). Tags are mutable — a compromised maintainer could change what v4 points to. SHA pinning is recommended by GitHub's security hardening guide. Use Dependabot or Renovate to keep SHA pins updated.",
        },
      ],
      keywords: [
        "deprecated github actions",
        "outdated github actions",
        "github actions version checker",
        "github actions upgrade",
        "actions checkout latest version",
        "github actions security pinning",
      ],
      parentToolSlug: "github-actions-validator",
      parentToolName: "GitHub Actions Validator",
    },
    {
      slug: "workflow-permissions-guide",
      title: "GitHub Actions Permissions Guide",
      metaTitle: "GitHub Actions Permissions Guide — GITHUB_TOKEN Scopes Explained",
      metaDescription:
        "Understand GitHub Actions permissions and GITHUB_TOKEN scopes. Configure least-privilege access for workflows with read, write, and none values.",
      h1: "GitHub Actions Permissions Guide",
      intro:
        "Configure GITHUB_TOKEN permissions for your GitHub Actions workflows. Use least-privilege access to minimize security risk. The validator above checks your permission configuration for errors.",
      content: [
        {
          heading: "Understanding GITHUB_TOKEN permissions",
          body: "Every workflow run gets an automatic GITHUB_TOKEN with configurable permissions. Since 2023, new repositories default to read-only permissions. You can set permissions at the workflow level (applies to all jobs) or per-job for fine-grained control. Available scopes include contents, issues, pull-requests, packages, deployments, actions, checks, id-token, pages, and more. Each scope accepts read, write, or none.",
          codeExample: "# Workflow-level — applies to all jobs\npermissions:\n  contents: read\n  pull-requests: write\n\njobs:\n  deploy:\n    # Job-level — overrides workflow permissions\n    permissions:\n      contents: write\n      packages: write\n      id-token: write  # For OIDC\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4",
        },
        {
          heading: "Least-privilege best practices",
          body: "Always specify permissions explicitly rather than relying on defaults. Start with the minimum: contents: read for most CI jobs. Add write permissions only where needed: pull-requests: write for PR comments, packages: write for publishing, pages: write for deploying to GitHub Pages, and id-token: write for OIDC authentication. Avoid permissions: write-all which grants full access to all scopes.",
        },
      ],
      faqs: [
        {
          question: "What are the default GITHUB_TOKEN permissions?",
          answer:
            "For repositories created after February 2023, the default is read-only for contents and metadata. Older repositories may default to read-write. You can change the default in repository Settings > Actions > General > Workflow permissions.",
        },
        {
          question: "What is id-token: write used for?",
          answer:
            "The id-token permission allows workflows to request an OpenID Connect (OIDC) token for keyless authentication with cloud providers (AWS, Azure, GCP). This eliminates the need to store long-lived cloud credentials as repository secrets.",
        },
      ],
      keywords: [
        "github actions permissions",
        "github token permissions",
        "github actions GITHUB_TOKEN",
        "github actions least privilege",
        "workflow permissions yaml",
        "github actions security permissions",
      ],
      parentToolSlug: "github-actions-validator",
      parentToolName: "GitHub Actions Validator",
    },
  ],

  "env-converter": [
    {
      slug: "env-to-docker-compose",
      title: ".env to Docker Compose Guide",
      metaTitle: ".env to Docker Compose — Convert Environment Variables to YAML",
      metaDescription:
        "Convert .env files to Docker Compose environment blocks or env_file references. Learn inline env vs env_file, variable interpolation, and best practices.",
      h1: ".env to Docker Compose Converter",
      intro:
        "Convert your .env file to Docker Compose format. Choose between inline environment variables or an env_file reference. Use the converter above, then follow this guide for production best practices.",
      content: [
        {
          heading: "Inline environment vs env_file",
          body: "Docker Compose supports two ways to pass environment variables. The 'environment' key lists variables directly in docker-compose.yml as KEY: VALUE pairs. The 'env_file' key references an external .env file. Inline is convenient for non-sensitive config that should be version-controlled. env_file is better for secrets because you can .gitignore the file. You can use both together — inline values override env_file values for the same key.",
          codeExample: "# Inline environment\nservices:\n  app:\n    image: node:20\n    environment:\n      NODE_ENV: production\n      PORT: 3000\n\n# env_file reference\nservices:\n  app:\n    image: node:20\n    env_file:\n      - .env\n      - .env.local",
          codeLanguage: "yaml",
        },
        {
          heading: "Variable interpolation in Compose",
          body: "Docker Compose supports variable substitution using ${VARIABLE} syntax in the YAML file itself. Variables are resolved from the shell environment or a .env file in the project root (not the env_file directive). You can set defaults with ${VARIABLE:-default} and require values with ${VARIABLE:?error message}. This is useful for per-environment configuration without changing the compose file.",
          codeExample: "services:\n  db:\n    image: postgres:${POSTGRES_VERSION:-16}\n    environment:\n      POSTGRES_DB: ${DB_NAME}\n      POSTGRES_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD in .env}",
          codeLanguage: "yaml",
        },
        {
          heading: "Security best practices",
          body: "Never commit secrets to docker-compose.yml. Use env_file with .gitignore for local development. For production, use Docker Swarm secrets, external secret managers (Vault, AWS Secrets Manager), or build-time --secret mounts. The converter detects sensitive keys like passwords, tokens, and API keys and flags them in the output.",
        },
      ],
      faqs: [
        {
          question: "Should I use environment or env_file in Docker Compose?",
          answer:
            "Use 'environment' for non-sensitive config you want visible in the compose file (NODE_ENV, PORT). Use 'env_file' for secrets (passwords, API keys) so they stay out of version control. You can combine both — inline values take precedence over env_file for duplicate keys.",
        },
        {
          question: "Does Docker Compose automatically read .env files?",
          answer:
            "Yes. Docker Compose reads a .env file in the project root for variable substitution in the YAML file (${VAR} syntax). This is separate from the env_file directive, which passes variables to the container. The root .env is for compose-time interpolation; env_file is for container runtime environment.",
        },
      ],
      keywords: [
        "env to docker compose",
        "docker compose environment variables",
        "docker compose env file",
        "docker compose env_file vs environment",
        "convert env to docker compose yaml",
        "docker compose secrets",
      ],
      parentToolSlug: "env-converter",
      parentToolName: ".env to Docker/K8s Converter",
    },
    {
      slug: "env-to-kubernetes-configmap",
      title: ".env to Kubernetes ConfigMap Guide",
      metaTitle: ".env to Kubernetes ConfigMap — Convert Environment Variables to K8s YAML",
      metaDescription:
        "Convert .env files to Kubernetes ConfigMap YAML manifests. Learn when to use ConfigMap vs Secret, how to mount as env vars or volumes, and namespace scoping.",
      h1: ".env to Kubernetes ConfigMap Converter",
      intro:
        "Convert your .env file to a Kubernetes ConfigMap manifest. Use the converter above to generate the YAML, then follow this guide to apply it correctly in your cluster.",
      content: [
        {
          heading: "ConfigMap basics",
          body: "A Kubernetes ConfigMap stores non-confidential configuration data as key-value pairs. Pods consume ConfigMaps as environment variables (envFrom or env with valueFrom), command-line arguments, or mounted config files in a volume. ConfigMaps are namespace-scoped and limited to 1 MiB of data. They are not encrypted — use Secrets for sensitive values.",
          codeExample: "apiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: app-config\n  namespace: production\ndata:\n  NODE_ENV: \"production\"\n  PORT: \"3000\"\n  LOG_LEVEL: \"info\"",
          codeLanguage: "yaml",
        },
        {
          heading: "Consuming ConfigMaps in Pods",
          body: "Use envFrom to inject all ConfigMap keys as environment variables, or env with valueFrom.configMapKeyRef for individual keys. For file-based config, mount as a volume. envFrom is the fastest way to convert a .env workflow to Kubernetes — one line replaces dozens of individual env entries.",
          codeExample: "spec:\n  containers:\n    - name: app\n      image: myapp:latest\n      # Inject all keys as env vars\n      envFrom:\n        - configMapRef:\n            name: app-config\n      # Or pick individual keys\n      env:\n        - name: DATABASE_HOST\n          valueFrom:\n            configMapKeyRef:\n              name: app-config\n              key: DB_HOST",
          codeLanguage: "yaml",
        },
        {
          heading: "ConfigMap vs Secret",
          body: "Use ConfigMap for non-sensitive data: feature flags, log levels, service URLs, port numbers. Use Secret for passwords, tokens, certificates, and API keys. The converter auto-detects sensitive key names and flags them. In practice, many teams start with a ConfigMap for everything and gradually split sensitive values into Secrets as they harden their deployment.",
        },
      ],
      faqs: [
        {
          question: "When should I use a ConfigMap instead of a Secret?",
          answer:
            "Use ConfigMap for non-sensitive configuration: ports, URLs, feature flags, log levels. Use Secret for passwords, API keys, tokens, and certificates. ConfigMap data is stored in plain text in etcd, while Secret data is base64-encoded (and can be encrypted at rest with EncryptionConfiguration).",
        },
        {
          question: "How do I update a ConfigMap without restarting pods?",
          answer:
            "If the ConfigMap is mounted as a volume, Kubernetes automatically updates the files (with a delay of up to the kubelet sync period, typically 60s). For environment variables, pods must be restarted — use 'kubectl rollout restart deployment/myapp'. Tools like Reloader or stakater/Reloader can automate restarts on ConfigMap changes.",
        },
      ],
      keywords: [
        "env to kubernetes configmap",
        "convert env to configmap",
        "kubernetes configmap from env file",
        "k8s configmap yaml",
        "configmap vs secret kubernetes",
        "kubernetes environment variables",
      ],
      parentToolSlug: "env-converter",
      parentToolName: ".env to Docker/K8s Converter",
    },
    {
      slug: "env-to-kubernetes-secret",
      title: ".env to Kubernetes Secret Guide",
      metaTitle: ".env to Kubernetes Secret — Convert Environment Variables to Encrypted K8s YAML",
      metaDescription:
        "Convert .env files to Kubernetes Secret YAML with base64 or stringData format. Learn Secret types, encryption at rest, and how to mount secrets in pods.",
      h1: ".env to Kubernetes Secret Converter",
      intro:
        "Convert your .env file to a Kubernetes Secret manifest. Choose base64-encoded data or plain stringData format. Use the converter above, then follow this guide for production-grade secret management.",
      content: [
        {
          heading: "Secret data vs stringData",
          body: "Kubernetes Secrets support two data fields. 'data' requires base64-encoded values — what Kubernetes stores internally. 'stringData' accepts plain text that Kubernetes auto-encodes on apply. Both produce identical Secrets at runtime. Use stringData during development for readability. Use data in CI/CD pipelines where values are pre-encoded. You can mix both in the same manifest — stringData values override data values for the same key.",
          codeExample: "# base64-encoded data\napiVersion: v1\nkind: Secret\nmetadata:\n  name: app-secrets\ntype: Opaque\ndata:\n  DB_PASSWORD: c3VwZXItc2VjcmV0  # echo -n 'super-secret' | base64\n\n# Plain stringData (auto-encoded on apply)\napiVersion: v1\nkind: Secret\nmetadata:\n  name: app-secrets\ntype: Opaque\nstringData:\n  DB_PASSWORD: \"super-secret\"",
          codeLanguage: "yaml",
        },
        {
          heading: "Encryption at rest",
          body: "By default, Kubernetes stores Secrets as base64 in etcd — this is encoding, not encryption. Anyone with etcd access can read them. Enable encryption at rest with an EncryptionConfiguration that uses aescbc, aesgcm, or a KMS provider (AWS KMS, GCP KMS, Azure Key Vault). Managed Kubernetes services (EKS, GKE, AKS) offer envelope encryption by default or with a checkbox.",
        },
        {
          heading: "External secret management",
          body: "For production, consider external secret operators: External Secrets Operator (syncs from AWS SM, Vault, GCP SM, Azure KV), Sealed Secrets (encrypts secrets for Git storage), and SOPS (encrypts YAML files). These let you store encrypted secret manifests in Git while the operator decrypts them in-cluster. The converter output is a starting point — move to external management as you scale.",
        },
      ],
      faqs: [
        {
          question: "Is base64 encoding in Kubernetes Secrets secure?",
          answer:
            "No. Base64 is encoding, not encryption — anyone can decode it. Kubernetes Secrets are only as secure as your etcd encryption and RBAC policies. Enable encryption at rest (EncryptionConfiguration or managed K8s encryption), restrict Secret access with RBAC, and avoid committing Secret manifests to Git.",
        },
        {
          question: "Should I use data or stringData in Kubernetes Secrets?",
          answer:
            "Use stringData for human-written manifests (easier to read and edit). Use data for machine-generated manifests in CI/CD where values are already base64-encoded. Both produce identical Secrets when applied. stringData is a write-only convenience — kubectl get secret always shows base64-encoded data.",
        },
      ],
      keywords: [
        "env to kubernetes secret",
        "convert env to k8s secret",
        "kubernetes secret base64",
        "kubernetes stringdata vs data",
        "kubernetes secret yaml",
        "kubernetes secret encryption",
      ],
      parentToolSlug: "env-converter",
      parentToolName: ".env to Docker/K8s Converter",
    },
  ],

  "json-xml": [
    {
      slug: "json-to-xml-guide",
      title: "JSON to XML Conversion Guide",
      metaTitle: "JSON to XML Conversion — Complete Guide with Examples",
      metaDescription:
        "Learn how to convert JSON to XML with practical examples. Understand mapping rules for objects, arrays, nulls, and data types. Free JSON to XML converter.",
      h1: "JSON to XML Conversion Guide",
      intro:
        "Converting JSON to XML requires mapping JSON's data model (objects, arrays, primitives) to XML's element-based hierarchy. This guide covers the conversion rules, edge cases, and best practices.",
      content: [
        {
          heading: "How JSON maps to XML elements",
          body: "JSON objects become XML elements with child elements for each key. JSON arrays require a wrapper element and repeated child elements. Primitives (strings, numbers, booleans) become text content inside their parent element. Null values can be represented with xsi:nil=\"true\" or an empty element.",
          codeExample: '// JSON input\n{\n  "user": {\n    "name": "Alice",\n    "age": 30,\n    "active": true,\n    "tags": ["admin", "editor"]\n  }\n}\n\n<!-- XML output -->\n<user>\n  <name>Alice</name>\n  <age>30</age>\n  <active>true</active>\n  <tags>\n    <item>admin</item>\n    <item>editor</item>\n  </tags>\n</user>',
          codeLanguage: "xml",
        },
        {
          heading: "Handling arrays in XML",
          body: "JSON arrays have no direct XML equivalent. The standard approach wraps array items in a parent element matching the JSON key, with each item in a child element (commonly named 'item'). Some converters use the singular form of the parent name — e.g., <books> wrapping <book> elements. DevBolt's converter lets you configure the array item tag name.",
        },
        {
          heading: "When to use JSON vs XML",
          body: "JSON dominates modern REST APIs, JavaScript/TypeScript ecosystems, and NoSQL databases due to its compact syntax and native JavaScript support. XML remains essential for SOAP web services, enterprise integrations (EDI, HL7), document formats (XHTML, SVG, RSS/Atom), and systems requiring schemas (XSD), namespaces, or mixed content. Many integration workflows require converting between both.",
        },
      ],
      faqs: [
        {
          question: "Can JSON arrays be represented in XML?",
          answer:
            "Yes, but XML has no native array type. Arrays are typically represented as a parent element containing repeated child elements with the same tag name. For example, a JSON array [1, 2, 3] becomes <items><item>1</item><item>2</item><item>3</item></items>.",
        },
        {
          question: "How are JSON null values represented in XML?",
          answer:
            "Common approaches: an empty self-closing element (<field />), the xsi:nil=\"true\" attribute (<field xsi:nil=\"true\" />), or omitting the element entirely. The best choice depends on your XML schema requirements.",
        },
      ],
      keywords: [
        "json to xml",
        "convert json to xml",
        "json to xml converter",
        "json xml mapping",
        "json to xml example",
        "json to xml online",
      ],
      parentToolSlug: "json-xml",
      parentToolName: "JSON ↔ XML Converter",
    },
    {
      slug: "xml-to-json-guide",
      title: "XML to JSON Conversion Guide",
      metaTitle: "XML to JSON Conversion — Complete Guide with Examples",
      metaDescription:
        "Learn how to convert XML to JSON with practical examples. Handle attributes, CDATA, namespaces, and mixed content. Free XML to JSON converter.",
      h1: "XML to JSON Conversion Guide",
      intro:
        "Converting XML to JSON requires careful handling of attributes, text content, repeated elements, and CDATA sections. This guide covers the rules and common conventions.",
      content: [
        {
          heading: "XML attributes in JSON",
          body: "XML attributes have no direct JSON equivalent. The most common convention uses a prefix character (typically '@') to distinguish attributes from child elements. For example, <book id=\"123\"> becomes {\"@id\": 123}. Other conventions include a nested \"_attributes\" object or flattening attributes as regular keys. DevBolt's converter uses a configurable prefix (default: '@').",
          codeExample: '<!-- XML input -->\n<product id="P001" category="electronics">\n  <name>Wireless Mouse</name>\n  <price currency="USD">29.99</price>\n</product>\n\n// JSON output (with @ prefix)\n{\n  "@id": "P001",\n  "@category": "electronics",\n  "name": "Wireless Mouse",\n  "price": {\n    "@currency": "USD",\n    "#text": 29.99\n  }\n}',
          codeLanguage: "json",
        },
        {
          heading: "Handling repeated elements as arrays",
          body: "When multiple sibling elements share the same tag name, they are grouped into a JSON array. A single element becomes a plain value. This can cause inconsistency — one <item> produces a value, two <item> elements produce an array. Some converters offer a 'force array' option for specific tags to ensure consistent array output regardless of element count.",
        },
        {
          heading: "CDATA and mixed content",
          body: "CDATA sections (<![CDATA[...]]>) contain text that should not be parsed as XML markup. In JSON conversion, CDATA content is extracted as plain text. Mixed content (elements containing both text and child elements) uses a text key (default: '#text') to preserve the text alongside child element keys.",
        },
      ],
      faqs: [
        {
          question: "How are XML attributes represented in JSON?",
          answer:
            "The most common convention prefixes attribute names with '@' — e.g., <book id=\"1\"> becomes {\"@id\": 1}. This distinguishes attributes from child elements in the same JSON object. The prefix character is configurable.",
        },
        {
          question: "Is XML to JSON conversion lossless?",
          answer:
            "Not always. XML features like processing instructions, comments, namespace declarations, document type definitions, and attribute ordering have no JSON equivalent. Element order within objects may also change since JSON objects are unordered. For most data interchange scenarios, the conversion preserves all meaningful content.",
        },
      ],
      keywords: [
        "xml to json",
        "convert xml to json",
        "xml to json converter",
        "xml json mapping",
        "xml attributes to json",
        "xml to json online",
      ],
      parentToolSlug: "json-xml",
      parentToolName: "JSON ↔ XML Converter",
    },
    {
      slug: "json-xml-differences",
      title: "JSON vs XML — Key Differences",
      metaTitle: "JSON vs XML — Syntax, Performance & Use Cases Compared",
      metaDescription:
        "Compare JSON and XML: syntax differences, performance, use cases, and when to use each format. Understand the trade-offs for APIs, configs, and data interchange.",
      h1: "JSON vs XML — Key Differences Explained",
      intro:
        "JSON and XML are the two dominant data interchange formats. Understanding their differences helps you choose the right format and convert between them effectively.",
      content: [
        {
          heading: "Syntax comparison",
          body: "JSON uses curly braces for objects, square brackets for arrays, and colons for key-value pairs. It supports strings, numbers, booleans, null, objects, and arrays — 6 data types. XML uses opening/closing tags for elements, supports attributes on elements, and treats all content as text (no native data types). JSON is typically 30-50% smaller than equivalent XML due to the absence of closing tags.",
          codeExample: '// JSON (compact)\n{"name": "Alice", "age": 30, "active": true}\n\n<!-- XML (verbose) -->\n<person>\n  <name>Alice</name>\n  <age>30</age>\n  <active>true</active>\n</person>\n\n<!-- XML with attributes (more compact) -->\n<person name="Alice" age="30" active="true" />',
          codeLanguage: "xml",
        },
        {
          heading: "Performance and parsing",
          body: "JSON parsing is faster in most languages because JSON maps directly to native data structures (JavaScript objects, Python dicts, Go maps). XML parsing requires DOM or SAX parsers, namespace resolution, and schema validation. For web APIs, JSON is 2-10x faster to parse. However, XML streaming parsers (SAX/StAX) handle very large documents more efficiently than loading entire JSON files into memory.",
        },
        {
          heading: "When to use each format",
          body: "Use JSON for: REST APIs, web/mobile apps, NoSQL databases, configuration files, inter-service communication. Use XML for: SOAP services, enterprise integrations (EDI, HL7, FHIR), document formats (XHTML, SVG, RSS), systems requiring strong schema validation (XSD), mixed content documents, and legacy system interoperability. Many systems need both — hence the need for reliable conversion tools.",
        },
      ],
      faqs: [
        {
          question: "Is JSON faster than XML?",
          answer:
            "For parsing, generally yes — JSON maps directly to native data structures in most languages. JSON documents are also smaller (no closing tags), reducing transfer time. However, XML streaming parsers can handle very large documents more memory-efficiently than loading entire JSON files.",
        },
        {
          question: "Can XML do everything JSON can?",
          answer:
            "Yes, XML is more expressive than JSON. XML supports attributes, namespaces, mixed content, processing instructions, CDATA sections, and schema validation (XSD). JSON is simpler by design, which makes it easier to use but less capable for complex document structures.",
        },
      ],
      keywords: [
        "json vs xml",
        "json xml differences",
        "json or xml",
        "json xml comparison",
        "when to use json vs xml",
        "json vs xml performance",
      ],
      parentToolSlug: "json-xml",
      parentToolName: "JSON ↔ XML Converter",
    },
  ],

  "css-unit-converter": [
    {
      slug: "px-to-rem-guide",
      title: "px to rem Conversion Guide",
      metaTitle: "px to rem Converter — How to Convert Pixels to REM Online",
      metaDescription:
        "Convert px to rem instantly with a configurable base font size. Learn the px-to-rem formula, see a reference table, and batch-convert CSS files. Free online tool.",
      h1: "px to rem Converter & Guide",
      intro:
        "Convert pixels to rem units instantly. Set your root font size (default 16px) and get accurate rem values for any pixel measurement. Paste CSS to batch-convert all px values to rem. All processing happens in your browser — your data never leaves your device.",
      content: [
        {
          heading: "How to convert px to rem",
          body: "The formula is simple: rem = px / root-font-size. With the browser default of 16px, 1rem equals 16px. So 24px is 1.5rem, 14px is 0.875rem, and 32px is 2rem. If your project sets html { font-size: 62.5% } (a common Tailwind/CSS reset trick), the base becomes 10px, making the math easier: 16px = 1.6rem, 20px = 2rem. Use the settings panel to match your project's root font size for accurate conversions.",
        },
        {
          heading: "Why use rem instead of px",
          body: "rem units are relative to the root font size, so they scale automatically when users change their browser font size (an accessibility requirement under WCAG 2.1). Pixels are fixed and don't respect user preferences. Using rem for font-size, padding, margin, and media queries makes your site accessible to users with low vision who increase their default font size. Most CSS frameworks (Tailwind, Bootstrap 5) use rem internally. The general rule: use rem for typography and spacing, px for borders and box-shadows where exact control matters.",
        },
        {
          heading: "Batch-convert px to rem in CSS files",
          body: "Paste your CSS into the batch converter, set 'Replace px with rem', and all pixel values are converted instantly. This is faster than find-and-replace because it handles the math automatically — 16px becomes 1rem, 24px becomes 1.5rem, etc. The converter preserves your CSS structure, comments, and non-px values. Use this when migrating a legacy codebase from px to rem or when reviewing design tokens from Figma/Sketch that export in pixels.",
        },
      ],
      faqs: [
        {
          question: "How many rem is 16px?",
          answer:
            "With the default root font size of 16px, 16px equals exactly 1rem. The formula is rem = px / root-font-size, so 16 / 16 = 1.",
        },
        {
          question: "What base font size should I use for rem conversion?",
          answer:
            "Most browsers default to 16px. If your CSS sets html { font-size: 62.5% }, the base is 10px. If you use html { font-size: 100% } or don't set it, the base is 16px. Match this tool's settings to your project's root font size for accurate conversions.",
        },
        {
          question: "Should I use rem or em for CSS?",
          answer:
            "Use rem for most cases — it's relative to the root font size, so it's consistent and predictable. Use em only when you want an element to scale relative to its parent's font size (e.g., padding inside a button that should grow with the button's text). Mixing em and rem in deep nesting causes compounding issues, so rem is safer.",
        },
      ],
      keywords: [
        "px to rem",
        "px to rem converter",
        "pixel to rem",
        "px to rem calculator",
        "convert px to rem",
        "16px to rem",
        "px rem conversion",
        "css px to rem",
      ],
      parentToolSlug: "css-unit-converter",
      parentToolName: "CSS Unit Converter",
    },
    {
      slug: "rem-to-px-guide",
      title: "rem to px Conversion Guide",
      metaTitle: "rem to px Converter — Convert REM to Pixels Online",
      metaDescription:
        "Convert rem to px instantly. See the rem-to-pixel formula, reference table, and batch-convert CSS. Free online tool with configurable base font size.",
      h1: "rem to px Converter & Guide",
      intro:
        "Convert rem values to pixels instantly. Useful for debugging computed styles, matching design specs, or understanding what rem values resolve to. Set your base font size and convert single values or entire CSS files. All client-side — no data leaves your browser.",
      content: [
        {
          heading: "How to convert rem to px",
          body: "The formula is: px = rem × root-font-size. With the default root font size of 16px, 1rem = 16px, 1.5rem = 24px, 0.875rem = 14px, and 2.5rem = 40px. You can check the computed root font size in DevTools by inspecting the <html> element and looking at the computed font-size property. If your project uses html { font-size: 62.5% }, multiply rem by 10 instead of 16.",
        },
        {
          heading: "When you need rem to px conversion",
          body: "You need rem-to-px conversion when: (1) comparing CSS values against pixel-based design specs from Figma, Sketch, or Adobe XD; (2) debugging why an element appears a different size than expected; (3) calculating exact pixel dimensions for images, SVGs, or canvas elements that need precise sizing; (4) setting border-width, outline, or box-shadow where sub-pixel rendering matters. Browser DevTools shows computed values in px, so knowing the conversion helps you map between your CSS source (rem) and rendered output (px).",
        },
        {
          heading: "Common rem to px values",
          body: "At 16px base: 0.25rem = 4px, 0.5rem = 8px, 0.75rem = 12px, 1rem = 16px, 1.25rem = 20px, 1.5rem = 24px, 2rem = 32px, 2.5rem = 40px, 3rem = 48px, 4rem = 64px. Tailwind CSS spacing scale maps to these values: space-1 (0.25rem/4px), space-2 (0.5rem/8px), space-4 (1rem/16px), space-8 (2rem/32px). The reference table below updates dynamically when you change the base font size.",
        },
      ],
      faqs: [
        {
          question: "How many pixels is 1rem?",
          answer:
            "1rem equals 16 pixels by default (the browser's default root font size). If your CSS changes the root font size with html { font-size: ... }, 1rem equals that value instead. For example, html { font-size: 20px } makes 1rem = 20px.",
        },
        {
          question: "How do I find the root font size in my browser?",
          answer:
            "Open DevTools (F12), select the <html> element in the Elements panel, and check the Computed tab for font-size. This shows the actual root font size in pixels, which is the base for all rem calculations. Most browsers default to 16px unless overridden by CSS or user settings.",
        },
        {
          question: "Does rem to px conversion change with browser zoom?",
          answer:
            "Browser zoom scales both rem and px proportionally, so the ratio stays the same. If 1rem = 16px at 100% zoom, it's still 1rem = 16px at 200% zoom — both values double together. The rem-to-px conversion formula doesn't change with zoom level.",
        },
      ],
      keywords: [
        "rem to px",
        "rem to px converter",
        "rem to pixel",
        "convert rem to px",
        "1rem to px",
        "rem px calculator",
        "css rem to px",
        "what is 1rem in px",
      ],
      parentToolSlug: "css-unit-converter",
      parentToolName: "CSS Unit Converter",
    },
    {
      slug: "css-units-guide",
      title: "CSS Units Explained — px, rem, em, vw, vh, %",
      metaTitle: "CSS Units Guide — When to Use px, rem, em, vw, vh, %",
      metaDescription:
        "Learn when to use px, rem, em, vw, vh, and % in CSS. Understand absolute vs relative units, accessibility best practices, and responsive design patterns.",
      h1: "CSS Units Guide — px, rem, em, vw, vh, %",
      intro:
        "A practical guide to CSS units for web developers. Learn the difference between absolute and relative units, when to use each one, and how to convert between them. Use the converter above to test conversions with your project's settings.",
      content: [
        {
          heading: "Absolute vs relative CSS units",
          body: "Absolute units (px, pt, cm, mm, in) have a fixed size regardless of context. Pixels (px) are the most common — 1px equals one device pixel at standard density (but CSS pixels scale on high-DPI screens). Relative units (rem, em, vw, vh, %) are calculated based on another value: rem uses the root font size, em uses the parent font size, vw/vh use the viewport dimensions, and % uses the parent element's size. Relative units create flexible, responsive layouts and improve accessibility.",
        },
        {
          heading: "Best practices for choosing CSS units",
          body: "Font sizes: use rem for consistency and accessibility (users can scale text via browser settings). Spacing (margin, padding, gap): use rem to keep proportional to text size. Widths: use % or vw for responsive containers, max-width in px or rem for readable line lengths. Heights: avoid fixed heights; use min-height with vh for full-screen sections. Media queries: use rem (not px) so breakpoints respect user font size preferences. Borders and shadows: px is fine — these are decorative and don't need to scale. Line height: use unitless values (like 1.5) for best inheritance behavior.",
        },
        {
          heading: "Common pitfalls with CSS units",
          body: "em compounding: nested em values multiply (a 1.2em inside a 1.2em parent renders as 1.44em of the grandparent) — use rem instead. vw overflow: 100vw includes the scrollbar width, causing horizontal scroll — use width: 100% on the body instead. % height: percentage heights only work if the parent has an explicit height — use vh or min-height instead. px in media queries: pixel-based breakpoints don't respond to user font size changes — use rem breakpoints (e.g., @media (min-width: 48rem) instead of 768px).",
        },
      ],
      faqs: [
        {
          question: "What is the difference between rem and em in CSS?",
          answer:
            "rem is relative to the root element's (html) font size and is consistent throughout the page. em is relative to the parent element's font size and compounds with nesting. For example, 1.5em inside a parent with 1.5em font-size equals 2.25× the grandparent's size. rem avoids this compounding issue, making it safer for most use cases.",
        },
        {
          question: "Should I use px or rem for responsive design?",
          answer:
            "Use rem for responsive design. rem units scale when users change their browser font size (an accessibility best practice), while px values stay fixed. Use rem for font-size, spacing, and media query breakpoints. Use px only for fine details like borders and box-shadows that shouldn't scale.",
        },
        {
          question: "What do vw and vh mean in CSS?",
          answer:
            "vw (viewport width) and vh (viewport height) are relative to the browser viewport size. 1vw = 1% of the viewport width, 1vh = 1% of the viewport height. 100vw is the full viewport width. They're useful for full-screen sections (min-height: 100vh), fluid typography (font-size: 3vw), and responsive spacing. Note: 100vw includes the scrollbar, so use 100% for body/container widths.",
        },
      ],
      keywords: [
        "css units",
        "css units explained",
        "px vs rem",
        "rem vs em",
        "css vw vh",
        "when to use rem",
        "css relative units",
        "css absolute units",
        "responsive css units",
      ],
      parentToolSlug: "css-unit-converter",
      parentToolName: "CSS Unit Converter",
    },
  ],

  "html-table-generator": [
    {
      slug: "html-table-css-styling",
      title: "HTML Table CSS Styling Guide",
      metaTitle:
        "HTML Table CSS Styling Guide — Borders, Stripes, Hover Effects | DevBolt",
      metaDescription:
        "Learn how to style HTML tables with CSS — borders, striped rows, hover effects, responsive scrolling, and modern design patterns. Generate styled tables instantly.",
      h1: "HTML Table CSS Styling Guide",
      intro:
        "Learn how to transform plain HTML tables into polished, readable components with CSS. This guide covers borders, striped rows, hover effects, responsive patterns, and dark mode — with a visual builder to generate the code for you.",
      content: [
        {
          heading: "Essential CSS for HTML tables",
          body: "Start with border-collapse: collapse on the table element to merge cell borders into clean lines. Add padding to th and td cells (8-12px is standard) for readable spacing. Use border-bottom on rows instead of full borders for a lighter, modern look. Set width: 100% on the table for responsive behavior. For striped rows, use tr:nth-child(even) { background: #f9f9f9 }. Add tr:hover { background: #f0f4ff } for interactive row highlighting.",
        },
        {
          heading: "Responsive table patterns",
          body: "Tables can overflow on mobile screens. The simplest fix is wrapping the table in a div with overflow-x: auto to enable horizontal scrolling. For a more advanced approach, use CSS Grid or Flexbox to stack cells vertically on small screens with display: block on tr and td elements combined with data attributes for labels. Another option: hide less-important columns on mobile with media queries and display: none.",
        },
        {
          heading: "HTML tables in emails",
          body: "Email clients strip external CSS, so HTML email tables must use inline styles. Set style attributes directly on table, th, td, and tr elements. Use table attributes like cellpadding and cellspacing for maximum compatibility. Avoid CSS Grid, Flexbox, nth-child selectors, and CSS variables — Outlook and Gmail ignore them. DevBolt's 'Inline CSS' output format generates email-safe table code.",
        },
      ],
      faqs: [
        {
          question: "How do I add borders to an HTML table?",
          answer:
            "Add border-collapse: collapse to the table element, then border: 1px solid #ddd to th and td cells. Border-collapse merges adjacent cell borders into a single line instead of doubling them. For a minimal look, use border-bottom only on tr elements instead of full cell borders.",
        },
        {
          question: "How do I make an HTML table responsive?",
          answer:
            "Wrap the table in a container div with overflow-x: auto and max-width: 100%. This enables horizontal scrolling on small screens. For a mobile-first approach, use media queries to stack cells vertically or hide non-essential columns on narrow viewports.",
        },
        {
          question: "How do I style an HTML table for dark mode?",
          answer:
            "Use a prefers-color-scheme: dark media query to swap background and text colors. Set the table background to a dark gray (#1f2937), text color to light gray (#e5e7eb), and border colors to a mid-gray (#374151). For hover states, use a slightly lighter background (#374151).",
        },
      ],
      keywords: [
        "html table css",
        "style html table",
        "html table design",
        "css table borders",
        "striped table css",
        "responsive html table",
        "html table hover effect",
        "html email table",
      ],
      parentToolSlug: "html-table-generator",
      parentToolName: "HTML Table Generator",
    },
    {
      slug: "html-table-accessibility",
      title: "Accessible HTML Tables Guide",
      metaTitle:
        "Accessible HTML Tables — WCAG Best Practices & Screen Reader Support | DevBolt",
      metaDescription:
        "Build accessible HTML tables with proper headers, captions, scope attributes, and ARIA roles. Follow WCAG guidelines for screen reader support.",
      h1: "Accessible HTML Tables — WCAG Best Practices",
      intro:
        "HTML tables need proper structure for screen readers and assistive technology. This guide covers semantic markup, scope attributes, captions, and WCAG compliance — so your tables are usable by everyone.",
      content: [
        {
          heading: "Semantic table structure",
          body: "Use thead, tbody, and optionally tfoot to group rows by purpose. Use th for header cells and td for data cells — never style td elements to look like headers. Screen readers announce th cells as column or row headers, helping users navigate large tables. Add a caption element as the first child of the table to describe its purpose — assistive technology announces this before reading cell data.",
        },
        {
          heading: "The scope attribute",
          body: "Add scope='col' to column headers and scope='row' to row headers. This tells screen readers how to associate data cells with their headers. For simple tables with a single header row, most screen readers infer scope automatically, but explicit scope is essential for complex tables with multi-level headers. For tables spanning multiple header rows or columns, use headers and id attributes to create explicit cell-to-header associations.",
        },
        {
          heading: "Common accessibility mistakes",
          body: "Using tables for page layout instead of tabular data confuses screen readers. Empty th cells waste time — if a column needs no header, consider whether the data belongs in a table. Merged cells (colspan/rowspan) break navigation in screen readers unless headers are explicitly linked with the headers attribute. Missing caption or summary means users have no context before entering the table. Color-only distinctions (red vs green rows) exclude colorblind users — always pair color with text or icons.",
        },
      ],
      faqs: [
        {
          question: "Do HTML tables need a caption element?",
          answer:
            "A caption is not strictly required for validity, but WCAG 2.1 Success Criterion 1.3.1 recommends it. Screen readers announce the caption before entering the table, giving users context. If you cannot add a caption, use aria-label or aria-describedby on the table element as an alternative.",
        },
        {
          question: "When should I use scope vs headers attribute?",
          answer:
            "Use scope='col' or scope='row' on th elements for simple tables with a single row or column of headers. Use the headers attribute (referencing th id values) for complex tables with multiple header levels, merged cells, or irregular structure. Most tables only need scope.",
        },
        {
          question: "Is it accessible to use div elements instead of table elements?",
          answer:
            "Using divs with CSS Grid to create table-like layouts loses the built-in accessibility of native table elements. Screen readers understand table, tr, th, and td natively and provide keyboard navigation. If you must use divs, add ARIA roles (role='table', role='row', role='columnheader', role='cell') — but native table elements are always preferred.",
        },
      ],
      keywords: [
        "accessible html table",
        "html table accessibility",
        "table wcag",
        "screen reader table",
        "html table scope",
        "table caption",
        "aria table",
        "accessible data table",
      ],
      parentToolSlug: "html-table-generator",
      parentToolName: "HTML Table Generator",
    },
    {
      slug: "csv-to-html-table",
      title: "CSV to HTML Table Converter",
      metaTitle:
        "CSV to HTML Table Converter Online — Free Tool | DevBolt",
      metaDescription:
        "Convert CSV data to a styled HTML table instantly. Import comma-separated or tab-separated data, choose a style, and export as HTML with inline CSS or Tailwind classes.",
      h1: "CSV to HTML Table Converter",
      intro:
        "Paste your CSV or tab-separated data and convert it to a styled HTML table in seconds. The first row becomes the header. Choose minimal, bordered, striped, or modern styling and export as plain HTML, inline CSS, or Tailwind classes.",
      content: [
        {
          heading: "How to convert CSV to HTML table",
          body: "Click 'Import CSV' in the tool above, paste your comma-separated or tab-separated data, and click Import. The first line is used as table headers (th elements inside thead) and the remaining lines become data rows (td elements inside tbody). After importing, you can edit any cell directly, add or remove rows and columns, toggle headers, and choose a visual style before generating the final HTML code.",
        },
        {
          heading: "Handling edge cases in CSV data",
          body: "The parser handles quoted fields ('\"Portland, OR\"' stays as one cell), escaped quotes ('\"\"' becomes '\"'), and mixed delimiters (commas and tabs). Empty fields are preserved as empty cells. Rows with fewer columns than the header are padded with empty cells. Rows with more columns are truncated to match. Maximum 10 columns are supported to keep tables readable.",
        },
        {
          heading: "Converting CSV to HTML with code",
          body: "In JavaScript: split the CSV by newlines, split each line by commas, map the first row to th elements wrapped in thead/tr, and map remaining rows to td elements wrapped in tbody/tr. In Python, use the csv module with csv.reader() and build the HTML string with string formatting or an HTML template library like Jinja2. For one-off conversions, this visual tool is faster than writing code.",
        },
      ],
      faqs: [
        {
          question: "Does the CSV parser handle quoted fields?",
          answer:
            "Yes. Fields wrapped in double quotes are treated as a single cell even if they contain commas. Escaped quotes (two double-quote characters) are converted to a single double-quote in the output. Tab-separated data is also supported.",
        },
        {
          question: "Can I style the generated HTML table for emails?",
          answer:
            "Yes. Select the 'Inline CSS' output format to embed styles directly on each HTML element. This is the recommended approach for HTML emails because most email clients strip external and head-level CSS. The inline output includes padding, borders, and background colors compatible with Outlook, Gmail, and Apple Mail.",
        },
        {
          question:
            "What if my CSV has more columns than the table supports?",
          answer:
            "The tool supports up to 10 columns. If your CSV has more, only the first 10 columns are imported. For wider datasets, consider splitting the data across multiple tables or transposing rows and columns.",
        },
      ],
      keywords: [
        "csv to html table",
        "csv to html converter",
        "csv to html online",
        "convert csv to table",
        "csv to html table generator",
        "tab to html table",
        "tsv to html",
        "paste csv html",
      ],
      parentToolSlug: "html-table-generator",
      parentToolName: "HTML Table Generator",
    },
  ],
};
