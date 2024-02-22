export const SERVER_CONFIG: { [key: string]: any } = {};

export function setServerConfig(key: string, value: any) {
  SERVER_CONFIG[key] = value;
}
