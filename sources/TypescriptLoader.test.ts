import { assert } from "../deps/std/assert.ts";
import * as path from "../deps/std/path.ts"

import { Walker } from "../deps/magiked.ts"
import { ts } from "../deps/typescript.ts"

import type { JsPayload, TsPayload, TypescriptLoaderOptions } from "./TypescriptLoader.ts"
import { defaultTypescriptLoader } from "./TypescriptLoader.ts"

const DATA_BASE_PATH = "tests/"
const OPTIONS: TypescriptLoaderOptions = { target : ts.ScriptTarget.ES2022, parents : false }

Deno.test("ts loader", async () =>
{
	const dir = path.resolve(DATA_BASE_PATH)

	const walker = new Walker<JsPayload|TsPayload>()
	await walker.init(dir,
	{
		handlers :
		{
			".js" :
			{
				loader : defaultTypescriptLoader,
				options : OPTIONS as unknown as Record<string, unknown>  // fixme: this is annoying
			},
			
			".ts" :
			{
				loader : defaultTypescriptLoader,
				options : OPTIONS as unknown as Record<string, unknown>  // fixme: this is annoying
			}
		}
	})
	
	const node = walker.pathAsStringToNode('one.ts')
	assert(node && node.kind == 'FILE')
	
	const payload = node.payload
	assert(payload)
	
	const statement = payload.rootAst.statements[0]
	assert(statement)

	assert(statement.kind == ts.SyntaxKind.FunctionDeclaration)
});
