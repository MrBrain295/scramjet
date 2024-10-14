// entrypoint for scramjet.client.js

import { loadCodecs } from "../scramjet";
import { SCRAMJETCLIENT } from "../symbols";
import { ScramjetClient } from "./client";
import { ScramjetServiceWorkerRuntime } from "./swruntime";

export const iswindow = "window" in self;
export const isworker = "WorkerGlobalScope" in self;
export const issw = "ServiceWorkerGlobalScope" in self;
export const isdedicated = "DedicatedWorkerGlobalScope" in self;
export const isshared = "SharedWorkerGlobalScope" in self;
export const isemulatedsw =
	new URL(self.location.href).searchParams.get("dest") === "serviceworker";

export class ScramjetContextInit extends Event {
	public window: Self;
}

dbg.log("scrammin");
// if it already exists, that means the handlers have probably already been setup by the parent document
if (!(SCRAMJETCLIENT in <Partial<typeof self>>self)) {
	loadCodecs();

	const client = new ScramjetClient(self);

	if (self.COOKIE) client.loadcookies(self.COOKIE);

	client.hook();

	if (isemulatedsw) {
		const runtime = new ScramjetServiceWorkerRuntime(client);
		runtime.hook();
	}

	const ev = new ScramjetContextInit("contextInit");
	ev.window = client.global.window;
	client.frame?.dispatchEvent(ev);
}

if ("document" in self && document?.currentScript) {
	document.currentScript.remove();
}
