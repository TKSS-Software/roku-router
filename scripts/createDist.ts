import * as fsExtra from 'fs-extra';
import fastGlob from 'fast-glob';
import concat from 'concat';
import * as path from 'path';

/**
 * The final output directory after this script has finished
 */
const outDir = `${__dirname}/../dist/source/`;
/**
 * where the bsc-transpiled files reside
 */
const transpileDir = `${__dirname}/../.tmp/`;

async function run() {
    //clear the output directory and make sure it exists
    await fsExtra.emptyDirSync(outDir);
    await processLib();
    await processTypedefs();
}

/**
 * Merge and santitize all of the .brs files into a single roact.brs file
 */
async function processLib() {
    //find all .brs files
    const libPaths = (await fastGlob(['source/**/*.brs'], {
        cwd: transpileDir,
        absolute: true
        //sort the files for a consistent output format
    })).sort();

    //merge the .brs files together
    let result = (await concat(libPaths) as string);
    //sanize the code (remove namespace prefixes, de-indent some lines, etc)
    result = sanitizeCode(result);

    //write the final merged output file
    await fsExtra.outputFileSync(`${outDir}/roact.brs`, result, 'utf8');
}

/**
 * Merge and santitize all typedef files into a single `roact.d.bs` file
 */
async function processTypedefs() {
    //find all typedef files
    const typedefPaths = (await fastGlob(['source/**/*.d.bs'], {
        cwd: transpileDir,
        absolute: true
    }))
        // sort the files for output consistency
        .sort()
        //exclude internal typedefs
        .filter(x => !path.basename(x).startsWith('_'));

    //merge all the typedefs together
    let result = await concat(typedefPaths) as string;
    //sanize the code (remove namespace prefixes, de-indent some lines, etc)
    result = result
        //remove wrapping namespaces
        .replace(/^\s*(end\s*)?namespace.*\r?\n?/gm, '')
        //remove all leading whitespace
        .replace(/^[ \t]*/gm, '');
    result = sanitizeCode(result);

    await fsExtra.outputFile(`${outDir}/roact.d.bs`, result, 'utf8');
}

/**
 * Sanize the code (remove namespace prefixes, de-indent some lines, etc)
 */
function sanitizeCode(code: string) {
    return code
        //remove commented-out import statements
        .replace(/^'import.*\n?/mg, '')
        //remove de-indent lines
        .replace("' /**", "\n' /**")
        .replace(/^\s*end function.*$/gm, "end function \n")
        //remove prefixed namespace calls or function names
        .replace(/roact_/g, '')
        //remove all trailing whitespace on each line
        .replace(/[ \t]*$/gm, '')
        //remove newlines or blank lines from start of file
        .replace(/^[\r\n\s]*/, '')
        .trim()
}

run();