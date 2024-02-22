export const ASSET_CONFIG: { [key: string]: any } = {};

export function setAssetConfig(key: string, value: any) {
  ASSET_CONFIG[key] = value;
}
