import { encodeUrl, decodeUrl } from "./rewriters/url";
import { rewriteCss } from "./rewriters/css";
import { rewriteHtml, rewriteSrcset } from "./rewriters/html";
import { rewriteJs } from "./rewriters/js";
import { rewriteHeaders } from "./rewriters/headers";
import { rewriteWorkers } from "./rewriters/worker";
import { isScramjetFile } from "./rewriters/html";
import { BareClient } from "@mercuryworkshop/bare-mux";

if (!self.$scramjet) {
    //@ts-expect-error really dumb workaround
    self.$scramjet = {}
}
self.$scramjet.bundle = {
    encodeUrl,
    decodeUrl,
    rewriteCss,
    rewriteHtml,
    rewriteSrcset,
    rewriteJs,
    rewriteHeaders,
    rewriteWorkers,
    isScramjetFile,
    BareClient
}