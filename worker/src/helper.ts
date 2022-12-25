type KVPair = {
  key: string;
  value: string;
};

export async function getMatches(
  prefix: string,
  PRFX_KV: KVNamespace
): Promise<KVPair[]> {
  // try to save a list operation if possible
  const value = await PRFX_KV.get(prefix);
  if (value) {
    return [{ key: prefix, value: value }];
  }

  // otherwise, do a full list operation
  const listResult = await PRFX_KV.list<{ value: string }>({
    prefix: prefix,
  });
  if (listResult.keys.length === 0) {
    return [];
  }

  return listResult.keys.map((key) => ({
    key: key.name,
    value: key?.metadata?.value!,
  }));
}
