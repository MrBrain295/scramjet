import { rewriteJs } from "./js";

export type URLMeta = {
	origin: URL;
	base: URL;
};

function tryCanParseURL(url: string, origin?: string | URL): URL | null {
	try {
		return new URL(url, origin);
	} catch {
		return null;
	}
}

export function rewriteBlob(url: string, meta: URLMeta) {
	let blob = new URL(url.substring("blob:".length));
	return "blob:" + meta.origin.origin + blob.pathname;
}

export function unrewriteBlob(url: string) {
	let blob = new URL(url.substring("blob:".length));
	return "blob:" + location.origin + blob.pathname;
}

export function encodeUrl(url: string | URL, meta: URLMeta) {
	if (url instanceof URL) {
		url = url.href;
	}

	if (url.startsWith("javascript:")) {
		return "javascript:" + rewriteJs(url.slice("javascript:".length), meta);
	} else if (url.startsWith("blob:")) {
		return location.origin + self.$scramjet.config.prefix + url;
	} else if (url.startsWith("data:")) {
		return location.origin + self.$scramjet.config.prefix + url;
	} else if (url.startsWith("mailto:") || url.startsWith("about:")) {
		return url;
	} else {
		let base = meta.base.href;

		if (base.startsWith("about:")) base = decodeUrl(self.location.href); // jank!!!!! weird jank!!!

		return (
			location.origin +
			self.$scramjet.config.prefix +
			self.$scramjet.codec.encode(new URL(url, base).href)
		);
	}
}

export function decodeUrl(url: string | URL) {
	if (url instanceof URL) {
		url = url.href;
	}

	const prefixed = location.origin + self.$scramjet.config.prefix;

	if (url.startsWith("javascript:")) {
		//TODO
		return url;
	} else if (url.startsWith("blob:")) {
		// realistically this shouldn't happen
		return url;
	} else if (url.startsWith(prefixed + "blob:")) {
		return url.substring(prefixed.length);
	} else if (url.startsWith(prefixed + "data:")) {
		return url.substring(prefixed.length);
	} else if (url.startsWith("mailto:") || url.startsWith("about:")) {
		return url;
	} else if (tryCanParseURL(url)) {
		return self.$scramjet.codec.decode(
			url.slice((location.origin + self.$scramjet.config.prefix).length)
		);
	} else {
		return url;
	}
}
