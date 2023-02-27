/** @param {NS} ns */
/** 
 * scans all nearby servers and copies a script to them
 * execs script with max thread usage and passes a parameter
 * PARAMS: script name, script parameter
*/

function printBox(ns, s) {
	let str = "";
	str += "╔ " + "═".repeat(s.length) + " ╗\n";
	str += "║ " + s + " ║\n";
	str += "╚ " + "═".repeat(s.length) + " ╝\n";
	return str;
}

function progressBar(ns, a, b) {
	a *= 4;
	b *= 4;
	let str = "";
	str += "\u001b[32m" + "━".repeat(a);
	str += "\u001b[31m" + "━".repeat(b - a);
	return str;
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
	
	let title = "\n";
	title += printBox(ns, "DEPLOYER SCRIPT INITIATED");
	title += sprintf("\nSCRIPT: %s", script);
	title += sprintf("\nRAM USAGE: %dGB", scriptRam);
	title += sprintf("\nTARGET: %s", target);
	title += sprintf("\nSERVERS: %s", servers);
	title += "\n";
	
	for (let i = 0; i < servers.length; i++) {
		ns.ui.clearTerminal();
		ns.tprintf(title);
		
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
		ns.tprintf(progressBar(ns, i, servers.length - 1));
		ns.tprintf("copied %s to %s", script, server);
		await ns.sleep(500);
	}
	
	ns.tprintf(printBox(ns, "SCRIPTS SUCCESSFULLY DEPLOYED"));
}