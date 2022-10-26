declare namespace NodeJS {
    interface ProcessEnv {
        PRIVATE_KEY: string;
        ALCHEMY_URL: string;
        AURORA_URL: string;
        AURORA_PRIVATE_KEY: string;
        INFURA_API_KEY: string;
    }
}
