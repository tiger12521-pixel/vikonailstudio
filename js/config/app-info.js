/* #region Application Version Information */

/*
 * Loads deployment information from /version.json and prints it in DevTools.
 *
 * Modify version.json when publishing a new release:
 * - version: Public release number, for example v1.0.1.
 * - build: Release date or build time.
 * - commit: Git short commit hash when available.
 * - branch: Git branch used for deployment.
 * - environment: Production, Preview, or Development.
 */

const VERSION_FILE_URL = "/version.json";

const FALLBACK_APP_INFO = Object.freeze({
	name: "Vico Nail Story",
	version: "Unknown",
	build: "Unknown",
	commit: "Unknown",
	branch: "Unknown",
	environment: "Unknown"
});

async function loadAppInfo() {
	try {
		const response = await fetch(`${VERSION_FILE_URL}?t=${Date.now()}`, {
			cache: "no-store"
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return {
			...FALLBACK_APP_INFO,
			...(await response.json())
		};
	} catch (error) {
		console.warn("Unable to load version.json:", error);
		return FALLBACK_APP_INFO;
	}
}

function printAppInfo(appInfo) {
	console.log(`
═══════════════════════════════════════
            ${appInfo.name}
═══════════════════════════════════════

Version     : ${appInfo.version}
Build       : ${appInfo.build}
Commit      : ${appInfo.commit}
Branch      : ${appInfo.branch}
Environment : ${appInfo.environment}

═══════════════════════════════════════
	`);
}

export async function initializeAppInfo() {
	const appInfo = await loadAppInfo();
	printAppInfo(appInfo);
	return appInfo;
}

/* #endregion */
