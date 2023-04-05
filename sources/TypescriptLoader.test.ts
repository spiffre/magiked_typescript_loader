import { assert, assertExists, assertRejects } from "../deps/std/assert.ts";
import * as path from "../deps/std/path.ts"

import { Walker } from "../deps/magiked.ts"
import { ts } from "../deps/typescript.ts"
import type { TS } from "../deps/typescript.ts"

import type { JsPayload, TsPayload, TypescriptLoaderOptions } from "./TypescriptLoader.ts"
import { parseJsTsString } from "./TypescriptLoader.ts"

const DATA_BASE_PATH = "tests/"
const OPTIONS: TypescriptLoaderOptions = { target : ts.ScriptTarget.ES2022, parents : false }

Deno.test("loaders, default loaders (js, es modules)", () =>
{
	const sample = `
	  import { export1 } from "module-name"
	`
	const source = parseJsTsString(sample, OPTIONS)
	debugger
});
