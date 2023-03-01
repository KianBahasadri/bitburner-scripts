/** @param {NS} ns */
/**
 * Automatically grows your Hacknet production while idling
 * It checks what the cheapest upgrade is, then every minute it
 * runs a check to see if you have enough money to afford it,
 * there are MANY optimizations that I plan to make in future versions
 * most specifically, a highly optimized algorithm for deciding what to buyForAllNodes and when 
 */

function checkFirstNode(ns) {
	if (ns.hacknet.numNodes() == 0) {
		if(ns.hacknet.purchaseNode() == -1) {
			ns.tprint("ERROR: could not afford one node, get yo money up broke ass mf");
		} else {
			ns.tprint("SUCCESS: Hacknet Node bought");
		}
	} else {
		ns.printf("1 or more nodes owned");
	}
	return;
}

async function buyForAllNodes(ns, func, cost) {
	for (let i = 0; i < nodes; i++) {
		waitForAmount(ns, cost);
		func(i, 1);
		ns.printf("SUCCESS: %d node upgraded");
	}
	return;
}


async function waitForAmount(ns, amount) {
	while (money < amount) {
		ns.printf("waiting for $%dM", amount/1000000);
		await ns.sleep(60000);
	}
	return;
}

let money = 0

export async function main(ns) {
	// Check that player actually owns at least a single node	
	checkFirstNode(ns);

	while (true) {
		money = ns.getPlayer().money;
		let nodes = ns.hacknet.numNodes();
		let maxNodes = ns.hacknet.maxNumNodes();
		
		let newNodeCost = ns.hacknet.getPurchaseNodeCost();
		let ramCost = ns.hacknet.getRamUpgradeCost(0, 1);
		let coreCost = ns.hacknet.getCoreUpgradeCost(0, 1);
		let levelCost = ns.hacknet.getLevelUpgradeCost(0, 1);

		let allRamCost = ramCost * nodes;
		let allCoreCost = coreCost * nodes;
		let allLevelCost = levelCost * nodes;

		if (allLevelCost < allRamCost && allLevelCost < allCoreCost && allLevelCost < newNodeCost) {
			ns.printf("Upgrading Levels");
			buyForAllNodes(ns, ns.hacknet.upgradeLevel, levelCost);
			ns.printf("SUCCESS: Levels upgraded");
		} else if(allRamCost < allCoreCost && allRamCost < newNodeCost) {
			ns.printf("Upgrading RAM");
			buyForAllNodes(ns, ns.hacknet.upgradeRam, ramCost);
			ns.printf("SUCCESS: RAM upgraded");
		} else if (allCoreCost < newNodeCost) {
			ns.printf("Upgrading Core");
			buyForAllNodes(ns, ns.hacknet.upgradeCore, coreCost);
			ns.printf("SUCCESS: Cores upgraded");
		} else if (nodes < maxNodes) {
			ns.printf("Buying new Node");
			await waitForAmount(ns, newNodeCost);
			let newNodeIndex = ns.hacknet.purchaseNode();
			ns.printf("SUCCESS: %dth node bought", newNodeIndex);
		} else {
			ns.printf("No viable Upgrade found");
		}
		await ns.sleep(60000);
	}
}