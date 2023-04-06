import type { Payload } from "../deps/magiked.ts"

import { ts } from "../deps/typescript.ts"
import type { TS } from "../deps/typescript.ts"


export interface JsPayload extends Payload
{
	type: 'javascript'
	ast: TS.SourceFile
}

export interface TsPayload extends Payload
{
	type: 'typescript'
	ast: TS.SourceFile
}


export interface TypescriptLoaderOptions
{
	target: TS.ScriptTarget
	parents: boolean
	filepath?: string
}

const DEFAULT_OPTIONS = { target : ts.ScriptTarget.ES2022, parents : true }


export function processorForTypescript (code: string, options: Partial<TypescriptLoaderOptions> = {}): JsPayload|TsPayload
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
	
	//const ext = path.extname(filepath)
	//if (ext == '.js')
	//{
	//	return {
	//		type : 'javascript',
	//		extension : '.js',
	//		
	//		rootAst
	//	}
	//}
	//else if (ext == '.ts')
	{
		return {
			type : 'typescript',
			ast : source
		}
	}
	//else
	//{
	//	throw new Error(`Unexpected file extension: "${ext}" for file:\n${filepath}`)
	//}
}
