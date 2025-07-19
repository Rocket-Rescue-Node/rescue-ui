import pkg from "glob";
import { promises as fs } from "fs";
import { parse } from "node-html-parser";
import sha256 from "sha256";
const { glob } = pkg;
const tmpl: string = `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: no-referrer
  X-content-Type-Options: nosniff
  Permissions-Policy: microphone=(), camera=(), accelerometer=(), autoplay=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(self), usb=(), xr-spatial-tracking=()
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'none'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https://explorer-api.walletconnect.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; manifest-src 'self'; connect-src 'self' wss://*.walletconnect.com https://*.walletconnect.com wss://*.walletconnect.org https://*.walletconnect.org https://*.web3modal.org wss://*.web3modal.org https://api.rescuenode.com https://cloudflare-eth.com https://cca-lite.coinbase.com; frame-ancestors 'self'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests; report-uri https://rescuenode.com/csp-report; frame-src https://verify.walletconnect.com https://verify.walletconnect.org;
  X-Robots-Tag: noindex

/docs/*
  ! Content-Security-Policy
  Content-Security-Policy: default-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; manifest-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests; report-uri https://rescuenode.com/csp-report; script-src {script_src};
`;

(async () => {
  const docsPath = process.argv[2];
  const out = process.argv[3];
  const shas = new Set();
  shas.add("'self'");

  const files = glob.sync(docsPath + "/**/*.html");
  for (const f of files) {
    const html = await fs.readFile(f, "utf8");
    const root = parse(html);

    root.getElementsByTagName("script").forEach((elem) => {
      if (elem.getAttribute("src")) return;

      const sha = Buffer.from(sha256(elem.innerHTML), "hex").toString("base64");
      shas.add(`'sha256-${sha}'`);
    });
  }

  const scriptSrc = Array.from(shas).join(" ");
  console.log(
    `Setting /docs/* Content-Security-Policy script-src to \`${scriptSrc}\``,
  );

  await fs.writeFile(out, tmpl.replace("{script_src}", scriptSrc));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
