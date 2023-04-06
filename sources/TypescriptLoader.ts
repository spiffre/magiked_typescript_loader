import * as path from "../deps/std/path.ts"

import type { Payload } from "../deps/magiked.ts"

import { ts } from "../deps/typescript.ts"
import type { TS } from "../deps/typescript.ts"


export interface TsPayload extends Payload
{
	type: 'typescript'
	ast: TS.SourceFile
	ext?: string
}


export interface TypescriptLoaderOptions
{
	target: TS.ScriptTarget
	parents: boolean
	filepath?: string
}

const DEFAULT_OPTIONS = { target : ts.ScriptTarget.ES2022, parents : true }


export function processorForTypescript (code: string, options: Partial<TypescriptLoaderOptions> = {}): TsPayload
{
	const opts = { ...DEFAULT_OPTIONS, ...options }
	const filepath = opts.filepath ?? 'code_fragment'
	
	let source: TS.SourceFile | undefined
	
	try
	{
		source = ts.createSourceFile(
			filepath,
			code,
			opts.target,
			opts.parents
		)
	}
	catch (error)
	{
		throw new Error(`Failed to parse file: ${filepath}`, { cause : error })
	}
	
	if (opts.filepath)
	{
		const ext = path.extname(filepath)
		
		return {
			type : 'typescript',
			ast : source,
			ext
		}
	}
	
	return {
		type : 'typescript',
		ast : source
	}
}
