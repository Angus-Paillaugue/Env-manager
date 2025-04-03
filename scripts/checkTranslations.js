import fs from 'node:fs/promises';
import chalk from 'chalk';

const messagesDir = 'src/lib/translations/messages';

const GREEN = chalk.green;
const RED = chalk.red;

async function checkTranslations() {
  let hasErrors = [];
  const translationFiles = await fs.readdir(messagesDir);
  const filePaths = translationFiles.map((file) => `${messagesDir}/${file}`);

  const translations = await Promise.all(
    filePaths.map(async (filePath) => {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    })
  );

  // Check for missing keys
  const flattenTranslations = (translations, prefix = '') => {
    return Object.entries(translations).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return {
          ...acc,
          ...flattenTranslations(value, `${prefix}${key}.`)
        };
      }
      acc[`${prefix}${key}`] = value;
      return acc;
    }, {});
  };
  const flattenedTranslationsLanguages = translations.reduce((acc, translation, index) => {
    const fileName = translationFiles[index].replace('.json', '');
    const flattened = flattenTranslations(translation);
    Object.keys(flattened).forEach((key) => {
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(fileName);
    });
    return acc;
  }, {});

  for (const [key, files] of Object.entries(flattenedTranslationsLanguages)) {
    if (files.length < translations.length) {
      const filesMissing = translationFiles.filter(
        (file) => !files.includes(file.replace('.json', ''))
      );
      hasErrors.push({
        type: 'Missing key',
        file: filesMissing.join(', '),
        message: `Key "${chalk.red.bold(key)}" is missing in "${chalk.cyan.bold(filesMissing.join('", "'))}" translation files`
      });
    }
  }

  if (hasErrors.length === 0) {
    console.log(GREEN('✓') + ' All translations are OK!');
    process.exit(0);
  } else {
    hasErrors.forEach(({ type, file, message }) => {
      console.log(RED('✖') + ` ${file} has errors:`);
      console.log(type + ': ' + message);
    });
    process.exit(1);
  }
}

checkTranslations();
