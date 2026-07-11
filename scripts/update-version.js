/* #region Version Metadata Generator */

/*
 * Generates version.json from the requested release number and Git metadata.
 *
 * Manual release:
 *   npm run version:update -- v1.0.0
 *
 * Cloudflare Pages build:
 *   npm run build:metadata
 *
 * Cloudflare environment values take priority when available:
 *   CF_PAGES_COMMIT_SHA
 *   CF_PAGES_BRANCH
 *   CF_PAGES_URL
 */

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const versionFilePath = path.join(projectRoot, "version.json");
const packageFilePath = path.join(projectRoot, "package.json");
const packageLockFilePath = path.join(projectRoot, "package-lock.json");
const requestedVersion = process.argv[2];

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
	fs.writeFileSync(
		filePath,
		`${JSON.stringify(value, null, "\t")}\n`,
		"utf8"
	);
}

function runGitCommand(command, fallback = "Unknown") {
	try {
		return childProcess
			.execSync(command, {
				cwd: projectRoot,
				encoding: "utf8",
				stdio: ["ignore", "pipe", "ignore"]
			})
			.trim();
	} catch {
		return fallback;
	}
}

function normalizeVersion(version) {
	if (!version) {
		return null;
	}

	const normalizedVersion = version.startsWith("v")
		? version
		: `v${version}`;

	if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(normalizedVersion)) {
		throw new Error(
			`Invalid version "${version}". Use Semantic Versioning, for example v1.0.0.`
		);
	}

	return normalizedVersion;
}

function getEnvironmentName(previousEnvironment) {
	if (process.env.CF_PAGES_URL) {
		return process.env.CF_PAGES_BRANCH === "main"
			? "Production"
			: "Preview";
	}

	return process.env.APP_ENVIRONMENT || previousEnvironment || "Production";
}

function updatePackageVersion(versionWithoutPrefix) {
	const packageInfo = readJson(packageFilePath);
	packageInfo.version = versionWithoutPrefix;
	writeJson(packageFilePath, packageInfo);

	if (!fs.existsSync(packageLockFilePath)) {
		return;
	}

	const packageLockInfo = readJson(packageLockFilePath);
	packageLockInfo.version = versionWithoutPrefix;

	if (packageLockInfo.packages && packageLockInfo.packages[""]) {
		packageLockInfo.packages[""].version = versionWithoutPrefix;
	}

	writeJson(packageLockFilePath, packageLockInfo);
}

const previousInfo = readJson(versionFilePath);
const normalizedVersion = normalizeVersion(requestedVersion) || previousInfo.version;
const fullCommit =
	process.env.CF_PAGES_COMMIT_SHA ||
	runGitCommand("git rev-parse HEAD", previousInfo.commit);
const branch =
	process.env.CF_PAGES_BRANCH ||
	runGitCommand("git branch --show-current", previousInfo.branch);

const nextInfo = {
	name: previousInfo.name || "Vico Nail Story",
	version: normalizedVersion,
	build: new Date().toISOString(),
	commit: fullCommit.slice(0, 12),
	branch,
	environment: getEnvironmentName(previousInfo.environment)
};

writeJson(versionFilePath, nextInfo);
updatePackageVersion(normalizedVersion.replace(/^v/, ""));

console.log("Updated release metadata:");
console.table(nextInfo);

/* #endregion */
