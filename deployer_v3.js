/** @param {NS} ns */
/** 
 * scans all nearby servers and copies a script to them
 * execs script with max thread usage and passes a parameter
 * PARAMS: script name, script parameter
*/

export function tprintfBox(ns, s) {
	ns.tprintf("╔" + "═".repeat(s.length) + "╗");
	ns.tprintf("║" + s + "║");
	ns.tprintf("╚" + "═".repeat(s.length) + "╝");
}

export async function main(ns) {
	const script = ns.args[0];
	const host = ns.getHostname();
	
	// check if given script exists on machine
	if (! ns.fileExists(script, host)) {
		ns.tprintf("ERROR: script not found on machine");
		return;
	}

	const scriptRam = ns.getScriptRam(script);
	const target = ns.args[1];
	const servers = ns.scan(host);
	const maxMoney = ns.getServerMaxMoney(target);
	const minSecurity = ns.getServerMinSecurityLevel(target);
	
	ns.tprintf("\n");
	tprintfBox(ns, "DEPLOYER SCRIPT INITIATED");
	ns.tprintf("SCRIPT: %s", script);
	ns.tprintf("RAM: %dGB", scriptRam);
	ns.tprintf("TARGET: " + target);
	ns.tprintf("SERVERS: " + servers);
	ns.tprint("\n");

	await ns.sleep(1000);
	
	for (let i = 0; i < servers.length; i++) {
		ns.ui.clearTerminal();
		
		let server = servers[i];
		ns.scp(script, server);

		ns.killall(server);
		let serverRam = ns.getServerMaxRam(server);
		let threads = Math.floor(serverRam / scriptRam);
		
		// quick check that we can actually run scripts on server
		if (ns.hasRootAccess(server)) {
			// finally, execute the script with max threads
			ns.exec(script, server, threads, target, maxMoney, minSecurity);
			ns.tprintf("SUCCESS: %d threads were deployed to %s", threads, server);
		} else {
			ns.tprintf("ERROR: NO ROOT ACCESS ON: " + server)
		}
		ns.tprintf("progress: %s", "=".repeat(i*3));
		ns.tprintf("copied %s to %s", script, server);
		await ns.sleep(500);
	}

	tprintfBox(ns, "SCRIPTS SUCCESSFULLY DEPLOYED");
}