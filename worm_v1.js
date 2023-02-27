/** @param {NS} ns */
/** 
 * copies itself to each nearby server
 * attempts to hack any server it is on
 * copies itself to each nearby server again
 * PARAMS: none
 * 
 * --NOT FUNCTIONAL--
*/
export async function main(ns) {
	let visited = ns.args;
	const host = ns.getHostname();
	const servers = ns.scan(host);

	visited.push(...servers);

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