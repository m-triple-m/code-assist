// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

const syntax = {
  createReactComponent: (compName) => `import React from 'react'

const ${compName} = () => {
	return (
	<div>
		<h1>${compName} Component</h1>
	</div>
	)
}

export default ${compName}`,
};

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const nameFormatter = (filename, extension = true, jsx = false) => {
    return (
      filename[0].toUpperCase() +
      filename.slice(1) +
      (extension ? (jsx ? ".jsx" : ".js") : "")
    );
  };

  const getFileName = (filename, extension) => {
    return filename[0].toUpperCase() + filename.slice(1) + extension;
  };

  const toCamelCase = (str) => {
	return str[0].toUpperCase() + str.slice(1);
}

  const openFile = async (uri) => {
    try {
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);

      console.log("File opened successfully.");
    } catch (err) {
      console.error(err);
    }
  };

  const prependLineToFile = (uri, text) => {
    const editor = vscode.window.activeTextEditor;
    const position = new vscode.Position(0, 0);
    const range = new vscode.Range(position, position);
    console.log(range);
    editor.edit((editBuilder) => {
      editBuilder.insert(position, text+'\n');
    });
  };

  let disposable = vscode.commands.registerCommand(
    "code-assist.helloWorld",
    function () {
      vscode.window.showInformationMessage("Code-assist works!");
    }
  );

  let createReactComponent = vscode.commands.registerCommand(
    "code-assist.createReactComponent",
    async (e) => {
      const { path } = e;
      console.log(path);
      const userInput = await vscode.window.showInputBox({
        prompt: "enter the component name: ",
        value: "",
        placeHolder: '(example - "Signup" or "signup")',
      });
      let fileName = nameFormatter(userInput);
      let uri = vscode.Uri.joinPath(e, fileName);
      console.log(uri);
      await vscode.workspace.fs.writeFile(
        uri,
        Buffer.from(
          syntax.createReactComponent(nameFormatter(userInput, false)),
          "utf8"
        )
      );
      openFile(uri);
    }
  );

  let createImportReactComponent = vscode.commands.registerCommand(
    "code-assist.createImportReactComponent",
    async (uri) => {
      const { path } = uri;
      console.log(path);
      const userInput = await vscode.window.showInputBox({
        prompt: "enter the component name: ",
        value: "",
        placeHolder: '(example - "Signup" or "signup")',
      });
      let fileName = nameFormatter(userInput);
      let fileUri = vscode.Uri.joinPath(uri, fileName);
      console.log(fileUri);
      await vscode.workspace.fs.writeFile(
        fileUri,
        Buffer.from(
          syntax.createReactComponent(nameFormatter(userInput, false)),
          "utf8"
        )
      );
      const appPath = uri.path.split("/").slice(0, -1).join("/");
      const compUri = uri.path.split("/").at(-1);
      const appUri = uri.with({ path: appPath });
      prependLineToFile(appUri, `import ${toCamelCase(userInput)} from './${compUri}/${toCamelCase(userInput)}'`);
      openFile(fileUri);
    }
  );

  let createReactComponentWithCSS = vscode.commands.registerCommand(
    "code-assist.createReactComponentWithCSS",
    async (e) => {
      const { path } = e;
      console.log(path);
      const userInput = await vscode.window.showInputBox({
        prompt: "enter the component name: ",
        value: "",
        placeHolder: '(example - "Signup" or "signup")',
      });
      let fileName = nameFormatter(userInput);
      let JSuri = vscode.Uri.joinPath(e, fileName);
      let CSSuri = vscode.Uri.joinPath(e, getFileName(userInput, ".css"));
      //   console.log(uri);
      await vscode.workspace.fs.writeFile(
        JSuri,
        Buffer.from(
          syntax.createReactComponent(nameFormatter(userInput, false)),
          "utf8"
        )
      );
      await vscode.workspace.fs.writeFile(CSSuri, Buffer.from("", "utf8"));
      openFile(JSuri);
    }
  );

//   let getFilePath = vscode.commands.registerCommand(
//     "code-assist.getFilePath",
//     async (uri) => {
//       let { path } = uri;
//       console.log(path);
//       const pathWithoutDirectory = uri.path.split("/").slice(0, -1).join("/");

//       // Create a new Uri object with the updated path
//       path = uri.with({ path: pathWithoutDirectory }).path;
//       console.log(path);
//     }
//   );

  context.subscriptions.push(disposable);
  context.subscriptions.push(createReactComponent);
  context.subscriptions.push(createImportReactComponent);
  context.subscriptions.push(createReactComponentWithCSS);
//   context.subscriptions.push(getFilePath);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
