import * as path from "../deps/std/path.ts"

import type { Payload } from "../deps/magiked.ts"

import { ts } from "../deps/typescript.ts"
import type { TS } from "../deps/typescript.ts"


export interface JsPayload extends Payload
{
	type: 'javascript'
	extension: '.js'

	rootAst: TS.SourceFile
}

export interface TsPayload extends Payload
{
	type: 'typescript'
	extension: '.ts'

	rootAst: TS.SourceFile
}


export interface TypescriptLoaderOptions
{
	target: TS.ScriptTarget
	parents: boolean
}

const DEFAULT_OPTIONS = { target : ts.ScriptTarget.ES2022, parents : true }


export async function defaultTypescriptLoader (filepath: string, options: Partial<TypescriptLoaderOptions> = {}): Promise<JsPayload|TsPayload>
{
	let rootAst
	
	try
	{
		rootAst = await parseJsTsFile(filepath, { ...DEFAULT_OPTIONS, ...options })
	}
	catch (error)
	{
		throw new Error(`Failed to parse file: ${filepath}`, { cause : error })
	}
	
	const ext = path.extname(filepath)
	if (ext == '.js')
	{
		return {
			type : 'javascript',
			extension : '.js',
			
			rootAst
		}
	}
	else if (ext == '.ts')
	{
		return {
			type : 'typescript',
			extension : '.ts',
			
			rootAst
		}
	}
	else
	{
		throw new Error(`Unexpected file extension: "${ext}" for file:\n${filepath}`)
	}
}



export async function parseJsTsFile (filepath: string, options: TypescriptLoaderOptions): Promise<TS.SourceFile>
{
	const contentAsString = await Deno.readTextFile(filepath)
	
	const source = ts.createSourceFile(
		filepath,
		contentAsString,
		options.target,
		options.parents
	)
	
	return source
}

export function parseJsTsString (code: string, options: TypescriptLoaderOptions): TS.SourceFile
{
	const source = ts.createSourceFile(
		'code_fragment',
		code,
		options.target,
		options.parents
	)
	
	return source
}

