LUNA CANDLES AFRICAN - how to put the website online

1. Get web hosting that runs PHP 7.4 or newer (almost every cPanel host does).
2. Open config.php and type your admin password (10+ characters) between the quotes.
3. Upload EVERYTHING in this folder (including the hidden .htaccess files) to public_html.
4. Turn on HTTPS (SSL) in your hosting panel before you log in.
5. Website:  https://yourdomain.com/          Admin:  https://yourdomain.com/admin.html
6. If Save or Upload fails, make the "data" and "uploads" folders writable (755 or 775).
7. In admin fill in: WhatsApp, phone, address, social links, prices, payment numbers. Press Save.

Opening index.html by double-click also works as a preview; changes then stay in your browser only.
Orders: they appear in Admin > Orders, and the customer can send them to your WhatsApp.
Change the admin password any time under Admin > Password. Forgot it? Delete data/auth.php and use config.php again.
Payments are manual (the site shows your numbers); it does not charge cards automatically.
