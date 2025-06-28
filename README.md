# file-validator-component ⚡

![license](https://img.shields.io/badge/license-MIT-green)
[![npm](https://img.shields.io/badge/npm-0.1.5-blue)](https://www.npmjs.com/package/file-validator-component)

A component used for importing XLS / XLSX / CSV documents built with [**Material UI**](https://mui.com/). Import flow combines:

- 📥 Uploader
- ⚙️ Parser
- 📊 File preview
- 🧪 UI for column mapping
- ✏ UI for validating and editing data

## Features

- Custom styles - edit Material UI theme to match your project's styles 🎨
- Custom validation rules - make sure valid data is being imported, easily spot and correct errors
- Hooks - alter raw data after upload or make adjustments on data changes
- Auto-mapping columns - automatically map most likely value to your template values, e.g. `name` -> `firstName`

## Installation

```bash
npm i file-validator-component
```

## Publishing

To publish, first build the bundle

- `yarn build`

Then run the publish script, which will prompt you to login to npm. Use your github username for Username and your github token for Password.

- `yarn publish`

## Contributing

Feel free to open issues if you have any questions or notice bugs. If you want different component behaviour, consider forking the project.

## Credits

Modified by Muhammad H. Shahzad
