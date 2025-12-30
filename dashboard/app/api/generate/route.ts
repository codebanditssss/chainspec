import { NextResponse } from 'next/server';
import { SpecParser } from '@/lib/engine/parser/spec-parser';
import { SolidityGenerator } from '@/lib/engine/generator/generator';

export async function POST(req: Request) {
    try {
        const { markdown, templateName } = await req.json();

        if (!markdown) {
            return NextResponse.json({ error: 'Markdown content is required' }, { status: 400 });
        }

        console.log("📝 Parsing Markdown Spec...");

        // 1. Parse the Spec
        const spec = SpecParser.parse(markdown);

        // 2. Determine Template
        // Smart Logic: If spec says "Type: Vault", use Vault template. 
        // For now, simple fallback or use provided param.
        const template = templateName || (spec.contractName.toLowerCase().includes('vault') ? 'DAOVault_Template' : 'ERC20_Template');

        console.log(`🏭 Generating Contract using template: ${template}`);

        // 3. Generate Code
        const code = SolidityGenerator.generateContract(spec, template);

        // 4. Save to Disk (Optional but useful for hardhat)
        let savedPath = '';
        try {
            // Note: In deployed Vercel env, filesystem is read-only. This only works locally.
            savedPath = SolidityGenerator.writeToFile(code, spec.contractName);
            console.log(`💾 Saved to: ${savedPath}`);
        } catch (err) {
            console.warn('⚠️ Could not save file to disk (expected if on Vercel):', err);
        }

        return NextResponse.json({
            success: true,
            code,
            savedPath,
            spec,
            templateUsed: template
        });

    } catch (error) {
        console.error('❌ Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate contract', details: String(error) }, { status: 500 });
    }
}
