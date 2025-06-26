//#region src/tag.ts
let NBTTag = /* @__PURE__ */ function(NBTTag$1) {
	NBTTag$1[NBTTag$1["EndOfCompound"] = 0] = "EndOfCompound";
	NBTTag$1[NBTTag$1["Byte"] = 1] = "Byte";
	NBTTag$1[NBTTag$1["Short"] = 2] = "Short";
	NBTTag$1[NBTTag$1["Int"] = 3] = "Int";
	NBTTag$1[NBTTag$1["Long"] = 4] = "Long";
	NBTTag$1[NBTTag$1["Float"] = 5] = "Float";
	NBTTag$1[NBTTag$1["Double"] = 6] = "Double";
	NBTTag$1[NBTTag$1["ByteArray"] = 7] = "ByteArray";
	NBTTag$1[NBTTag$1["String"] = 8] = "String";
	NBTTag$1[NBTTag$1["List"] = 9] = "List";
	NBTTag$1[NBTTag$1["Compound"] = 10] = "Compound";
	NBTTag$1[NBTTag$1["IntArray"] = 11] = "IntArray";
	NBTTag$1[NBTTag$1["LongArray"] = 12] = "LongArray";
	return NBTTag$1;
}({});

//#endregion
//#region src/nbt.ts
var StaticNBT = class {
	constructor(reader, writer) {
		this.reader = reader;
		this.writer = writer;
	}
	readProperty(dataProvider) {
		const type = this.reader.readType(dataProvider);
		const key = this.reader[NBTTag.String](dataProvider);
		if (type === NBTTag.EndOfCompound) return {
			type,
			key,
			value: null
		};
		const value = this.reader[type](dataProvider);
		return {
			type,
			key,
			value
		};
	}
	readValueExplicit(dataProvider, tag) {
		return this.reader[tag](dataProvider);
	}
	readValue(dataProvider) {
		const type = this.reader.readType(dataProvider);
		if (type === NBTTag.EndOfCompound) return null;
		return this.reader[type](dataProvider);
	}
};

//#endregion
//#region src/base/data-provider.ts
var StaticDataProvider = class {
	static alloc(size) {
		return new this(new DataView(new ArrayBuffer(size)));
	}
	uint8Array;
	constructor(uint8Array, pointer = 0) {
		this.view = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
		this.pointer = pointer;
		this.uint8Array = uint8Array;
	}
};

