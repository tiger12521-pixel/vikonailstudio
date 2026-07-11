/* #region Version Metadata Validation */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const versionFilePath = path.join(projectRoot, "version.json");
const packageFilePath = path.join(projectRoot, "package.json");

function fail(message) {
	console.error(`Version check failed: ${message}`);
	process.exitCode = 1;
}

function readJson(filePath) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch (error) {
		throw new Error(`Unable to read ${path.basename(filePath)}: ${error.message}`);
	}
}

try {
	const versionInfo = readJson(versionFilePath);
	const packageInfo = readJson(packageFilePath);
	const requiredFields = [
		"name",
		"version",
		"build",
		"commit",
		"branch",
		"environment"
	];

	for (const field of requiredFields) {
		if (!versionInfo[field] || typeof versionInfo[field] !== "string") {
			fail(`version.json field "${field}" is missing or invalid.`);
		}
	}

	if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(versionInfo.version)) {
		fail(`"${versionInfo.version}" is not a valid release version.`);
	}

	if (packageInfo.version !== versionInfo.version.replace(/^v/, "")) {
		fail(
			`package.json (${packageInfo.version}) does not match version.json (${versionInfo.version}).`
		);
	}

	if (Number.isNaN(Date.parse(versionInfo.build))) {
		fail(`build value "${versionInfo.build}" is not a valid date.`);
	}

	if (["manual", "pending", "pending-release", "Unknown"].includes(versionInfo.commit)) {
		fail(`commit is still set to "${versionInfo.commit}".`);
	}

	if (!process.exitCode) {
		console.log("Version metadata is valid:");
		console.table(versionInfo);
	}
} catch (error) {
	fail(error.message);
}

/* #endregion */
