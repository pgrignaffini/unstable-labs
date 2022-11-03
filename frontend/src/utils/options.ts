import type { Option } from "../../typings"
import * as prompts from '../utils/prompts'
import * as params from '../utils/params'

export const options: Option[] = [
    { value: '3DCharacter', label: '3D Character', prompt: prompts.prompt3DCharacter, params: params.params3DCharacter, placeholders: new Array<string>("character"), type: 1 },
    { value: 'comicArt', label: 'Comic Art', prompt: prompts.promptComicArt, params: params.paramsComicArt, placeholders: new Array<string>("character"), type: 2 },
    { value: 'realisticAnime', label: 'Realistic Anime', prompt: prompts.promptRealisticAnime, params: params.paramsRealisticAnime, placeholders: new Array<string>("face description"), type: 3 },
    { value: 'cuteCreature', label: 'Cute Creature', prompt: prompts.promptCuteCreature, params: params.paramsCuteCreature, placeholders: new Array<string>("creature"), type: 4 },
    { value: 'lowPolyCreature', label: 'Low Poly Creature', prompt: prompts.promptLowPolyCreature, params: params.paramsLowPolyCreature, placeholders: new Array<string>("creature"), type: 5 },
    { value: 'renderedObject', label: 'Rendered Object', prompt: prompts.promptRenderedObject, params: params.paramsRenderedObject, placeholders: new Array<string>("object"), type: 6 },
    { value: 'isometricRooms', label: 'Isometric Rooms', prompt: prompts.promptIsometricRooms, params: params.paramsIsometricRooms, placeholders: new Array<string>("room", "colors"), type: 7 },
    { value: 'blockStructures', label: 'Block Structures', prompt: prompts.promptBlockStructures, params: params.paramsBlockStructures, placeholders: new Array<string>("structure"), type: 8 },
    { value: 'funkyPop', label: 'Funky Pop', prompt: prompts.promptFunkyPop, params: params.paramsFunkyPop, placeholders: new Array<string>("character"), type: 9 },
    { value: 'sportTeamLogo', label: 'Sport Team Logo', prompt: prompts.promptSportTeamLogo, params: params.paramsSportTeamLogo, placeholders: new Array<string>("animal"), type: 10 },
    { value: 'goldPendant', label: 'Gold Pendant', prompt: prompts.promptGoldPendant, params: params.paramsGoldPendant, placeholders: new Array<string>("pendant type/shape"), type: 11 },
    { value: 'surrealMicroWorld', label: 'Surreal Micro World', prompt: prompts.promptSurrealMicroWorld, params: params.paramsSurrealMicroWorld, placeholders: new Array<string>("landscape element"), type: 12 },
    { value: 'cuteSticker', label: 'Cute Sticker', prompt: prompts.promptCuteSticker, params: params.paramsCuteSticker, placeholders: new Array<string>("object or character"), type: 13 },
    { value: 'spaceHologram', label: 'Space Hologram', prompt: prompts.promptSpaceHologram, params: params.paramsSpaceHologram, placeholders: new Array<string>("object or animal"), type: 14 },
    { value: 'psychedelicPopArt', label: 'Psychedelic Pop Art', prompt: prompts.promptPsychedelicPopArt, params: params.paramsPsychedelicPopArt, placeholders: new Array<string>("object or animal or character"), type: 15 },
    { value: 'silhoutteWallpaper', label: 'Silhoutte Wallpaper', prompt: prompts.promptSilhoutteWallpaper, params: params.paramsSilhoutteWallpaper, placeholders: new Array<string>("object or animal or character", "location"), type: 16 },
    { value: 'needleFeltedObject', label: 'Needle Felted Object', prompt: prompts.promptNeedleFeltedObject, params: params.paramsNeedleFeltedObject, placeholders: new Array<string>("object or animal or character"), type: 17 },
]