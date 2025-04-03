import { google } from 'googleapis';
import * as fs from 'fs';
import { config } from './config.js';

const { KEY_FILE, SCOPE, SPREAD_SHEET_ID, RANGE, EXPORT_PATH } = config;

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: SCOPE,
});

const sheets = google.sheets({ version: 'v4', auth });

sheets.spreadsheets.values.get({
    spreadsheetId: SPREAD_SHEET_ID,
    range: RANGE,
}, (err, res) => {
    if (err) {
        return console.log('Ошибка получения данных: ', err);
    }

    const rows = res?.data.values;

    if (rows?.length) {
        const languages = rows[0].slice(1);
        const translations = {};

        languages.forEach(language => {
            translations[language] = {};
        });

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const key = row[0];

            languages.forEach((language, index) => {
                translations[language][key] = row[index + 1];
            });
        }

        if (!fs.existsSync(EXPORT_PATH)) {
            fs.mkdirSync(EXPORT_PATH, { recursive: true });
        }

        languages.forEach(language => {
            fs.writeFileSync(`${EXPORT_PATH}/${language}.json`, JSON.stringify(translations[language], null, 2));
        });

        console.log('Переводы успешно сохранены в JSON файлах');
    } else {
        console.log('Нет данных для сохранения');
    }
});