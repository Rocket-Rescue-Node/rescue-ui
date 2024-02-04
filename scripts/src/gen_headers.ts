import { glob } from "glob";
import { promises as fs } from "fs";
import { parse } from "node-html-parser";
import * as sha256 from "sha256";
const tmpl: string = `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Referrer-Policy: no-referrer
  X-content-Type-Options: nosniff
  Permissions-Policy: microphone=(), camera=(), accelerometer=(), autoplay=(), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(self), usb=(), xr-spatial-tracking=()
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src 'none'; script-src 'self'; img-src 'self' data: blob: https://explorer-api.walletconnect.com; style-src 'self' 'unsafe-inline'; font-src 'self'; manifest-src 'self'; connect-src 'self' wss://*.walletconnect.com https://*.walletconnect.com https://api.rescuenode.com http://api.web3modal.com; frame-ancestors 'self'; base-uri 'none'; form-action 'self'; upgrade-insecure-requests; report-uri https://rescuenode.com/csp-report; frame-src https://verify.walletconnect.com https://verify.walletconnect.org;
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
