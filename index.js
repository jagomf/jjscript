const { resolve, dirname, basename } = require('path');
const { createWriteStream, unlinkSync, promises } = require('fs');
const Archiver = require('archiver');

// SETUP VARS
const extension = 'dwg';
const deleteAfter = true;
// END SETUP

const folderToScan = dirname(__dirname); // one level above this script

/**
 * Recursively scans and returns valid filenames
 * @param {string} dir Directory to scan
 * @returns {string[]} list of files
 */
async function* getValidFiles(dir) {
    const dirents = await promises.readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            yield* getValidFiles(res);
        } else if (dirent.name.endsWith(`.${extension}`)) {
            yield res;
        }
    }
}

/**
 * Compresses files
 * @param {string} filepath Full path of file to zip
 * @returns {Promise<number>} `Promise` that resolves with the amount of bytes written when ok or rejects if error
 */
function compress(filepath) {
    return new Promise((resolve, reject) => {
        const zippedDestName = filepath.replace(`.${extension}`, '.zip');
        const output = createWriteStream(zippedDestName);
        const archive = Archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            resolve(archive.pointer());
        });

        output.on('end', () => {
            reject(new Error('Data has been drained'));
        });

        archive.on('warning', err => {
            if (err.code === 'ENOENT') {
                console.log(`WARN ${filepath}`, err.message);
            } else {
                reject(err);
            }
        });

        archive.on('error', err => {
            reject(err);
        });

        archive.pipe(output);

        const name = basename(filepath);
        archive.file(filepath, { name });

        archive.finalize();
    });
}

; (async () => {
    let processed = 0, zipped = 0, deleted = 0;
    for await (const f of getValidFiles(folderToScan)) {
        processed++;
        try {
            const bytes = await compress(f);
            zipped++;
            console.log(`ZIPPED ${f}. Size: ${bytes} bytes.`);

            if (deleteAfter) {
                unlinkSync(f); // sync delete errors can be handled by catch
                deleted++;
            }
        } catch(e) {
            console.log(`ERROR ${f}`, e.message);
        }
    }

    console.log(`Processed ${processed} files.`);
    if (processed) {
        console.log(`Zipped ${zipped} files.`);
        console.log(`Deleted ${deleted} files.`);
    }
})()
