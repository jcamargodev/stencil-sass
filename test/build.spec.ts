import { sass } from '../src';

import * as fs from 'fs';
import * as path from 'path';
import { PluginCtx } from '@stencil/core/internal';


describe('test build', () => {
  let context: PluginCtx;

  beforeEach(() => {
    context = {
      config: {
        rootDir: '/Users/my/app/',
        srcDir: '/Users/my/app/src/',
      },
      cache: null,
      sys: {} as any,
      fs: {
        readFileSync(filePath: string) {
          return fs.readFileSync(filePath, 'utf8');
        },
        writeFile() {
          return Promise.resolve();
        }
      } as any,
      diagnostics: []
    };
  });

  it('transform', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-a.scss');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    const results = await s.transform(sourceText, filePath, context) as any;
    expect(results.code).toContain('color: red');
    expect(results.diagnostics).toEqual(undefined);
  });

  it('transform, import', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-b.scss');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    const results = await s.transform(sourceText, filePath, context) as any;
    expect(results.code).toContain('color: red');
    expect(results.diagnostics).toEqual(undefined);
  });

  it('transform, error', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-c.scss');
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const s = sass();

    await s.transform(sourceText, filePath, context);
    expect(context.diagnostics).toHaveLength(1);
    expect(context.diagnostics[0].level).toEqual('error');
    expect(context.diagnostics[0].language).toEqual('scss');
    expect(context.diagnostics[0].lineNumber).toEqual(1);
    expect(context.diagnostics[0].columnNumber).toEqual(17);
    expect(context.diagnostics[0].lines.length).toEqual(2);

    expect(context.diagnostics[0].lines[0].lineIndex).toEqual(0);
    expect(context.diagnostics[0].lines[0].lineNumber).toEqual(1);
    expect(context.diagnostics[0].lines[0].errorCharStart).toEqual(16);
    expect(context.diagnostics[0].lines[0].errorLength).toEqual(1);
    expect(context.diagnostics[0].lines[0].text).toEqual('body{color:blue}');

    expect(context.diagnostics[0].lines[1].lineIndex).toEqual(1);
    expect(context.diagnostics[0].lines[1].lineNumber).toEqual(2);
    expect(context.diagnostics[0].lines[1].errorCharStart).toEqual(-1);
    expect(context.diagnostics[0].lines[1].errorLength).toEqual(-1);
    expect(context.diagnostics[0].lines[1].text).toEqual('');

  });

  it('name', async () => {
    const s = sass();
    expect(s.name).toBe('sass');
  });

});
