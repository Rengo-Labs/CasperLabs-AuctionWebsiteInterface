// import { config } from "dotenv";
import { NODE_ADDRESS } from "../../../blockchain/NodeAddress/NodeAddress";
import { WISETokenClient, utils, constants } from "../src";
// config();


const wise = new WISETokenClient(
	NODE_ADDRESS,
	"casper-test"!,
	"http://44.208.234.65:9999/events/main"!
);

export const balanceOf = async (contractHash: string, key: string) => {

	console.log(`... Contract Hash: ${contractHash}`);

	// We don't need hash- prefix so i'm removing it
	await wise.setContractHash(contractHash);

	//balanceof
	let balance = await wise.balanceOf(key);

	console.log(`... Balance: ${balance}`);

	return balance;

};

export const getTotalSupply = async (contractHash: string) => {

	// We don't need hash- prefix so i'm removing it
	await wise.setContractHash(contractHash);

	//totalsupply
	let totalSupply = await wise.totalSupply();
	console.log(contractHash + ` = ... Total supply: ${totalSupply}`);

	return totalSupply;

};