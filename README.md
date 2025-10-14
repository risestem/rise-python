# Rise Python - Online Python Compiler

A modern, in-browser Python compiler built with Skulpt.js, Ace Editor, and Tailwind CSS. This project provides a simple and efficient way to write and execute Python code directly in your web browser, without any server-side dependencies.

This project was inspired by [online-python-compiler by ishaanbhimwal](https://github.com/ishaanbhimwal/online-python-compiler).

## Features

- **In-Browser Python Execution**: Uses [Skulpt.js](http://skulpt.org/) to run Python 3 code directly in the browser.
- **Advanced Code Editor**: Integrates the [Ace Editor](https://ace.c9.io/) for syntax highlighting, autocompletion, and themes.
- **Modern & Responsive UI**: Styled with [Tailwind CSS](https://tailwindcss.com/) for a clean, dark-themed, and responsive interface.
- **File Operations**:
    - **Open**: Load Python files from your local machine.
    - **Save**: Save your code to the browser's local storage.
    - **Download**: Download your code as a `.py` file.
- **Share Code**: Generate a shareable URL that includes your current code.
- **Keyboard Shortcuts**: Common actions are mapped to keyboard shortcuts for efficiency.
- **Client-Side**: No backend required. The entire application runs on the client-side.

## How to Use

Simply open the `index.html` file in a modern web browser.

1.  Write your Python code in the editor.
2.  Click the **Run** button (or press `Ctrl+Enter`) to execute the code.
3.  The output will be displayed in the console panel at the bottom.

## Technologies Used

- **Skulpt.js**: For in-browser Python execution.
- **Ace Editor**: As the code editor component.
- **Tailwind CSS**: For styling the user interface.
- **Font Awesome**: For icons.
