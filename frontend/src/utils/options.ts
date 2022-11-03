import type { Option } from "../../typings"
import * as prompts from '../utils/prompts'
import * as params from '../utils/params'

export const options: Option[] = [
    { value: '3DCharacter', label: '3D Character', prompt: prompts.prompt3DCharacter, params: params.params3DCharacter, placeholders: new Array<string>("character") },
    { value: 'comicArt', label: 'Comic Art', prompt: prompts.promptComicArt, params: params.paramsComicArt, placeholders: new Array<string>("character") },
    { value: 'realisticAnime', label: 'Realistic Anime', prompt: prompts.promptRealisticAnime, params: params.paramsRealisticAnime, placeholders: new Array<string>("face description") },
    { value: 'cuteCreature', label: 'Cute Creature', prompt: prompts.promptCuteCreature, params: params.paramsCuteCreature, placeholders: new Array<string>("creature") },
    { value: 'lowPolyCreature', label: 'Low Poly Creature', prompt: prompts.promptLowPolyCreature, params: params.paramsLowPolyCreature, placeholders: new Array<string>("creature") },
    { value: 'renderedObject', label: 'Rendered Object', prompt: prompts.promptRenderedObject, params: params.paramsRenderedObject, placeholders: new Array<string>("object") },
    { value: 'isometricRooms', label: 'Isometric Rooms', prompt: prompts.promptIsometricRooms, params: params.paramsIsometricRooms, placeholders: new Array<string>("room", "colors") },
    { value: 'blockStructures', label: 'Block Structures', prompt: prompts.promptBlockStructures, params: params.paramsBlockStructures, placeholders: new Array<string>("structure") },
    { value: 'funkyPop', label: 'Funky Pop', prompt: prompts.promptFunkyPop, params: params.paramsFunkyPop, placeholders: new Array<string>("character") },
    { value: 'sportTeamLogo', label: 'Sport Team Logo', prompt: prompts.promptSportTeamLogo, params: params.paramsSportTeamLogo, placeholders: new Array<string>("animal") },
    { value: 'goldPendant', label: 'Gold Pendant', prompt: prompts.promptGoldPendant, params: params.paramsGoldPendant, placeholders: new Array<string>("pendant type/shape") },
    { value: 'surrealMicroWorld', label: 'Surreal Micro World', prompt: prompts.promptSurrealMicroWorld, params: params.paramsSurrealMicroWorld, placeholders: new Array<string>("landscape element") },
    { value: 'cuteSticker', label: 'Cute Sticker', prompt: prompts.promptCuteSticker, params: params.paramsCuteSticker, placeholders: new Array<string>("object or character") },
    { value: 'spaceHologram', label: 'Space Hologram', prompt: prompts.promptSpaceHologram, params: params.paramsSpaceHologram, placeholders: new Array<string>("object or animal") },
    { value: 'psychedelicPopArt', label: 'Psychedelic Pop Art', prompt: prompts.promptPsychedelicPopArt, params: params.paramsPsychedelicPopArt, placeholders: new Array<string>("object or animal or character") },
    { value: 'silhoutteWallpaper', label: 'Silhoutte Wallpaper', prompt: prompts.promptSilhoutteWallpaper, params: params.paramsSilhoutteWallpaper, placeholders: new Array<string>("object or animal or character", "location") },
    { value: 'needleFeltedObject', label: 'Needle Felted Object', prompt: prompts.promptNeedleFeltedObject, params: params.paramsNeedleFeltedObject, placeholders: new Array<string>("object or animal or character") },
]