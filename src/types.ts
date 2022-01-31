// supported command
export type SupportedCommands = 'PLACE' | 'MOVE' | 'LEFT' | 'RIGHT' | 'REPORT';

// cardinal directions union
export type CardinalDirection = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

// cardinal direction config type
export type CardinalDirectionConfig = {
    leftDirection: CardinalDirection,
    rightDirection: CardinalDirection,
    moveFunction: (x: number, y: number) => [number, number],
};

export type Response = {
    success: boolean;
    message?: string;
};