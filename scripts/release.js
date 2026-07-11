/* #region Release Automation */

/*
 * Safely prepares and optionally publishes a Semantic Version release.
 *
 * Prepare metadata only:
 *   npm run release -- v1.0.1
 *
 * Prepare metadata, create the metadata commit, and create the Git tag:
 *   npm run release -- v1.0.1 --commit
 *
 * Complete the full release, including pushing main and the tag:
 *   npm run release -- v1.0.1 --commit --push
 *
 * Safety rules:
 *   1. The working tree must be clean before the script starts.
 *   2. The release must run from the main branch.
 *   3. npm test must pass.
 *   4. An existing tag is never overwritten.
 *   5. Push only occurs when both --commit and --push are supplied.
 */

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const versionFilePath = path.join(projectRoot, "version.json");
const packageFilePath = path.join(projectRoot, "package.json");
const packageLockFilePath = path.join(projectRoot, "package-lock.json");

const argumentsList = process.argv.slice(2);
const requestedVersion = argumentsList.find((argument) => !argument.startsWith("--"));
const shouldCommit = argumentsList.includes("--commit");
const shouldPush = argumentsList.includes("--push");

function run(command, options = {}) {
	const result = childProcess.spawnSync(command, {
		cwd: projectRoot,
		shell: true,
		encoding: "utf8",
		stdio: options.capture ? "pipe" : "inherit"
	});

	if (result.status !== 0) {
		const details = options.capture
			? (result.stderr || result.stdout || "").trim()
			: "";

		throw new Error(
			details
				? `Command failed: ${command}\n${details}`
				: `Command failed: ${command}`
		);
	}

	return options.capture ? result.stdout.trim() : "";
}

function normalizeVersion(version) {
	if (!version) {
		throw new Error(
			"Missing version. Example: npm run release -- v1.0.1"
		);
	}

	const normalizedVersion = version.startsWith("v")
		? version
		: `v${version}`;

	if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(normalizedVersion)) {
		throw new Error(
			`Invalid version "${version}". Use Semantic Versioning, for example v1.0.1.`
		);
	}

	return normalizedVersion;
}

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertCleanWorkingTree() {
	const status = run("git status --porcelain", { capture: true });

	if (status) {
		throw new Error(
			"The working tree is not clean. Commit or stash all changes before running the release command."
		);
	}
}

function assertMainBranch() {
	const branch = run("git branch --show-current", { capture: true });

	if (branch !== "main") {
		throw new Error(
			`Release must run from the main branch. Current branch: ${branch || "Unknown"}.`
		);
	}
}

function assertTagDoesNotExist(version) {
	const existingTag = run(`git tag --list ${version}`, { capture: true });

	if (existingTag) {
		throw new Error(
			`Tag ${version} already exists. The script will not overwrite an existing release tag.`
		);
	}
}

function printSummary(version, sourceCommit) {
	const versionInfo = readJson(versionFilePath);

	console.log("\nRelease metadata prepared successfully:");
	console.table({
		version,
		build: versionInfo.build,
		sourceCommit,
		branch: versionInfo.branch,
		environment: versionInfo.environment
	});
}

try {
	const version = normalizeVersion(requestedVersion);

	if (shouldPush && !shouldCommit) {
		throw new Error("--push requires --commit.");
	}

	console.log(`Preparing ${version}...`);

	assertCleanWorkingTree();
	assertMainBranch();
	assertTagDoesNotExist(version);

	console.log("\n[1/4] Running project checks...");
	run("npm test");

	const sourceCommit = run("git rev-parse --short=12 HEAD", { capture: true });

	console.log("\n[2/4] Updating release metadata...");
	run(`node scripts/update-version.js ${version}`);

	console.log("\n[3/4] Validating release metadata...");
	run("node scripts/check-version.js");

	printSummary(version, sourceCommit);

	if (!shouldCommit) {
		console.log("\nPreparation mode completed.");
		console.log("Review these files before committing:");
		console.log("  version.json");
		console.log("  package.json");
		console.log("  package-lock.json");
		console.log("\nTo finish automatically after review:");
		console.log(`  npm run release -- ${version} --commit`);
		console.log("\nImportant: restore or commit the prepared metadata before running the command again, because the release command requires a clean working tree.");
		process.exit(0);
	}

	console.log("\n[4/4] Creating metadata commit and annotated tag...");
	run("git add version.json package.json package-lock.json");
	run(`git commit -m "chore: finalize ${version} release metadata"`);
	run(`git tag -a ${version} -m "Vico Nail Story ${version}"`);

	if (shouldPush) {
		console.log("\nPushing main and release tag to origin...");
		run("git push origin main");
		run(`git push origin ${version}`);
		console.log(`\n${version} was pushed successfully.`);
	} else {
		console.log(`\n${version} commit and tag were created locally.`);
		console.log("Push them when ready:");
		console.log("  git push origin main");
		console.log(`  git push origin ${version}`);
	}
} catch (error) {
	console.error(`\nRelease failed: ${error.message}`);
	process.exitCode = 1;
}

/* #endregion */
