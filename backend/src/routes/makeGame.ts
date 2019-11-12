import {app} from "../index";
import {deleteRepo, saveRepo} from "../services/repoFunctions";
import linter from "../services/linter";
import makeGameFromLinter from "../services/makeGameFromLinter";
import compileImages from "../services/compileImages";

app.post("/makeWorld", async ({body}, res) => {
	if (!body.repoURL) {
		res.sendStatus(401);
		return;
	}

	let directory: string;
	try {
		directory = await saveRepo(body.repoURL);
		const lint = await linter({directory});
		const game = await makeGameFromLinter(lint);
		const data = await compileImages(game);
		res.setHeader('Content-type', 'application/zip');
		res.setHeader('Content-disposition', 'attachment; filename=mario_level_language.zip');
		res.status(200);
		res.end(data, "binary");
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
	await deleteRepo(directory);
});