type UserInteractionState = {
    expire: number;
    timeout: NodeJS.Timeout;
    data: unknown;
}