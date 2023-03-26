// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

const syntax = {
	createReactComponent: (compName) => (`import React from 'react'

const ${compName} = () => {
	return (
	<div>
		<h1>${compName} Component</h1>
	</div>
	)
}

export default ${compName}`)
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const nameFormatter = (filename, extension = true, jsx = false) => {
		return filename[0].toUpperCase()+filename.slice(1)+(extension?(jsx?'.jsx':'.js'):'');
	}

	const fileCreator = async (e) => {
		const {path} = e;
		console.log(path);
		const userInput = await vscode.window.showInputBox({
			prompt: 'enter the component name: ',
			value: '',
			placeHolder: '(example - "Signup" or "signup")'
		  });
		// console.log(vscode.workspace.workspaceFolders);
		// vscode.window.showInformationMessage();
		let fileName = nameFormatter(userInput);
		let uri = vscode.Uri.joinPath(e, fileName);
		// let uri = vscode.Uri.joinPath(path, fileName);
		console.log(uri);
		await vscode.workspace.fs.writeFile(uri, Buffer.from(syntax.createReactComponent(nameFormatter(userInput, false)), 'utf8'));
	}

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-assist" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('code-assist.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from code-assist!');
	});

	let createFile = vscode.commands.registerCommand('code-assist.createReactComponent', fileCreator);




	context.subscriptions.push(disposable);
	context.subscriptions.push(createFile);
}



// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
