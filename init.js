const { exec } = require("node:child_process");
const fs = require("node:fs");

const name = process.argv[2];
const description = process.argv.splice(3).join(" ");

if (!name) throw new SyntaxError("Incorrect Usage: `npm run init (One Word Name For Project) (Project Description)`");
if (!description) console.log("\x1b[33mWARNING:", "\x1b[0mNo Description Set\n");

const status = (type, data) => console.log(data ? type + ": " + data : type);
const emptyConsoleLine = () => console.log("");

process.on("exit", () => {
	emptyConsoleLine();
	status("Completed Initialization");
	emptyConsoleLine();
	console.log(`Make Sure To:
	- \x1b[36mFill README.md
	\x1b[0m- \x1b[36mSetup Docs Replacements in \x1b[32mtypedoc.json
	\x1b[0m- \x1b[36mWrite \x1b[1mCode \x1b[0m\x1b[36mIn \x1b[32msrc
	\x1b[0m- \x1b[36mWrite \x1b[1mTests \x1b[0m\x1b[36mIn \x1b[32mtest
		
\x1b[0mRun \x1b[32mnpm run ready \x1b[0mwhen you're ready to publish the package`);
	emptyConsoleLine();
});

status("Setting Up", "package.json");
const package_json = JSON.parse(fs.readFileSync("./package.json"));
package_json.name = `@djs-user/${name.toLowerCase()}`;
package_json.description = description;
fs.writeFileSync("./package.json", JSON.stringify(package_json));

status("Setting Up", ".gitignore");
fs.writeFileSync(
	"./.gitignore",
	`dist
node_modules
test
init.js
SETUP.md`
);

status("Setting Up", "TypeDoc Config");
fs.writeFileSync(
	"./typedoc.json",
	`{
	"$schema": "https://typedoc.org/schema.json",
	"entryPoints": ["./src"],
	"out": "docs",
	"name": "Discord.js User | ${name}",
	"includeVersion": true,
	"readme": "./README.md",
	"commentStyle": "all",
	"tsconfig": "./tsconfig.json",
	"replaceText": {
		"inCodeCommentText": true,
		"inCodeCommentTags": true,
		"inIncludedFiles": true,
		"replacements": [
			{
				"pattern": "testRegex",
				"flags": "gi",
				"replace": "test regex replacement"
			}
		]
	}
}
`
);

status("Setting Up", "README");
fs.writeFileSync(
	"./README.md",
	`# Discord.js User | ${name}

${description}`
);

emptyConsoleLine();

status("Completing Initiation", "Readying Data");
exec("npm run ready", err => {
	if (err) throw err;
});
