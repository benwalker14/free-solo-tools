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

export default function PasswordSecurityGuide() {
  return (
    <>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Password security affects both sides of the stack &mdash; the passwords
        users create and the way developers store them. This guide covers what
        makes a password strong, how modern attacks work, and the hashing and
        storage practices every developer should follow.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        What Makes a Password Strong
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Password strength comes down to one thing: <strong className="text-gray-900 dark:text-white">entropy</strong> &mdash;
        how many possible combinations an attacker has to try. Length matters
        far more than complexity:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Password
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Entropy (bits)
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Time to Crack
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>P@ssw0rd</Code></td>
              <td className="py-3 pr-4">~30</td>
              <td className="py-3">Seconds (dictionary attack)</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>Tr0ub4dor&3</Code></td>
              <td className="py-3 pr-4">~28</td>
              <td className="py-3">Minutes</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>correct horse battery staple</Code></td>
              <td className="py-3 pr-4">~44</td>
              <td className="py-3">Centuries</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>kX9!mL2$pQ7@vR4&</Code></td>
              <td className="py-3 pr-4">~98</td>
              <td className="py-3">Heat death of universe</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        A 16-character random password has more entropy than a short &ldquo;complex&rdquo;
        password with special characters. Passphrases (random words strung
        together) are both strong and memorable.
      </p>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        How Passwords Get Cracked
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Understanding attack methods helps you understand why certain
        practices exist:
      </p>
      <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Brute force</strong>{" "}
            &mdash; try every possible combination. GPUs can test billions of
            simple hashes per second.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Dictionary attack</strong>{" "}
            &mdash; try common passwords and word lists. &ldquo;password123&rdquo;
            falls in milliseconds.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Credential stuffing</strong>{" "}
            &mdash; use leaked credentials from one breach to access other
            services. Works because people reuse passwords.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Rainbow tables</strong>{" "}
            &mdash; precomputed hash-to-password mappings. Defeated by salting
            (adding random data before hashing).
          </span>
        </li>
      </ul>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        For Users: Password Best Practices
      </h2>
      <ol className="mt-4 space-y-3 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            1
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Use a password manager.</strong>{" "}
            Generate unique, random passwords for every account. You only need
            to remember one master password.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            2
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Make passwords long.</strong>{" "}
            16+ characters. Prefer random characters or 4+ word passphrases.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            3
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Never reuse passwords.</strong>{" "}
            One breach exposes every account that shares the same password.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            4
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Enable two-factor authentication (2FA).</strong>{" "}
            Even if your password is compromised, 2FA blocks the attacker. Use
            an authenticator app (TOTP) over SMS when possible.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
            5
          </span>
          <span>
            <strong className="text-gray-900 dark:text-white">Check for breaches.</strong>{" "}
            Services like Have I Been Pwned let you check if your email or
            passwords have appeared in known data breaches.
          </span>
        </li>
      </ol>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        For Developers: Hashing and Storage
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        The golden rule: <strong className="text-gray-900 dark:text-white">never store passwords in plaintext.</strong>{" "}
        Always hash them with a purpose-built password hashing function.
      </p>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Hashing vs Encryption
      </h3>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Hashing</strong> is
            one-way. You can verify a password matches the hash, but you can&apos;t
            recover the original. This is what you want for passwords.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>
            <strong className="text-gray-900 dark:text-white">Encryption</strong> is
            two-way. If someone gets the key, they can decrypt everything. Not
            suitable for password storage.
          </span>
        </li>
      </ul>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Use the Right Algorithm
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        General-purpose hash functions like SHA-256 are too fast &mdash; an
        attacker can test billions of guesses per second. Use algorithms
        designed to be slow:
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Algorithm
              </th>
              <th className="py-3 pr-4 text-left font-semibold text-gray-900 dark:text-white">
                Recommendation
              </th>
              <th className="py-3 text-left font-semibold text-gray-900 dark:text-white">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 dark:text-gray-400">
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>Argon2id</Code></td>
              <td className="py-3 pr-4">Best choice</td>
              <td className="py-3">Winner of the Password Hashing Competition. Memory-hard.</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>bcrypt</Code></td>
              <td className="py-3 pr-4">Great</td>
              <td className="py-3">Battle-tested, widely supported. Cost factor 12+.</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>scrypt</Code></td>
              <td className="py-3 pr-4">Good</td>
              <td className="py-3">Memory-hard. Used by some crypto systems.</td>
            </tr>
            <tr className="border-b border-gray-100 dark:border-gray-800/50">
              <td className="py-3 pr-4"><Code>PBKDF2</Code></td>
              <td className="py-3 pr-4">Acceptable</td>
              <td className="py-3">NIST-approved but not memory-hard. 600K+ iterations.</td>
            </tr>
            <tr>
              <td className="py-3 pr-4"><Code>MD5 / SHA-*</Code></td>
              <td className="py-3 pr-4">Never</td>
              <td className="py-3">Way too fast. Billions of hashes/second on GPU.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        Code Examples
      </h3>
      <CodeBlock title="Node.js (bcrypt)">
        {`import bcrypt from "bcrypt";

// Hash a password (cost factor 12)
const hash = await bcrypt.hash(password, 12);
// Store 'hash' in your database

// Verify a password
const isValid = await bcrypt.compare(password, hash);`}
      </CodeBlock>
      <CodeBlock title="Python (Argon2)">
        {`from argon2 import PasswordHasher

ph = PasswordHasher()

# Hash a password
hash = ph.hash(password)
# Store 'hash' in your database

# Verify a password
try:
    ph.verify(hash, password)
except VerifyMismatchError:
    # Invalid password
    pass`}
      </CodeBlock>
      <CodeBlock title="Go (bcrypt)">
        {`import "golang.org/x/crypto/bcrypt"

// Hash a password
hash, err := bcrypt.GenerateFromPassword(
    []byte(password), 12,
)

// Verify a password
err := bcrypt.CompareHashAndPassword(hash, []byte(password))
// err == nil means valid`}
      </CodeBlock>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Implementation Checklist
      </h2>
      <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Hash passwords with Argon2id or bcrypt (never MD5/SHA)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Enforce a minimum length (12+ characters), not complexity rules</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Check passwords against known breached lists (HIBP API)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Offer and encourage 2FA (TOTP authenticator apps)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Rate-limit login attempts (5 per minute per IP/account)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Never log, email, or display passwords</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Use HTTPS everywhere &mdash; passwords in plaintext over HTTP are trivially intercepted</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-600" />
          <span>Store secrets (API keys, database passwords) in environment variables, not code</span>
        </li>
      </ul>

      <div className="my-12 rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/30">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Secure hosting matters too
        </p>
        <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
          <a
            href="https://www.cloudways.com/"
            target="_blank"
            rel="noopener sponsored"
            className="font-medium underline hover:no-underline"
          >
            Cloudways
          </a>{" "}
          provides managed hosting with built-in SSL, automated backups,
          OS-level firewalls, and two-factor authentication. Deploy on
          DigitalOcean, AWS, or GCP without managing servers yourself.
        </p>
      </div>

      <h2 className="mt-12 mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Generate Strong Passwords
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Use our{" "}
        <Link
          href="/tools/password-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Password Generator
        </Link>{" "}
        to create cryptographically secure passwords with configurable length,
        character sets, and entropy estimation. To verify hash outputs, try the{" "}
        <Link
          href="/tools/hash-generator"
          className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          Hash Generator
        </Link>
        . Both tools run entirely in your browser &mdash; your passwords never
        leave your device.
      </p>
    </>
  );
}
