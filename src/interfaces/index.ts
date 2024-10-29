export interface ITripWithMagicMover {
    id: number;
    name: string;
    quest_state: string;
    magic_mover_id: number;
    magic_mover_info: {
        id: number;
        weight: number;
        energy: number;
    };
}
export interface IMagicMoverWithProfile {
    id: number;
    weight: number;
    energy: number;
    createdAt: Date;
    profile_info: {
        id: number;
        name: string;
        email: string;
        picture: string;
    };
}
