import { DefaultConfig } from "./config.default";

export default () => {
  const config: DefaultConfig = {};
  config.cluster = {
    listen: {
      port: 80,
      hostname: "0.0.0.0"
      // path: '/var/run/egg.sock',
    }
  };
  return config;
};
