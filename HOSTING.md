# Namecheap Stellar Plus deployment

This is a static HTML, CSS, and JavaScript website. Upload the contents of the
repository root (including `assets/`, `.htaccess`, `robots.txt`, and
`sitemap.xml`) into the domain's `public_html` directory. Keep `index.html` in
that directory so it is served as the home page.

## Enable HTTPS

1. Point `paulitty.com` and, if used, `www.paulitty.com` to the Namecheap
   hosting account and allow DNS changes to propagate.
2. In cPanel, enable or install the SSL certificate for the domain and its
   `www` alias. Confirm the site loads successfully at `https://paulitty.com`
   before relying on the redirect in `.htaccess`.
3. The `.htaccess` file redirects HTTP and `www` requests to
   `https://paulitty.com`, disables directory listings, and adds browser
   security headers. If the host reports an HTTP 500 error after upload,
   temporarily rename `.htaccess` and ask Namecheap support which Apache
   directives or modules are unavailable.

## Submit the sitemap

After the HTTPS site is publicly reachable, open Google Search Console, verify
the `paulitty.com` domain property, and submit:

`https://paulitty.com/sitemap.xml`

The sitemap lists the four public pages. The matching `robots.txt` advertises
the sitemap to search crawlers.

## Contact form and security boundary

The quote form validates input in the browser and opens WhatsApp or the
visitor's email application with URL-encoded text. The website does not store
or directly process form submissions and has no database, so SQL injection is
not applicable to this static form. Browser-side validation is not a substitute
for server-side validation: if a server endpoint or database is added later,
validate again on the server, encode output for its destination, and use
parameterized database queries.
