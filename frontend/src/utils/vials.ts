import { Type, VialImages } from "./constants";

const ThreeDCharacterVial = {
    name: "3D Character",
    image: VialImages.purpleVialImage,
    description: "A vial of liquid. Can be used to brew a new 3D Character Experiment.",
    type: Type.threeDCharacter,
}

const ComicArtVial = {
    name: "Comic Art",
    image: VialImages.yellowVialImage,
    description: "A vial of liquid. Can be used to brew a new Comic Art Experiment.",
    type: Type.comicArt,
}

const RealisticAnimeVial = {
    name: "Realistic Anime",
    image: VialImages.greenVialImage,
    description: "A vial of liquid. Can be used to brew a new Realistic Anime Experiment.",
    type: Type.realisticAnime,
}

const CuteCreatureVial = {
    name: "Cute Creature",
    image: VialImages.blueVialImage,
    description: "A vial of liquid. Can be used to brew a new Cute Creature Experiment.",
    type: Type.cuteCreature,
}

const LowPolyCreatureVial = {
    name: "Low Poly Creature",
    image: VialImages.orangeVialImage,
    description: "A vial of liquid. Can be used to brew a new Low Poly Creature Experiment.",
    type: Type.lowPolyCreature,
}

const RenderedObjectVial = {
    name: "Rendered Object",
    image: VialImages.brownVialImage,
    description: "A vial of liquid. Can be used to brew a new Rendered Object Experiment.",
    type: Type.renderedObject,
}

const IsometricRoomsVial = {
    name: "Isometric Rooms",
    image: VialImages.redVialImage,
    description: "A vial of liquid. Can be used to brew a new Isometric Rooms Experiment.",
    type: Type.isometricRooms,
}

export const Vials = [
    ThreeDCharacterVial,
    ComicArtVial,
    RealisticAnimeVial,
    CuteCreatureVial,
    LowPolyCreatureVial,
    RenderedObjectVial,
    IsometricRoomsVial,
]