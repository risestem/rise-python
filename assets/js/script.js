/**
 * Handles redirecting Skulpt's output to the 'output' textarea.
 * @param {string} text - The text to be output.
 */
function outf(text) {
    var mypre = document.getElementById("output");
    mypre.value = mypre.value + text;
}

/**
 * A required function for Skulpt to read built-in files.
 * @param {string} x - The file to read.
 * @returns {string} The content of the file.
 * @throws {string} If the file is not found.
 */
function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
}

/**
 * Executes the Python code from the editor using Skulpt.
 */
function run() {
    var t0 = (new Date()).getTime();
    var prog = editor.getValue();
    var mypre = document.getElementById("output");
    mypre.value = ''; // Clear previous output
    Sk.pre = "output";
    Sk.configure({
        inputfun: function (prompt) {
            return window.prompt(prompt);
        },
        inputfunTakesPrompt: true,
        output: outf,
        read: builtinRead,
        __future__: Sk.python3
    });
    var myPromise = Sk.misceval.asyncToPromise(function () {
        return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(function (mod) {
        var t1 = (new Date()).getTime();
        mypre.value = mypre.value + "\n" + "<completed in " + (t1 - t0) + " ms>";
    },
    function (err) {
        mypre.value = mypre.value + err.toString() + "\n";
        var t1 = (new Date()).getTime();
        mypre.value = mypre.value + "\n" + "<completed in " + (t1 - t0) + " ms>";
    });
};

/**
 * Main function to run the code and manage the UI.
 */
function main() {
    run();
    var mypre = document.getElementById("output");
    mypre.style.display = 'block'; // Ensure console is visible
    editor.resize(); // Adjust editor size
}

/**
 * Opens a file selected by the user and loads its content into the editor.
 */
function openFile() {
    var files = document.querySelector('input[type=file]').files;
    if (files.length == 0) return;

    var file = files[0];
    var reader = new FileReader();
    reader.onload = (e) => {
        var fileContent = e.target.result;
        editor.setValue(fileContent, -1); // -1 moves cursor to the start
    };

    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);
};

/**
 * Toggles the visibility of the output console.
 */
function toggleConsole() {
    var mypre = document.getElementById("output");
    if (mypre.style.display !== 'none') {
        mypre.style.display = 'none';
    } else {
        mypre.style.display = 'block';
    }
    editor.resize(); // Adjust editor size after toggling
}

/**
 * Saves the current code in the editor to the browser's local storage.
 */
function saveCode() {
    localStorage['risePythonSave'] = editor.getValue();
    window.alert("Code saved in browser's local storage!");
}

/**
 * Creates a downloadable file with the current code.
 */
function downloadCode() {
    var prog = editor.getValue();
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(prog);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'script.py';
    if (confirm('Download code as script.py?')) {
        hiddenElement.click();
    }
}

/**
 * Generates a shareable link containing the current code.
 */
function shareCode() {
    var link = window.location.href.split('?')[0] + "?code=" + encodeURIComponent(editor.getValue());
    window.prompt("Copy link to clipboard: Ctrl+C, Enter", link);
}

/**
 * Displays a list of keyboard shortcuts.
 */
function kbShortcuts() {
    window.alert(
        "Run : Ctrl+Enter\n" +
        "Open : Ctrl+Shift+O\n" +
        "Console : Ctrl+Shift+E\n" +
        "Save : Ctrl+Shift+S\n" +
        "Download : Ctrl+Shift+D\n" +
        "Share : Ctrl+Shift+A\n" +
        "Keyboard : Ctrl+Shift+K\n" +
        "Settings : Ctrl+,"
    );
}

/**
 * Shows the Ace editor's settings menu.
 */
function aceSettings() {
    editor.execCommand("showSettingsMenu");
}

// --- Event Listeners and Initialization ---

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();
        main();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "O") {
        event.preventDefault();
        document.querySelector('input[type=file]').click();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "E") {
        event.preventDefault();
        toggleConsole();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "S") {
        event.preventDefault();
        saveCode();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "D") {
        event.preventDefault();
        downloadCode();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "A") {
        event.preventDefault();
        shareCode();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "K") {
        event.preventDefault();
        kbShortcuts();
    }
});

// Initialize Ace Editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/vibrant_ink"); // Purple-toned dark theme
editor.session.setMode("ace/mode/python");
editor.setShowPrintMargin(false);

// Optional: remove some default keybindings if they conflict
editor.commands.removeCommand('findprevious');
editor.commands.removeCommand('duplicateSelection');
editor.commands.removeCommand('replaymacro');

// Enable auto-completion
ace.require("ace/ext/language_tools");
editor.setOptions({
    fontFamily: "Source Code Pro, monospace",
    fontSize: "15px",
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    autoScrollEditorIntoView: true,
});

// Load code from URL parameter if present
var params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
if (params.code != null) {
    editor.setValue(decodeURIComponent(params.code), -1);
} else {
    // Load saved code from local storage if no URL code
    var savedCode = localStorage['risePythonSave'];
    if (savedCode) {
        editor.setValue(savedCode, -1);
    }
}


// Event listener for the file input
document.querySelector('input[type=file]').addEventListener('change', () => {
    openFile();
});

// Warn user before closing the tab if they have unsaved code
window.addEventListener('beforeunload', function (event) {
    // A simple check could be to see if the editor content is different from the last saved state.
    // For now, we'll just show the prompt unconditionally as in the original script.
    event.preventDefault();
    event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
});

// Initially hide the console
toggleConsole();