//#endregion
//#region src/base/general.ts
var GeneralNBTFormatReader = class {
	constructor(littleEndian = true, textEncoder = new TextDecoder()) {
		this.littleEndian = littleEndian;
		this.textEncoder = textEncoder;
	}
	static {
		this.prototype.readType = this.prototype[NBTTag.Byte];
	}
	readType(_) {
		return NBTTag.EndOfCompound;
	}
	readArrayLength(dataProvider) {
		return this[NBTTag.Int](dataProvider);
	}
	readStringLength(dataProvider) {
		return this[NBTTag.Short](dataProvider);
	}
	[NBTTag.Byte](dataProvider) {
		return dataProvider.view.getUint8(dataProvider.pointer++);
	}
	[NBTTag.Short](dataProvider) {
		const _ = dataProvider.view.getInt16(dataProvider.pointer, this.littleEndian);
		return dataProvider.pointer += 2, _;
	}
	[NBTTag.Int](dataProvider) {
		const _ = dataProvider.view.getInt32(dataProvider.pointer, this.littleEndian);
		return dataProvider.pointer += 4, _;
	}
	[NBTTag.Long](dataProvider) {
		const _ = dataProvider.view.getBigInt64(dataProvider.pointer, this.littleEndian);
		return dataProvider.pointer += 8, _;
	}
	[NBTTag.Float](dataProvider) {
		const _ = dataProvider.view.getFloat32(dataProvider.pointer, this.littleEndian);
		return dataProvider.pointer += 4, _;
	}
	[NBTTag.Double](dataProvider) {
		const _ = dataProvider.view.getFloat64(dataProvider.pointer, this.littleEndian);
		return dataProvider.pointer += 8, _;
	}
	[NBTTag.ByteArray](dataProvider) {
		const length = this.readArrayLength(dataProvider);
		return dataProvider.uint8Array.subarray(dataProvider.pointer, dataProvider.pointer += length);
	}
	[NBTTag.String](dataProvider) {
		const length = this.readStringLength(dataProvider);
		return this.textEncoder.decode(dataProvider.uint8Array.subarray(dataProvider.pointer, dataProvider.pointer += length));
	}
	[NBTTag.IntArray](dataProvider) {
		const length = this.readArrayLength(dataProvider);
		const _ = new Int32Array(length);
		const func = this[NBTTag.Int].bind(this, dataProvider);
		for (let i = 0; i < length; i++) _[i]=func();
		return _;
	}
	[NBTTag.LongArray](dataProvider) {
		const length = this.readArrayLength(dataProvider);
		const _ = new BigInt64Array(length);
		const func = this[NBTTag.Long].bind(this, dataProvider);
		for (let i = 0; i < length; i++) _[i] = func();
		return _;
	}
	[NBTTag.List](dataProvider) {
		const type = this.readType(dataProvider);
		const length = this.readArrayLength(dataProvider);
		if(length === 0) return [];
		if (!(type in this)) throw new SyntaxError("Unexpected NBT token type: " + type);
		const _ = new Array(length);
		const func = this[type].bind(this, dataProvider);
		for (let i = 0; i < length; i++) _[i] = func();
		return _;
	}
	[NBTTag.Compound](dataProvider) {
		const _ = Object.create(null);
		while (true) {
			const type = this.readType(dataProvider);
			if (type === NBTTag.EndOfCompound) break;
			const key = this[NBTTag.String](dataProvider);
			_[key] = this[type](dataProvider);
		}
		Reflect.setPrototypeOf(_, Object.prototype);
		return _;
	}
};
var GeneralNBTFormatWriter = class GeneralNBTFormatWriter {
	constructor(littleEndian = true, textEncoder = new TextEncoder()) {
		this.littleEndian = littleEndian;
		this.textEncoder = textEncoder;
	}
	static {
		this.prototype.writeType = this.prototype[NBTTag.Byte];
	}
	writeType(dataProvider, value) {
		this[NBTTag.Byte](dataProvider, value);
	}
	writeArrayLength(dataProvider, length) {
		this[NBTTag.Int](dataProvider, length);
	}
	writeStringLength(dataProvider, length) {
		this[NBTTag.Short](dataProvider, length);
	}
	[NBTTag.Byte](dataProvider, value) {
		dataProvider.view.setUint8(dataProvider.pointer++, value);
	}
	[NBTTag.Short](dataProvider, value) {
		dataProvider.view.setInt16(dataProvider.pointer, value, this.littleEndian);
		dataProvider.pointer += 2;
	}
	[NBTTag.Int](dataProvider, value) {
		dataProvider.view.setInt32(dataProvider.pointer, value, this.littleEndian);
		dataProvider.pointer += 4;
	}
	[NBTTag.Long](dataProvider, value) {
		dataProvider.view.setBigInt64(dataProvider.pointer, value, this.littleEndian);
		dataProvider.pointer += 8;
	}
	[NBTTag.Float](dataProvider, value) {
		dataProvider.view.setFloat32(dataProvider.pointer, value, this.littleEndian);
		dataProvider.pointer += 4;
	}
	[NBTTag.Double](dataProvider, value) {
		dataProvider.view.setFloat64(dataProvider.pointer, value, this.littleEndian);
		dataProvider.pointer += 8;
	}
	[NBTTag.ByteArray](dataProvider, value) {
		this.writeArrayLength(dataProvider, value.length);
		dataProvider.uint8Array.set(value, dataProvider.pointer);
		dataProvider.pointer += value.length;
	}
	[NBTTag.String](dataProvider, value) {
		const encoded = this.textEncoder.encode(value);
		this.writeStringLength(dataProvider, encoded.length);
		dataProvider.uint8Array.set(encoded, dataProvider.pointer);
		dataProvider.pointer += encoded.length;
	}
	[NBTTag.IntArray](dataProvider, value) {
		const length = value.length;
		this.writeArrayLength(dataProvider, length);
		for (let i = 0; i < length; i++) this[NBTTag.Int](dataProvider, value[i]);
	}
	[NBTTag.LongArray](dataProvider, value) {
		const length = value.length;
		this.writeArrayLength(dataProvider, length);
		for (let i = 0; i < length; i++) this[NBTTag.Long](dataProvider, value[i]);
	}
	[NBTTag.List](dataProvider, value, typeHint) {
		this.writeType(dataProvider, typeHint ??= GeneralNBTFormatWriter.determineType(value[0] ?? 0, this.NUMBER_FORMAT));
		this.writeArrayLength(dataProvider, value.length);
		if (!(typeHint in this)) throw new SyntaxError(`Unexpected NBT token type: ${typeHint}`);
		for (let i = 0; i < value.length; i++) this[typeHint](dataProvider, value[i]);
	}
	[NBTTag.Compound](dataProvider, value) {
		for (const key of Object.keys(value)) {
			const v = value[key];
			const type = GeneralNBTFormatWriter.determineType(v, this.NUMBER_FORMAT);
			if (type === NBTTag.EndOfCompound) return;
			this.writeType(dataProvider, type);
			this[NBTTag.String](dataProvider, key);
			this[type](dataProvider, v);
		}
		this.writeType(dataProvider, NBTTag.EndOfCompound);
	}
	NUMBER_FORMAT = NBTTag.Float;
	static determineType(value, numberFormat) {
		if (typeof value === "number") return numberFormat;
		if (typeof value === "bigint") return NBTTag.Long;
		if (typeof value === "string") return NBTTag.String;
		if (Array.isArray(value)) return NBTTag.List;
		if (value instanceof Uint8Array) return NBTTag.ByteArray;
		if (value instanceof Int32Array) return NBTTag.Int;
		if (value instanceof BigInt64Array) return NBTTag.LongArray;
		if (value instanceof Int8Array) return NBTTag.ByteArray;
		if (value instanceof Uint32Array) return NBTTag.IntArray;
		if (value instanceof BigUint64Array) return NBTTag.LongArray;
		if (typeof value === "object") return NBTTag.Compound;
		return NBTTag.EndOfCompound;
	}
};

//#endregion
export { GeneralNBTFormatReader, GeneralNBTFormatWriter, NBTTag, StaticDataProvider, StaticNBT };