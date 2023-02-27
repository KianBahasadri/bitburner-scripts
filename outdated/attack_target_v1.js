/** @param {NS} ns */
export async function main(ns) {
	const hostname = ns.args[0];
	const maxMoney = ns.getServerMaxMoney(hostname);
	const minSecurity = ns.getServerMinSecurityLevel(hostname);
	while (true) {
		let money = ns.getServerMoneyAvailable(hostname);
		let security = ns.getServerSecurityLevel(hostname);

		if (money < maxMoney * 0.8) {
			ns.print("max money: ", maxMoney, "\ncurrent money: ", money)
			await ns.grow(hostname);
		} else if (security > minSecurity + 5) {
			await ns.weaken(hostname);
		} else {
			await ns.hack(hostname);
		}
	}
}