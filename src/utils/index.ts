import fs from "fs";
import path from "path";

const FILEPATH = path.join(process.cwd(), "data.yml");

export const getUsernameWallet = (username: string): string => {
	try {
		const data = fs.readFileSync(FILEPATH);
		const dataObject = JSON.parse(data.toString().replace("/n", ""));
		return dataObject[username]
			? dataObject[username]
			: (process.env.PROGRAM_ACCOUNT as string);
	} catch (err: any) {
		throw err;
	}
};

export const setUsernameWallet = (username: string, wallet: string) => {
	try {
		const data = fs.readFileSync(FILEPATH);
		const dataObject = JSON.parse(data.toString().replace("/n", ""));
		dataObject[username] = wallet;
		fs.writeFileSync(FILEPATH, JSON.stringify(dataObject, null, 4));
	} catch (err: any) {
		throw err;
	}
};
