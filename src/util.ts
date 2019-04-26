import * as d from './declarations';
import * as fs from 'fs';
import * as path from 'path';


export function usePlugin(fileName: string) {
  if (typeof fileName === 'string') {
    return /(\.scss|\.sass)$/i.test(fileName);
  }
  return true;
}


export function getContext(context: d.PluginCtx) {
  context = context || {} as any;

  if (!Array.isArray(context.diagnostics)) {
    context.diagnostics = [];
  }

  context.config = context.config || {};

  if (typeof context.config.rootDir !== 'string') {
    context.config.rootDir = __dirname;
  }

  if (typeof context.config.srcDir !== 'string') {
    context.config.srcDir = __dirname;
  }

  context.fs = context.fs || {};

  if (typeof context.fs.readFileSync !== 'function') {
    context.fs.readFileSync = (filePath: string) => {
      return fs.readFileSync(filePath, 'utf8');
    };
  }

  if (typeof context.fs.writeFile !== 'function') {
    context.fs.writeFile = () => {
      return Promise.resolve();
    };
  }

  return context;
}


export function getRenderOptions(opts: d.PluginOptions, sourceText: string, fileName: string, context: d.PluginCtx) {
  // create a copy of the original sass config so we don't change it
  const renderOpts = Object.assign({}, opts);

  // always set "data" from the source text
  renderOpts.data = sourceText;

  renderOpts.includePaths = Array.isArray(opts.includePaths) ? opts.includePaths.slice() : [];

  // add the directory of the source file to includePaths
  renderOpts.includePaths.push(path.dirname(fileName));

  renderOpts.includePaths = renderOpts.includePaths.map(includePath => {
    if (path.isAbsolute(includePath)) {
      return includePath;
    }
    // if it's a relative path then resolve it with the project's root directory
    return path.resolve(context.config.rootDir, includePath);
  });

  const injectGlobalPaths = Array.isArray(opts.injectGlobalPaths) ? opts.injectGlobalPaths.slice() : [];

  if (injectGlobalPaths.length > 0) {
    // automatically inject each of these paths into the source text
    const injectText = injectGlobalPaths.map(injectGlobalPath => {
      if (!path.isAbsolute(injectGlobalPath)) {
        // convert any relative paths to absolute paths relative to the project root
        injectGlobalPath = normalizePath(path.join(context.config.rootDir, injectGlobalPath));
      }

      return `@import "${injectGlobalPath}";`;
    }).join('');

    renderOpts.data = injectText + renderOpts.data;
  }

  // remove non-standard node-sass option
  delete renderOpts.injectGlobalPaths;

  // the "file" config option is not valid here
  delete renderOpts.file;

  return renderOpts;
}


export function createResultsId(fileName: string) {
  // create what the new path is post transform (.css)
  const pathParts = fileName.split('.');
  pathParts[pathParts.length - 1] = 'css';
  return pathParts.join('.');
}

export function normalizePath(str: string) {
  // Convert Windows backslash paths to slash paths: foo\\bar ➔ foo/bar
  // https://github.com/sindresorhus/slash MIT
  // By Sindre Sorhus
  if (typeof str !== 'string') {
    throw new Error(`invalid path to normalize`);
  }
  str = str.trim();

  if (EXTENDED_PATH_REGEX.test(str) || NON_ASCII_REGEX.test(str)) {
    return str;
  }

  str = str.replace(SLASH_REGEX, '/');

  // always remove the trailing /
  // this makes our file cache look ups consistent
  if (str.charAt(str.length - 1) === '/') {
    const colonIndex = str.indexOf(':');
    if (colonIndex > -1) {
      if (colonIndex < str.length - 2) {
        str = str.substring(0, str.length - 1);
      }

    } else if (str.length > 1) {
      str = str.substring(0, str.length - 1);
    }
  }

  return str;
}

const EXTENDED_PATH_REGEX = /^\\\\\?\\/;
const NON_ASCII_REGEX = /[^\x00-\x80]+/;
const SLASH_REGEX = /\\/g;
