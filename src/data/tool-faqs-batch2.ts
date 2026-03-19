import type { FAQ } from "./tool-faqs";

export const toolFaqsBatch2: Record<string, FAQ[]> = {
  "color-converter": [
    {
      question: "How do I convert a HEX color to RGB?",
      answer:
        "Enter your HEX color code (e.g., #3B82F6) into the input field and the tool instantly displays the equivalent RGB, HSL, and other color format values. HEX codes represent colors using hexadecimal values for red, green, and blue channels. Each pair of hex digits maps to a 0-255 RGB value. For example, #FF0000 converts to RGB(255, 0, 0) because FF in hexadecimal equals 255 in decimal. The conversion is purely mathematical and happens entirely in your browser, so no data is sent to any server.",
    },
    {
      question: "What is the difference between HEX, RGB, and HSL color formats?",
      answer:
        "HEX, RGB, and HSL are three ways to represent the same colors. HEX uses a six-character hexadecimal string prefixed with # (e.g., #3B82F6) and is the most common format in CSS and web design. RGB specifies red, green, and blue channel values from 0 to 255 (e.g., rgb(59, 130, 246)). HSL defines colors by hue (0-360 degrees), saturation (0-100%), and lightness (0-100%), making it more intuitive for adjusting color properties. All three formats can represent the same 16.7 million colors. Choose HEX for shorthand CSS, RGB for programmatic manipulation, and HSL when you need to adjust brightness or saturation.",
    },
    {
      question: "Can I convert colors with transparency (alpha channel)?",
      answer:
        "Yes, this tool supports alpha channel conversions across formats. You can input 8-digit HEX codes (e.g., #3B82F680), RGBA values (e.g., rgba(59, 130, 246, 0.5)), or HSLA values (e.g., hsla(217, 91%, 60%, 0.5)). The alpha channel represents opacity on a scale from 0 (fully transparent) to 1 (fully opaque). In 8-digit HEX, the last two characters encode the alpha value. The tool converts the alpha value accurately between all supported formats so you can use whichever notation your project requires.",
    },
  ],
  "markdown-preview": [
    {
      question: "How do I preview Markdown in real time?",
      answer:
        "Type or paste your Markdown text into the editor pane on the left and the rendered HTML preview appears instantly on the right. The tool supports standard Markdown syntax including headings, bold, italic, links, images, code blocks, tables, and lists. It uses GitHub Flavored Markdown (GFM), which adds support for strikethrough, task lists, and fenced code blocks with syntax highlighting. All processing happens in your browser, so your content is never sent to a server. This makes it safe to preview sensitive documentation, README files, or any private content.",
    },
    {
      question: "What Markdown syntax is supported?",
      answer:
        "This tool supports GitHub Flavored Markdown (GFM), which includes all standard Markdown features plus common extensions. Supported syntax includes headings (# to ######), bold (**text**), italic (*text*), links, images, ordered and unordered lists, blockquotes, horizontal rules, inline code, and fenced code blocks with language-specific syntax highlighting. GFM extensions add strikethrough (~~text~~), task lists (- [x]), tables with pipe syntax, and autolinked URLs. You can also use raw HTML within your Markdown for elements that Markdown syntax does not cover.",
    },
    {
      question: "Is my data safe when using this Markdown preview online?",
      answer:
        "Yes, your data stays completely private. This Markdown preview tool runs entirely in your browser using client-side JavaScript. No text you type or paste is ever transmitted to a server, stored in a database, or logged anywhere. The Markdown-to-HTML conversion happens locally using a JavaScript parsing library. You can verify this by opening your browser's network inspector while using the tool. This makes it safe to preview private documentation, internal README files, API docs, or any content containing sensitive information.",
    },
  ],
  "lorem-ipsum": [
    {
      question: "What is Lorem Ipsum placeholder text?",
      answer:
        "Lorem Ipsum is dummy text used in design and typesetting to fill layouts before final content is available. It originates from a scrambled passage of De Finibus Bonorum et Malorum by Cicero, written in 45 BC. Designers use it because it has a roughly normal distribution of letters and word lengths, making it visually similar to real English text without distracting readers with meaningful content. This helps stakeholders focus on layout, typography, and visual hierarchy rather than reading the copy. Lorem Ipsum has been the industry standard placeholder text since the 1500s.",
    },
    {
      question: "How do I generate a specific amount of placeholder text?",
      answer:
        "Select your desired output type (paragraphs, sentences, or words) and specify the quantity you need. The tool generates grammatically structured Latin-based placeholder text that mimics natural language patterns. For web design mockups, 2-3 paragraphs typically fill a content section. For testing text truncation or overflow, generating by word count gives you precise control. The generated text always begins with the traditional \"Lorem ipsum dolor sit amet\" opening, which is a convention in the design industry. All generation happens in your browser, so you can produce as much text as you need without any limits.",
    },
    {
      question: "Are there alternatives to Lorem Ipsum for placeholder text?",
      answer:
        "Yes, several alternatives exist, though Lorem Ipsum remains the most widely used. Some designers prefer Hipster Ipsum, Bacon Ipsum, or Cupcake Ipsum for a more casual tone during mockups. For technical projects, you might use real representative content instead of placeholder text to better test line lengths and layout behavior. The main advantage of Lorem Ipsum over English placeholder text is that reviewers do not get distracted reading the filler content. However, using real content during design helps catch layout issues with varying text lengths early in the process.",
    },
  ],
  "number-base-converter": [
    {
      question: "How do I convert binary to decimal?",
      answer:
        "Enter your binary number (e.g., 11010110) in the binary input field and the tool instantly shows the decimal, octal, and hexadecimal equivalents. Binary-to-decimal conversion works by multiplying each digit by 2 raised to its positional power, starting from 0 on the right. For example, binary 1101 equals (1x8) + (1x4) + (0x2) + (1x1) = 13 in decimal. This tool handles large numbers and shows the conversion in real time. It is useful for programming, networking, and understanding how computers store data at the bit level.",
    },
    {
      question: "What are the common number bases used in programming?",
      answer:
        "The four most common number bases in programming are binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Binary uses only 0 and 1, representing how computers process data at the hardware level. Octal uses digits 0-7 and appears in Unix file permissions (e.g., chmod 755). Decimal is the standard human-readable number system. Hexadecimal uses 0-9 and A-F, commonly used for memory addresses, color codes (#FF5733), and compact binary representation. Each hex digit maps to exactly 4 binary digits, making hex a convenient shorthand for binary values.",
    },
    {
      question: "Why do programmers use hexadecimal instead of binary?",
      answer:
        "Programmers use hexadecimal because it provides a compact, human-readable representation of binary data. Each hexadecimal digit maps to exactly four binary bits, so a single hex digit replaces four binary digits. For example, the binary value 11111111 becomes FF in hex, which is much easier to read and remember. This makes hex ideal for memory addresses, color codes, MAC addresses, and byte-level data inspection. An 8-bit byte ranges from 00 to FF in hex versus 00000000 to 11111111 in binary. Hex is essentially a convenient shorthand that maintains a direct, easy-to-compute relationship with the underlying binary data.",
    },
  ],
  "cron-parser": [
    {
      question: "How do I read a cron expression?",
      answer:
        "A standard cron expression has five fields separated by spaces: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday). For example, \"30 9 * * 1-5\" means \"at 9:30 AM every Monday through Friday.\" The asterisk (*) means \"every value,\" a comma separates multiple values (1,15 means the 1st and 15th), a hyphen defines ranges (1-5), and a slash sets intervals (*/5 means every 5 units). Paste any cron expression into this tool and it translates it into plain English with the next scheduled run times.",
    },
    {
      question: "What is the difference between 5-field and 6-field cron expressions?",
      answer:
        "Standard Unix cron uses five fields: minute, hour, day of month, month, and day of week. Some systems like Quartz Scheduler and Spring add a sixth field for seconds at the beginning, making the format: second, minute, hour, day of month, month, day of week. A few systems also support a seventh field for year. This tool parses both 5-field and 6-field formats automatically. If you are using Linux crontab, use the 5-field format. If you are working with Java-based schedulers like Quartz or Spring Task Scheduling, you likely need the 6-field format with seconds.",
    },
    {
      question: "How do I schedule a cron job to run every 5 minutes?",
      answer:
        "Use the cron expression \"*/5 * * * *\" to run a job every 5 minutes. The */5 in the minute field means \"every 5th minute\" starting from 0, so the job runs at minutes 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, and 55 of every hour. The asterisks in the remaining fields mean every hour, every day of the month, every month, and every day of the week. You can adjust the interval by changing the number after the slash. For example, */15 runs every 15 minutes, and */30 runs every 30 minutes (at :00 and :30 past each hour).",
    },
  ],
  "word-counter": [
    {
      question: "How does the word counter calculate reading time?",
      answer:
        "Reading time is estimated by dividing the total word count by an average reading speed of 200-250 words per minute. This is the commonly accepted average for adult readers of English non-fiction content. For example, a 1,000-word article takes approximately 4-5 minutes to read. The estimate assumes standard prose. Technical content, code, or dense academic writing may take longer. Speaking time for presentations is typically estimated at 130-150 words per minute, which is slower than silent reading. This tool provides both estimates so you can plan blog posts, essays, or presentations accordingly.",
    },
    {
      question: "Does the word counter include spaces and punctuation in the character count?",
      answer:
        "Yes, this tool provides both character counts: with spaces and without spaces. The \"characters with spaces\" count includes every character in the text including letters, numbers, punctuation, and whitespace. The \"characters without spaces\" count excludes all space characters. This distinction matters for different use cases. Twitter and most social media platforms count all characters including spaces. Some academic or publishing requirements specify character counts without spaces. The tool also counts sentences by detecting sentence-ending punctuation marks and counts paragraphs based on line breaks in your text.",
    },
    {
      question: "Is my text data safe when using an online word counter?",
      answer:
        "Yes, this word counter processes all text entirely in your browser. No text you enter is transmitted to any server, stored in any database, or accessible to anyone else. The counting algorithms run locally using JavaScript, so your data never leaves your device. You can verify this by disconnecting from the internet and confirming the tool still works. This makes it safe for counting words in confidential documents, unpublished manuscripts, private emails, legal documents, or any sensitive text content. Your browser tab is the only place where your text exists.",
    },
  ],
  "gradient-generator": [
    {
      question: "How do I create a CSS gradient?",
      answer:
        "Select your gradient type (linear or radial), choose two or more color stops, and adjust the angle or direction. The tool generates the CSS code in real time as you make changes. You can click anywhere on the gradient preview bar to add color stops, drag them to reposition, and click on each stop to change its color. The generated CSS uses the standard background property syntax like \"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\" which works in all modern browsers. Copy the CSS code and paste it directly into your stylesheet.",
    },
    {
      question: "What is the difference between linear and radial CSS gradients?",
      answer:
        "Linear gradients transition colors along a straight line at a specified angle. For example, a 90-degree linear gradient flows from left to right. Radial gradients transition colors outward from a center point in an elliptical or circular shape. Linear gradients are most common for backgrounds, buttons, and section dividers. Radial gradients work well for spotlight effects, glowing elements, and circular design patterns. CSS also supports conic gradients, which transition colors around a center point like a color wheel. Each type accepts multiple color stops to create complex multi-color transitions.",
    },
    {
      question: "How do I make a gradient with more than two colors?",
      answer:
        "Add additional color stops to create multi-color gradients. In this tool, click on the gradient bar to add new stops, then assign each stop a color and position percentage. In CSS, list the extra colors in the gradient function: \"background: linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #0000ff 100%);\" creates a red-to-green-to-blue gradient. The percentage values control where each color appears along the gradient. You can add as many color stops as you need. For smooth transitions, space stops evenly. For sharp color bands, place two different colors at the same percentage position.",
    },
  ],
  "xml-formatter": [
    {
      question: "How do I format and beautify XML?",
      answer:
        "Paste your unformatted XML into the input area and the tool automatically formats it with proper indentation, line breaks, and syntax highlighting. Minified or single-line XML becomes readable with nested elements clearly indented. You can customize the indentation size (2 or 4 spaces, or tabs) and choose whether to preserve or collapse empty elements. The formatter also validates your XML structure, highlighting any syntax errors like unclosed tags, mismatched elements, or invalid characters. This is useful for inspecting API responses, configuration files, SOAP messages, or any XML data that needs to be human-readable.",
    },
    {
      question: "What is the difference between well-formed and valid XML?",
      answer:
        "Well-formed XML follows the basic syntax rules: it has a single root element, all tags are properly opened and closed, tags are correctly nested, attribute values are quoted, and element names follow naming rules. Valid XML is well-formed and also conforms to a schema definition (DTD, XSD, or RelaxNG) that specifies which elements and attributes are allowed, their data types, and their structural relationships. All valid XML is well-formed, but not all well-formed XML is valid. This tool checks for well-formedness by default, catching syntax errors like unclosed tags and mismatched nesting.",
    },
    {
      question: "How do I minify XML to reduce file size?",
      answer:
        "Use the minify option to remove all unnecessary whitespace, line breaks, and indentation from your XML. Minification reduces file size by stripping formatting that is only needed for human readability. The minified XML remains structurally identical and functionally equivalent. This is useful for reducing payload sizes in API responses, configuration files, and data transfers. Minification typically reduces XML file size by 10-30% depending on how much formatting the original contained. For further size reduction, consider enabling GZIP or Brotli compression on your server, which compresses XML data significantly more than whitespace removal alone.",
    },
  ],
  "image-base64": [
    {
      question: "How do I convert an image to Base64?",
      answer:
        "Drag and drop an image file or click to browse, and the tool instantly converts it to a Base64-encoded string. You can copy the raw Base64 string or the complete data URI (e.g., data:image/png;base64,...) ready to embed directly in HTML img tags or CSS background properties. Base64 encoding converts binary image data into ASCII text characters, increasing the size by approximately 33%. This is useful for embedding small images directly in HTML, CSS, or JSON without requiring separate HTTP requests. The conversion happens entirely in your browser, so your images are never uploaded to any server.",
    },
    {
      question: "When should I use Base64-encoded images instead of regular image files?",
      answer:
        "Use Base64-encoded images for small assets under 10KB, such as icons, tiny logos, or simple UI graphics. Embedding these inline eliminates HTTP requests, which can improve initial page load on HTTP/1.1 connections. Avoid Base64 for larger images because the encoding increases file size by about 33%, the data cannot be cached separately from the HTML/CSS, and it blocks page rendering until the entire encoded string is parsed. For images over 10KB, serving them as regular files with proper caching headers is more efficient. With HTTP/2 and HTTP/3, the benefit of reducing requests is further diminished.",
    },
    {
      question: "Is my image data safe when converting to Base64 online?",
      answer:
        "Yes, your images remain completely private. This tool converts images to Base64 using the browser's built-in FileReader API and Canvas API. No image data is uploaded to any server or transmitted over the network. The entire conversion process happens locally in your browser using JavaScript. You can verify this by checking the network tab in your browser developer tools while converting an image. This makes it safe to convert screenshots, private photos, confidential documents, or any sensitive images. Once you close or refresh the page, the image data is cleared from browser memory.",
    },
  ],
  "color-palette": [
    {
      question: "How do color theory algorithms generate harmonious palettes?",
      answer:
        "Color theory algorithms generate palettes by selecting colors at specific angular relationships on the color wheel. Complementary colors sit 180 degrees apart (e.g., blue and orange), creating high contrast. Analogous colors are adjacent on the wheel (within 30 degrees), producing subtle harmony. Triadic schemes use three colors spaced 120 degrees apart for vibrant, balanced palettes. Split-complementary uses one base color plus two colors adjacent to its complement. Tetradic schemes use four colors forming a rectangle on the wheel. This tool applies these mathematical relationships in the HSL color space, adjusting saturation and lightness to ensure the generated colors work well together.",
    },
    {
      question: "What is the difference between complementary, analogous, and triadic color schemes?",
      answer:
        "Complementary schemes pair two colors opposite each other on the color wheel (180 degrees apart), like blue and orange. They create strong visual contrast and are ideal for call-to-action elements or designs needing bold emphasis. Analogous schemes use 2-4 colors that sit next to each other on the wheel, like blue, blue-green, and green. They feel harmonious and cohesive, working well for nature themes and calm designs. Triadic schemes use three colors equally spaced at 120-degree intervals, like red, blue, and yellow. They provide vibrant variety while maintaining balance. Each scheme suits different design goals.",
    },
    {
      question: "How do I create an accessible color palette for web design?",
      answer:
        "Start by generating a base palette and then verify that text-to-background color combinations meet WCAG 2.1 contrast ratio requirements: at least 4.5:1 for normal text (AA) and 7:1 for enhanced compliance (AAA). Large text (18px bold or 24px regular) requires a minimum 3:1 ratio. Use a contrast checker tool to test each foreground and background pair. Ensure your palette includes at least one very dark color for text and one very light color for backgrounds. Avoid conveying information through color alone, as this excludes colorblind users. Test your palette with a color blindness simulator to verify usability across vision types.",
    },
  ],
  "html-markdown": [
    {
      question: "How do I convert HTML to Markdown?",
      answer:
        "Paste your HTML code into the input area and the tool converts it to clean Markdown syntax instantly. HTML tags are mapped to their Markdown equivalents: <h1> becomes #, <strong> becomes **, <a> becomes [text](url), <img> becomes ![alt](src), and so on. Lists, blockquotes, code blocks, and tables are all handled correctly. The converter strips HTML-only elements that have no Markdown equivalent and preserves the content structure. This is useful for migrating blog posts from HTML-based CMS platforms to Markdown-based systems like Jekyll, Hugo, Gatsby, or any static site generator.",
    },
    {
      question: "What HTML elements can be converted to Markdown?",
      answer:
        "Most common HTML elements have direct Markdown equivalents. Headings (h1-h6) convert to # symbols. Paragraphs, bold (<strong>), italic (<em>), links (<a>), and images (<img>) convert cleanly. Lists (<ul>, <ol>, <li>) become Markdown lists. Code elements (<code>, <pre>) become backtick or fenced code blocks. Tables convert to pipe-delimited Markdown tables. Blockquotes (<blockquote>) become > prefixed lines. However, some HTML elements like <div>, <span>, <style>, forms, and interactive elements have no Markdown equivalent and are either stripped or passed through as raw HTML, depending on the converter settings.",
    },
    {
      question: "Is my data safe when converting HTML to Markdown online?",
      answer:
        "Yes, all conversion happens entirely in your browser. No HTML or Markdown content is sent to any server. The conversion uses client-side JavaScript libraries to parse the HTML DOM and generate Markdown output locally. This means your content never leaves your device and is not stored or logged anywhere. You can verify this by checking the network tab in your browser developer tools while performing a conversion. This makes the tool safe for converting proprietary content, internal documentation, client work, or any HTML containing sensitive information.",
    },
  ],
  "yaml-formatter": [
    {
      question: "How do I validate YAML syntax?",
      answer:
        "Paste your YAML into the input area and the tool instantly parses it, highlighting any syntax errors with line numbers and descriptive messages. Common YAML errors include incorrect indentation (YAML uses spaces, not tabs), missing colons after keys, unquoted special characters, and inconsistent list formatting. The validator checks that your document follows the YAML 1.2 specification and can be parsed without errors. Valid YAML is formatted with proper indentation for easy reading. This is especially useful for validating Kubernetes manifests, Docker Compose files, CI/CD pipeline configs, and application configuration files.",
    },
    {
      question: "What are common YAML syntax errors?",
      answer:
        "The most common YAML errors are indentation mistakes, since YAML uses whitespace indentation to define structure. Using tabs instead of spaces causes parse failures in most YAML parsers. Other frequent errors include forgetting the space after a colon in key-value pairs (name:value instead of name: value), unquoted strings containing special characters like colons, brackets, or the @ symbol, and duplicate keys in the same mapping. Multiline strings are another common source of errors due to confusion between block scalar indicators (| for literal, > for folded). Boolean values like yes, no, true, and false are also parsed unexpectedly when not quoted.",
    },
    {
      question: "What is the difference between YAML and JSON?",
      answer:
        "YAML and JSON are both data serialization formats, but they differ in syntax and use cases. YAML uses indentation-based structure, supports comments (# prefix), and is more human-readable. JSON uses braces and brackets, does not support comments, and is more compact. YAML is a superset of JSON, meaning valid JSON is also valid YAML. YAML is preferred for configuration files (Kubernetes, Docker Compose, CI/CD) because of its readability and comment support. JSON is preferred for APIs and data interchange because every major programming language has native JSON parsing. YAML supports advanced features like anchors and aliases for reusing values.",
    },
  ],
  "json-path": [
    {
      question: "What is JSONPath and how does it work?",
      answer:
        "JSONPath is a query language for extracting data from JSON documents, similar to XPath for XML. It uses dot notation or bracket notation to navigate the JSON structure. The root element is represented by $, child elements by dots ($.store.book), array indices by brackets ($[0]), wildcards by asterisks ($.store.*), and recursive descent by double dots ($..price). Filter expressions like $..book[?(@.price<10)] select elements matching conditions. This tool lets you test JSONPath expressions against your JSON data in real time, showing matched results instantly. It is useful for debugging API responses and building data extraction queries.",
    },
    {
      question: "How do I select nested values in a JSON document?",
      answer:
        "Use dot notation to traverse nested objects: $.parent.child.grandchild selects a specific nested value. For arrays, use bracket notation with an index: $.users[0].name gets the name of the first user. The recursive descent operator (..) searches all levels: $..name finds every name field regardless of depth. Wildcards select all children: $.users[*].email gets all email addresses. You can combine these operators for complex queries like $.store.book[*].author to get all authors from a book array nested under a store object. Filter expressions like $.users[?(@.age>21)] select elements matching conditions.",
    },
    {
      question: "Is my JSON data safe when testing JSONPath expressions online?",
      answer:
        "Yes, your JSON data is processed entirely in your browser. The JSONPath evaluation engine runs locally using JavaScript, and no data is sent to any server. You can safely test expressions against API responses, database exports, configuration files, or any JSON containing sensitive information. The tool does not store, log, or transmit your data in any way. You can verify this by monitoring network requests in your browser developer tools while using the tool. This client-side approach means the tool works offline after the page loads, and your data remains completely private.",
    },
  ],
  "svg-optimizer": [
    {
      question: "How does SVG optimization reduce file size?",
      answer:
        "SVG optimization reduces file size by removing unnecessary metadata, comments, editor-specific data, hidden elements, and redundant attributes. Tools like Illustrator and Figma add extra information to SVGs that browsers do not need for rendering. The optimizer also rounds numeric precision, merges overlapping paths, removes empty groups and containers, collapses unnecessary transforms, and converts inline styles to more compact attributes. These changes typically reduce SVG file size by 20-60% without any visible change in rendering. The optimized SVG renders identically in all browsers but loads faster and uses less bandwidth.",
    },
    {
      question: "Will optimizing my SVG change how it looks?",
      answer:
        "No, properly optimized SVGs render identically to the originals in all modern browsers. The optimizer only removes data that does not affect visual output, such as editor metadata, XML namespaces not used by browsers, comments, and hidden elements. Numeric precision is reduced to a level below the visible threshold (typically 2-3 decimal places). However, aggressive optimization settings that remove viewBox attributes, merge paths, or strip IDs referenced by CSS may cause issues. This tool shows a before-and-after preview so you can verify the output looks correct before using the optimized version.",
    },
    {
      question: "What causes SVG files to be unnecessarily large?",
      answer:
        "SVG files become bloated primarily from design tool metadata. Adobe Illustrator adds proprietary XML namespaces, layer names, and generator comments. Figma and Sketch embed their own metadata for round-trip editing. Other causes include excessive decimal precision in coordinates (12 decimal places when 2 suffice), inline styles that could be attributes, unoptimized path data with redundant commands, embedded fonts or base64-encoded images, unused gradient and filter definitions, and empty group elements. Complex illustrations may also contain hidden layers or elements outside the viewBox that are invisible but still in the file. Running an SVG optimizer addresses all of these issues.",
    },
  ],
  "image-compressor": [
    {
      question: "How do I compress images without losing quality?",
      answer:
        "Use the quality slider to find the optimal balance between file size and visual quality. Start at 80-85% quality for JPEG and WebP formats, which typically reduces file size by 50-70% with minimal visible difference. The tool shows a side-by-side preview so you can compare the original and compressed versions. PNG compression is lossless by default, reducing size through better encoding without any quality loss. For photographs, JPEG or WebP at 80% quality is usually indistinguishable from the original. For graphics with sharp edges or text, use PNG to avoid compression artifacts.",
    },
    {
      question: "What is the difference between JPEG, WebP, and PNG compression?",
      answer:
        "JPEG uses lossy compression optimized for photographs, achieving small file sizes by discarding visual details the human eye is less sensitive to. WebP is a modern format from Google that supports both lossy and lossless compression, typically producing files 25-35% smaller than JPEG at equivalent quality. PNG uses lossless compression, preserving every pixel exactly, making it ideal for graphics with sharp edges, text, transparency, or flat colors. For web use, WebP offers the best size-to-quality ratio with 97% browser support. Use JPEG as a fallback for older browsers and PNG when you need transparency or pixel-perfect accuracy.",
    },
    {
      question: "Is my image data safe when compressing images online?",
      answer:
        "Yes, this tool compresses images entirely in your browser using the Canvas API and client-side JavaScript. No images are uploaded to any server. The compression algorithms run locally on your device, and the original and compressed images exist only in your browser's memory. When you close or refresh the page, all image data is cleared. You can verify this by checking the network tab in your browser developer tools during compression. This makes it safe to compress private photos, confidential screenshots, proprietary design assets, or any sensitive images without privacy concerns.",
    },
  ],
  "box-shadow": [
    {
      question: "How do I create a CSS box shadow?",
      answer:
        "Adjust the horizontal offset, vertical offset, blur radius, spread radius, and color using the visual controls. The tool generates the CSS box-shadow property in real time. A typical subtle shadow uses values like \"box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)\" where 0 is the horizontal offset, 4px pushes the shadow down, 6px is the blur, and -1px spread shrinks the shadow. You can add multiple shadow layers for depth effects and toggle the inset keyword for inner shadows. Copy the generated CSS and apply it directly to any HTML element in your stylesheet.",
    },
    {
      question: "What do the box-shadow values mean in CSS?",
      answer:
        "The CSS box-shadow property takes up to six values. Horizontal offset (required) moves the shadow left (negative) or right (positive). Vertical offset (required) moves it up (negative) or down (positive). Blur radius (optional, default 0) controls how soft the shadow edges are. Spread radius (optional, default 0) expands (positive) or shrinks (negative) the shadow size. Color (optional) sets the shadow color, commonly using rgba for transparency. The inset keyword (optional) places the shadow inside the element. Example: \"box-shadow: 4px 4px 8px 0px rgba(0,0,0,0.2)\" creates a subtle drop shadow offset 4 pixels right and down.",
    },
    {
      question: "How do I add multiple box shadows to one element?",
      answer:
        "Separate multiple shadow definitions with commas in a single box-shadow declaration. For example: \"box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);\" combines two shadows for a Material Design-style elevation. Shadows are rendered in stack order, with the first shadow on top. Layering multiple subtle shadows creates more realistic depth than a single heavy shadow. A common pattern uses a tight, darker shadow for definition near the element and a larger, lighter shadow for ambient depth. This tool lets you add, remove, and reorder shadow layers visually and see the combined result in the live preview.",
    },
  ],
  "contrast-checker": [
    {
      question: "What is WCAG 2.1 color contrast and why does it matter?",
      answer:
        "WCAG 2.1 color contrast refers to the luminance ratio between foreground text and its background, measured on a scale from 1:1 (no contrast) to 21:1 (maximum contrast, black on white). The Web Content Accessibility Guidelines require minimum contrast ratios so that people with low vision or color vision deficiencies can read text. Level AA requires 4.5:1 for normal text and 3:1 for large text (18px bold or 24px regular). Level AAA requires 7:1 for normal text and 4.5:1 for large text. Meeting these standards is often a legal requirement under accessibility laws like ADA, Section 508, and the European Accessibility Act.",
    },
    {
      question: "How do I check if my colors meet WCAG accessibility standards?",
      answer:
        "Enter your foreground (text) color and background color using HEX, RGB, or HSL values. The tool calculates the contrast ratio and shows whether the combination passes WCAG 2.1 Level AA and Level AAA for both normal and large text sizes. If a combination fails, try darkening the text color or lightening the background (or vice versa) until the required ratio is met. The tool displays the exact contrast ratio so you can see how close you are to passing. A common mistake is using light gray text on white backgrounds. Even subtle gray text like #767676 on white just barely passes AA at 4.54:1.",
    },
    {
      question: "What is the minimum contrast ratio for accessible text?",
      answer:
        "The minimum contrast ratio for accessible text under WCAG 2.1 Level AA is 4.5:1 for normal-sized text (under 18px bold or under 24px regular). Large text requires at least 3:1. For the stricter Level AAA standard, normal text needs 7:1 and large text needs 4.5:1. Non-text elements like form input borders, icons, and graphical objects require at least 3:1 against adjacent colors. These ratios are calculated using a formula based on the relative luminance of the two colors. Pure black (#000000) on white (#FFFFFF) has the maximum ratio of 21:1. Most accessibility audits and legal requirements reference the Level AA thresholds.",
    },
  ],
  "flexbox-generator": [
    {
      question: "How do I use CSS Flexbox to center elements?",
      answer:
        "Apply display: flex to the parent container, then set justify-content: center for horizontal centering and align-items: center for vertical centering. To center both horizontally and vertically within a full viewport, also set the container height to 100vh. The complete CSS is: \"display: flex; justify-content: center; align-items: center; height: 100vh;\". This is the simplest and most reliable method for centering in modern CSS. The justify-content property controls alignment along the main axis (horizontal by default) and align-items controls the cross axis (vertical by default). This tool lets you visualize these properties interactively.",
    },
    {
      question: "What is the difference between justify-content and align-items in Flexbox?",
      answer:
        "justify-content controls alignment along the main axis, and align-items controls alignment along the cross axis. By default, the main axis is horizontal (left to right) and the cross axis is vertical (top to bottom). So justify-content handles horizontal spacing (flex-start, center, flex-end, space-between, space-around, space-evenly) and align-items handles vertical alignment (stretch, flex-start, center, flex-end, baseline). If you set flex-direction to column, the axes swap: justify-content controls vertical spacing and align-items controls horizontal alignment. This tool visualizes both properties so you can see exactly how they affect layout.",
    },
    {
      question: "When should I use Flexbox vs CSS Grid?",
      answer:
        "Use Flexbox for one-dimensional layouts where items flow in a single row or column. Flexbox excels at distributing space among items, aligning items within a container, and building navigation bars, toolbars, card rows, and form layouts. Use CSS Grid for two-dimensional layouts that need control over both rows and columns simultaneously, such as page layouts, dashboards, image galleries, and complex form grids. Flexbox works from the content out (items determine the layout), while Grid works from the layout in (the grid structure determines item placement). Many layouts combine both: Grid for the overall page structure and Flexbox for components within grid cells.",
    },
  ],
  "grid-generator": [
    {
      question: "How do I create a CSS Grid layout?",
      answer:
        "Apply display: grid to a container element, then define columns with grid-template-columns and rows with grid-template-rows. For example, \"display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;\" creates a three-column layout with equal widths and 16px spacing. The fr unit distributes available space proportionally. You can mix units: \"200px 1fr 1fr\" creates a fixed 200px sidebar and two equal flexible columns. This tool lets you visually configure columns, rows, gaps, and alignment, generating the CSS code automatically. Place child elements using grid-column and grid-row properties to span multiple cells.",
    },
    {
      question: "What does the fr unit mean in CSS Grid?",
      answer:
        "The fr (fractional) unit represents a fraction of the available space in a grid container. It distributes remaining space after fixed-size tracks are calculated. For example, \"grid-template-columns: 1fr 2fr 1fr\" divides the container into three columns where the middle column is twice as wide as the outer columns. If the container is 800px wide with no gap, the columns would be 200px, 400px, and 200px. Mixing fr with fixed units like \"300px 1fr\" creates a 300px fixed column and one column that takes all remaining space. The fr unit is similar to flex-grow in Flexbox and is the preferred way to create responsive grid layouts.",
    },
    {
      question: "How do I make a responsive CSS Grid without media queries?",
      answer:
        "Use the auto-fill or auto-fit keywords with the minmax() function in grid-template-columns. For example, \"grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))\" creates as many columns as will fit, each at least 250px wide, expanding to fill available space. auto-fill creates empty tracks when there is extra space, while auto-fit collapses empty tracks so items stretch to fill the row. This single line of CSS creates a fully responsive grid that adapts from one column on mobile to multiple columns on desktop without any media queries. Pair it with a gap property for consistent spacing.",
    },
  ],
  "border-radius": [
    {
      question: "How do I set different border-radius values for each corner?",
      answer:
        "Use the individual corner properties: border-top-left-radius, border-top-right-radius, border-bottom-right-radius, and border-bottom-left-radius. Or use the shorthand with four values in clockwise order: \"border-radius: 10px 20px 30px 40px\" sets top-left to 10px, top-right to 20px, bottom-right to 30px, and bottom-left to 40px. With two values, the first applies to top-left and bottom-right, the second to top-right and bottom-left. This tool provides visual sliders for each corner so you can design the exact shape you want and copy the generated CSS.",
    },
    {
      question: "How do I create a circle or pill shape with border-radius?",
      answer:
        "For a perfect circle, set border-radius to 50% on a square element (equal width and height). For example, a 100px by 100px div with border-radius: 50% renders as a circle. For a pill or capsule shape, set border-radius to a value equal to or greater than half the element's height on a rectangular element. For example, a button that is 40px tall with border-radius: 20px (or 9999px for a safe maximum) creates a pill shape. The 50% value works relative to the element's dimensions, so it always creates a perfect circle on squares regardless of the size.",
    },
    {
      question: "What is the difference between px and % values for border-radius?",
      answer:
        "Pixel values create a fixed curve size regardless of the element's dimensions. A 10px border-radius always creates the same curve. Percentage values are relative to the element's dimensions, with horizontal radii calculated from the width and vertical radii from the height. The most notable difference appears with 50%: on a square element, 50% creates a perfect circle, while a fixed pixel value creates rounded corners but never a true circle unless it equals half the side length. For consistent corner rounding across different element sizes, percentages are more flexible. For uniform small corner rounding (like card corners), pixel values like 8px or 12px are more predictable.",
    },
  ],
  "text-shadow": [
    {
      question: "How do I create a CSS text shadow?",
      answer:
        "Use the text-shadow CSS property with horizontal offset, vertical offset, blur radius, and color values. For example, \"text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3)\" creates a subtle drop shadow 2 pixels right and down with a 4-pixel blur. Unlike box-shadow, text-shadow does not support a spread radius or the inset keyword. The shadow follows the exact shape of the text characters, including curves and counter spaces. This tool lets you adjust all values visually with sliders and color pickers, showing the result on sample text in real time. Copy the generated CSS and apply it to any text element.",
    },
    {
      question: "How do I add multiple text shadows for a glow or outline effect?",
      answer:
        "Separate multiple shadow definitions with commas. For a glow effect, use multiple shadows with zero offset and increasing blur: \"text-shadow: 0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #0fa\" creates a neon glow. For a text outline, place shadows in all four directions: \"text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000\" creates a 1-pixel black outline around text. Layering multiple shadows with different colors and blur values can create fire effects, retro 3D text, embossed looks, and more. This tool supports adding multiple layers visually.",
    },
    {
      question: "What is the difference between text-shadow and box-shadow in CSS?",
      answer:
        "text-shadow applies shadows to the characters in a text element, following the exact glyph shapes. box-shadow applies shadows to the rectangular bounding box of an element. text-shadow takes three length values (h-offset, v-offset, blur) plus a color. box-shadow additionally supports a spread radius and the inset keyword, neither of which text-shadow has. text-shadow cannot create inner shadows on text. Both properties support multiple comma-separated shadows and accept the same color formats including rgba for transparency. For text effects, use text-shadow. For element depth and card-style elevation, use box-shadow.",
    },
  ],
};
