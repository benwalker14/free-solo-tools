import Link from "next/link";

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm font-mono text-indigo-600 dark:bg-gray-800 dark:text-indigo-400">
      {children}
    </code>
  );
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      {title && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          {title}
        </div>
      )}
      <pre className="overflow-x-auto bg-gray-50 p-4 text-sm leading-relaxed dark:bg-gray-900">
        <code className="font-mono text-gray-800 dark:text-gray-200">
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function FixJwtErrors() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        JWT errors are some of the most cryptic messages you&apos;ll see in web
        development. The three you&apos;ll hit most often are{" "}
        <Code>TokenExpiredError</Code>, invalid signature, and malformed token.
        The fix depends on which part of the token is wrong &mdash; the
        timestamps, the signing key, or the encoding itself. This guide walks
        through every common JWT error, explains why it happens, and shows you
        how to decode, diagnose, and fix it.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How JWTs Work (30-Second Recap)
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        A JSON Web Token is a compact string made up of three parts separated by
        dots: a <strong className="text-gray-900 dark:text-white">header</strong>,
        a <strong className="text-gray-900 dark:text-white">payload</strong>, and
        a <strong className="text-gray-900 dark:text-white">signature</strong>.
        Each part is Base64URL-encoded.
      </p>
      <CodeBlock title="JWT structure">
        {`header.payload.signature

// Decoded header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Decoded payload
{
  "sub": "user_123",
  "iss": "https://auth.example.com",
  "aud": "https://api.example.com",
  "exp": 1710787200,
  "iat": 1710700800,
  "nbf": 1710700800
}`}
      </CodeBlock>
      <p className="text-gray-600 dark:text-gray-400">
        The header declares the signing algorithm. The payload carries claims
        about the user and token metadata. The signature is created by signing
        the encoded header and payload with a secret key (for HMAC algorithms)
        or a private key (for RSA/ECDSA). When a server receives a JWT, it
        re-computes the signature and compares it to the one in the token. If
        anything is off &mdash; wrong key, tampered payload, expired timestamp
        &mdash; you get an error.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        The 8 Most Common JWT Errors
      </h2>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        1. TokenExpiredError &mdash; <Code>exp</Code> Claim in the Past
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        This is the single most common JWT error. The <Code>exp</Code> claim is
        a Unix timestamp that defines when the token becomes invalid. Once the
        current time passes that value, every library will reject the token.
      </p>
      <CodeBlock title="Error message (Node.js jsonwebtoken)">
        {`TokenExpiredError: jwt expired
    at /node_modules/jsonwebtoken/verify.js:152:21`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Refresh
        the token before it expires. Most auth flows use short-lived access
        tokens (15 minutes) paired with longer-lived refresh tokens (7 days).
        When the access token expires, silently exchange the refresh token for a
        new access token.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        2. Invalid Signature &mdash; Wrong Secret or Key
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The signature verification failed. This means the key used to verify the
        token does not match the key used to sign it, or the token was tampered
        with after signing.
      </p>
      <CodeBlock title="Error message">
        {`JsonWebTokenError: invalid signature`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Common causes:</strong>
      </p>
      <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            The signing secret changed between token creation and verification
            (e.g., after a deployment that rotated keys)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            Using an HS256 secret to verify a token that was signed with RS256
            (algorithm mismatch)
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            Different environments (dev vs. production) using different secrets
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            Trailing whitespace or newlines in the secret from environment
            variable loading
          </span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Confirm
        the exact same key is used for signing and verification. For RSA/ECDSA,
        verify you&apos;re signing with the private key and verifying with the
        matching public key. Check for encoding issues &mdash; a Base64-encoded
        secret needs to be decoded before use.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        3. Malformed Token &mdash; Not Three Parts or Invalid Base64
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        A valid JWT must have exactly three dot-separated segments. If the token
        is truncated, has extra characters, or contains non-Base64URL characters,
        the parser will reject it immediately.
      </p>
      <CodeBlock title="Error message">
        {`JsonWebTokenError: jwt malformed`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Common causes:</strong>
      </p>
      <ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            Sending the entire <Code>Authorization</Code> header value including
            the <Code>Bearer </Code> prefix to the verify function
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Token was URL-encoded during transmission and not decoded</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Token was truncated by a proxy, cookie size limit, or log output</span>
        </li>
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Strip
        the <Code>Bearer </Code> prefix before verification. Log the raw token
        length to check for truncation. Paste the token into our{" "}
        <Link
          href="/tools/jwt-decoder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Decoder
        </Link>{" "}
        to see if it parses correctly.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        4. Algorithm &quot;none&quot; Vulnerability
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The JWT spec allows <Code>alg: &quot;none&quot;</Code> for unsecured
        tokens. Attackers exploit this by forging a token with no signature and
        setting the algorithm to <Code>none</Code>. If your server accepts it,
        they can impersonate any user.
      </p>
      <CodeBlock title="Malicious token header">
        {`{
  "alg": "none",
  "typ": "JWT"
}
// Signature is empty — token ends with a trailing dot
// eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiJ9.`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Always
        specify the allowed algorithms explicitly in your verification config.
        Never let the token header dictate which algorithm to use. Every major
        JWT library supports an <Code>algorithms</Code> whitelist.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        5. Token Not Yet Valid &mdash; <Code>nbf</Code> Claim in the Future
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>nbf</Code> (not before) claim sets the earliest time the token
        can be used. If the server&apos;s clock is behind the issuer&apos;s
        clock, the token will be rejected even though it was just created.
      </p>
      <CodeBlock title="Error message">
        {`NotBeforeError: jwt not active`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Sync
        clocks across services using NTP. Most libraries also accept a{" "}
        <Code>clockTolerance</Code> option to allow a few seconds of skew.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        6. Invalid Audience &mdash; <Code>aud</Code> Mismatch
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        The <Code>aud</Code> (audience) claim identifies who the token is
        intended for. If your server expects{" "}
        <Code>https://api.example.com</Code> but the token says{" "}
        <Code>https://staging-api.example.com</Code>, verification fails.
      </p>
      <CodeBlock title="Error message">
        {`JsonWebTokenError: jwt audience invalid. expected: https://api.example.com`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Ensure
        the <Code>aud</Code> claim in the token matches exactly what your
        verifier expects. This often breaks when tokens from a staging
        environment leak into production, or when an OAuth provider is configured
        with the wrong audience URL.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        7. Invalid Issuer &mdash; <Code>iss</Code> Mismatch
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Similar to audience errors, the <Code>iss</Code> (issuer) claim
        identifies who created the token. If you expect tokens from{" "}
        <Code>https://auth.example.com</Code> but receive one
        from <Code>https://auth.other-service.com</Code>, it will be rejected.
      </p>
      <CodeBlock title="Error message">
        {`JsonWebTokenError: jwt issuer invalid. expected: https://auth.example.com`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Check
        the <Code>iss</Code> value in your auth provider&apos;s configuration.
        For multi-tenant setups, make sure you&apos;re validating against the
        correct tenant&apos;s issuer URL. Decode the token to see the actual{" "}
        <Code>iss</Code> value and compare it against your config.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        8. Clock Skew Issues
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        Distributed systems often have slight clock differences between machines.
        A token issued by Server A with <Code>exp</Code> set to 30 seconds from
        now might already appear expired to Server B if B&apos;s clock is 45
        seconds ahead. This also causes intermittent <Code>nbf</Code> and{" "}
        <Code>iat</Code> validation failures.
      </p>
      <CodeBlock title="Typical symptom">
        {`// Token works on one server but fails on another
// Or fails intermittently — sometimes valid, sometimes expired
TokenExpiredError: jwt expired
// Token exp: 1710787200, Server time: 1710787203 (3 seconds past)`}
      </CodeBlock>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">Fix:</strong> Use NTP
        to synchronize clocks across all services. Add a clock tolerance (30-60
        seconds) to your verification config. In Kubernetes, ensure all nodes
        have NTP configured at the host level.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How to Debug JWT Errors: Step-by-Step
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        When you hit a JWT error, resist the urge to change code first. Decode
        the token first to understand what you&apos;re working with.
      </p>

      <ol className="mt-6 space-y-6 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <div>
            <strong className="text-gray-900 dark:text-white">
              Decode the token without verification.
            </strong>{" "}
            Paste the raw JWT into our{" "}
            <Link
              href="/tools/jwt-decoder"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              JWT Decoder
            </Link>{" "}
            to see the header, payload, and signature. This works even if the
            token is expired or the signature is invalid &mdash; you&apos;re just
            reading the Base64-decoded contents.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <div>
            <strong className="text-gray-900 dark:text-white">
              Check the <Code>exp</Code> and <Code>iat</Code> timestamps.
            </strong>{" "}
            Convert them to human-readable dates. Is <Code>exp</Code> in the
            past? Was <Code>iat</Code> reasonable? A token with{" "}
            <Code>iat</Code> far in the future suggests a clock sync problem on
            the issuing server.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <div>
            <strong className="text-gray-900 dark:text-white">
              Verify the algorithm matches the key type.
            </strong>{" "}
            If the header says <Code>RS256</Code>, you need an RSA public key for
            verification &mdash; not an HMAC secret string. If it says{" "}
            <Code>HS256</Code>, you need the shared secret. Mixing these up is
            one of the most common causes of &quot;invalid signature&quot; errors.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <div>
            <strong className="text-gray-900 dark:text-white">
              Compare <Code>iss</Code> and <Code>aud</Code> claims against your
              config.
            </strong>{" "}
            Copy the exact strings from the decoded token and diff them against
            the values in your server configuration. Watch for trailing slashes,
            protocol differences (<Code>http</Code> vs <Code>https</Code>), and
            port numbers.
          </div>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <div>
            <strong className="text-gray-900 dark:text-white">
              Check for clock skew between services.
            </strong>{" "}
            Run <Code>date -u</Code> on both the token issuer and the verifier.
            Even a 30-second difference can cause intermittent failures with
            short-lived tokens. In containers, the host clock may drift if NTP
            is not configured.
          </div>
        </li>
      </ol>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Fixing JWT Errors in Code
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Here are practical patterns for handling JWT errors gracefully in the
        three most common server-side languages.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Node.js (jsonwebtoken)
      </h3>
      <CodeBlock title="Node.js — verify with error handling">
        {`import jwt from "jsonwebtoken";

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"],       // Whitelist allowed algorithms
    issuer: "https://auth.example.com",
    audience: "https://api.example.com",
    clockTolerance: 30,          // Allow 30 seconds of clock skew
  });
  // Token is valid — proceed with decoded.sub, decoded.role, etc.
} catch (err) {
  if (err.name === "TokenExpiredError") {
    // Token expired — prompt client to refresh
    return res.status(401).json({ error: "token_expired" });
  }
  if (err.name === "JsonWebTokenError") {
    // Invalid signature, malformed token, bad algorithm
    return res.status(401).json({ error: "invalid_token" });
  }
  if (err.name === "NotBeforeError") {
    // Token not yet active
    return res.status(401).json({ error: "token_not_active" });
  }
}`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Python (PyJWT)
      </h3>
      <CodeBlock title="Python — verify with error handling">
        {`import jwt
from jwt.exceptions import (
    ExpiredSignatureError,
    InvalidSignatureError,
    InvalidAudienceError,
    InvalidIssuerError,
    DecodeError,
    ImmatureSignatureError,
)

try:
    decoded = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=["HS256"],
        audience="https://api.example.com",
        issuer="https://auth.example.com",
        leeway=30,  # Allow 30 seconds of clock skew
    )
except ExpiredSignatureError:
    # Token has expired — trigger refresh flow
    return {"error": "token_expired"}, 401
except InvalidSignatureError:
    # Signature doesn't match — wrong key or tampered token
    return {"error": "invalid_signature"}, 401
except InvalidAudienceError:
    # aud claim doesn't match expected audience
    return {"error": "invalid_audience"}, 401
except InvalidIssuerError:
    # iss claim doesn't match expected issuer
    return {"error": "invalid_issuer"}, 401
except ImmatureSignatureError:
    # nbf claim is in the future
    return {"error": "token_not_active"}, 401
except DecodeError:
    # Malformed token — not valid Base64 or not 3 parts
    return {"error": "malformed_token"}, 401`}
      </CodeBlock>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Go (golang-jwt)
      </h3>
      <CodeBlock title="Go — verify with error handling">
        {`import (
    "errors"
    "github.com/golang-jwt/jwt/v5"
)

token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
    // Enforce algorithm — reject anything that isn't HS256
    if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
        return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
    }
    return []byte(secretKey), nil
},
    jwt.WithIssuer("https://auth.example.com"),
    jwt.WithAudience("https://api.example.com"),
    jwt.WithLeeway(30 * time.Second),
)

if err != nil {
    switch {
    case errors.Is(err, jwt.ErrTokenExpired):
        // Handle expired token
    case errors.Is(err, jwt.ErrSignatureInvalid):
        // Handle invalid signature
    case errors.Is(err, jwt.ErrTokenNotValidYet):
        // Handle nbf in the future
    default:
        // Handle malformed or other errors
    }
}`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        JWT Security Best Practices
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Fixing errors is one thing &mdash; preventing security vulnerabilities
        is another. Follow these rules to keep your JWT implementation secure:
      </p>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Never use <Code>alg: &quot;none&quot;</Code> in production.
            </strong>{" "}
            Always pass an explicit <Code>algorithms</Code> whitelist to your
            verify function so attackers cannot force an unsigned token through.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Always validate <Code>exp</Code>, <Code>iss</Code>, and{" "}
              <Code>aud</Code>.
            </strong>{" "}
            These three claims are your primary defense against token misuse.
            Skipping any one of them opens a window for token replay or
            cross-service attacks.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Use RS256 over HS256 for distributed systems.
            </strong>{" "}
            With HMAC (HS256), every service that verifies tokens must have the
            shared secret &mdash; a single compromised service exposes the key.
            RSA (RS256) lets you keep the private key on the auth server and
            distribute only the public key.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Rotate signing keys periodically.
            </strong>{" "}
            Use a JWKS (JSON Web Key Set) endpoint so consumers can fetch updated
            keys automatically. Include a <Code>kid</Code> (key ID) in the
            header so verifiers know which key to use during rotation.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Keep tokens short-lived.
            </strong>{" "}
            Access tokens should expire in 15 minutes or less. Use refresh tokens
            (7-day lifetime, stored securely) to issue new access tokens without
            forcing the user to log in again.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">
              Never put sensitive data in the payload.
            </strong>{" "}
            JWTs are encoded, not encrypted. Anyone can decode the payload with
            a{" "}
            <Link
              href="/tools/base64"
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Base64 decoder
            </Link>
            . Store only identifiers and permissions &mdash; never passwords,
            API keys, or personal data.
          </span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Running auth services that issue JWTs?
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.cloudways.com"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            Cloudways
          </a>{" "}
          gives you managed cloud hosting with built-in SSL, automated backups,
          and server-level firewalls &mdash; so your auth endpoints stay
          protected while you focus on your application logic. Deploy on
          DigitalOcean, AWS, or GCP without managing servers yourself.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Debug Your Tokens Now
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The fastest way to diagnose a JWT error is to look at the token itself.
        Paste any JWT into our{" "}
        <Link
          href="/tools/jwt-decoder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Decoder
        </Link>{" "}
        to instantly see the header, payload, expiration status, and signature
        &mdash; all decoded locally in your browser. Need to create test tokens?
        Use the{" "}
        <Link
          href="/tools/jwt-builder"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          JWT Builder
        </Link>{" "}
        to generate signed tokens with custom claims, algorithms, and
        expiration. You can also use the{" "}
        <Link
          href="/tools/base64"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Base64 Encoder
        </Link>{" "}
        to manually decode individual JWT segments, or the{" "}
        <Link
          href="/tools/hash-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Hash Generator
        </Link>{" "}
        to explore the SHA-256 algorithm that underpins JWT signatures.
      </p>
    </>
  );
}
