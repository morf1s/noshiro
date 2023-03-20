type Config = {
  ownerIds: string[];
  lavanodes: LavaNode[];
  intents: string[];
  defaultPrefix: string;
};

type LavaNode = {
  name: string;
  url: string;
  auth: string;
  secure: boolean;
};
