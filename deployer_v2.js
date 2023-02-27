/** @param {NS} ns */
export async function main(ns) {
	// choose which script we want to deploy from args
	const script = ns.args[0];
	const scriptRam = ns.getScriptRam(script);
	ns.tprint("attack script chosen: ", script);
	// choose which server to target from args
	const target = ns.args[1];
	ns.tprint("target chosen: ", target);

	// find list of servers attached to home 
	const servers = ns.scan("home");
	ns.tprint("found servers: ", servers);

	// copy script on each server in the list
	for (let server of servers) {
		ns.scp(script, server);
		ns.tprint("copied ", script, " to ", server);

		// find out how many threads we can run
		ns.killall(server)
		let serverRam = ns.getServerMaxRam(server);
		let threads = Math.floor(serverRam / scriptRam);

		// quick check that we can actually run scripts on server
		if (ns.hasRootAccess(server)) {
			// finally, execute the script with max threads
			let maxMoney = ns.getServerMaxMoney(server);
			let minSecurity = ns.getServerMinSecurityLevel(server);
			ns.exec(script, server, threads, target, maxMoney, minSecurity);
			ns.tprint(threads, " threads were deployed to ", server);
		} else {
			ns.tprint("NO ROOT ACCESS ON: ", server)
		}
	}
}