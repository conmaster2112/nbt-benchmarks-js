import { bench, run, group } from 'mitata';
import { GeneralNBTFormatReader, GeneralNBTFormatWriter, StaticDataProvider, StaticNBT } from './carolina.js';
import { parseUncompressed } from 'prismarine-nbt';
import { CompoundTag } from "@serenityjs/nbt";
import { BinaryStream } from '@serenityjs/binarystream';
import { Buffer } from "node:buffer";
import { summary } from 'mitata';
const BEDROCK_LITTLE_ENDIAN = new StaticNBT(new GeneralNBTFormatReader(true), new GeneralNBTFormatWriter(true));

const folder = new URL("../data/", import.meta.url);
for await (const entry of Deno.readDir(folder)) {
    if (!entry.isFile) continue;
    const fileURL = new URL(entry.name, folder);
    const stats = await Deno.stat(fileURL);
    const fileData = await Deno.readFile(fileURL);

    const nodeBuffer = Buffer.from(fileData);
    const serenityBuffer = new BinaryStream(nodeBuffer);
    const bedrockAPIsProvider = new StaticDataProvider(fileData);
    // Stats Info
    const info =
        `File: ${fileURL}
         Size: ${~~(stats.size/1024)} kb`
            .replaceAll(/(\n\r|\n|\r) */g, "\n• ");

    group(info, () => summary(async () => {
        bench('Bedrock APIs/carolina', () => {
            bedrockAPIsProvider.pointer = 0;
            BEDROCK_LITTLE_ENDIAN.readProperty(bedrockAPIsProvider);
        });
        bench('prismarine-nbt ArraySizeCheck', () => {
            parseUncompressed(nodeBuffer, "little", { noArraySizeCheck: false });
        });
        bench('prismarine-nbt', () => {
            parseUncompressed(nodeBuffer, "little", { noArraySizeCheck: true });
        });
        bench('@serenityjs/nbt', () => {
            serenityBuffer.offset = 0;
            CompoundTag.read(serenityBuffer, { type: true, name: true, varint: false });
        });
    }))
}
// run benchmark
await run();

