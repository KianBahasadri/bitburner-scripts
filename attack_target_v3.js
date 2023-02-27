/** @param {NS} ns */
/** 
 * grows, weakens, and attacks a specified target
 * deploys only a single thread.
 * PARAMS: target name, target max money, target min security
*/
export async function main(ns) {
	ns.disableLog("ALL");
	const target = ns.args[0];
	const maxMoney = ns.args[1];
	const minSecurity = ns.args[2];
	
	while (true) {
		let money = ns.getServerMoneyAvailable(target);
		let security = ns.getServerSecurityLevel(target);
		let growth = ns.growthAnalyze(target, 2);
		
		let log = "";
		log += "\n" + "max money: $" + maxMoney/1000000 + "M";
		log += "\n" + "current money: $" + money/1000000 + "M";
		log += "\n" + "current growth factor: " + growth;
		log += "\n" + "target security: " + minSecurity + 5;
		log += "\n" + "current security: " + security;
		ns.printf(log);

		if (money < maxMoney * 0.9 && growth < 1500) {
			ns.printf("WARN: Growing for %d seconds", ns.getGrowTime(target)/1000);
			let multiple = await ns.grow(target);
			ns.printf("SUCCESS: Money grown by %d%%", multiple*100);
		} else if (security > minSecurity + 5) {
			ns.printf("WARN: Weakening for %d seconds", ns.getWeakenTime(target)/1000);
			let decrease = await ns.weaken(target);
			ns.printf("SUCCCESS: Security decreased by %d", decrease);
		} else {
			ns.printf("WARN: Hacking for %d seconds", ns.getHackTime(target)/1000);
			let hacked = await ns.hack(target);
			if (hacked > 0) {
				ns.printf("SUCCESS: $%dK stolen", hacked/1000)
			} else {
				ns.printf("ERROR: Hacking Failed");
			}
		}
	}
}