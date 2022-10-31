export const purpleVialImage = "https://unstable-labs.infura-ipfs.io/ipfs/QmWUQvTRUVmtBznRdrr9f9a5BHqrpgSzgrKi2GNYfojcTm"
export const yellowVialImage = 'https://unstable-labs.infura-ipfs.io/ipfs/QmUUtavcmzuaahX2LQnzofn7Ta6HQZeGQBnPYmWDHdxPNW'
export const greenVialImage = 'https://unstable-labs.infura-ipfs.io/ipfs/QmXxWKvXHt84nEGq8qnhbn6ZWU9ZveNz2zJjGFqNVWG1pU'
export const ipfsGateway = "https://unstable-labs.infura-ipfs.io/ipfs"

export enum Type {
    Experiment,
    PurpleVial,
    YellowVial,
    GreenVial,
}

export const PurpleVial = {
    name: "Purple Vial",
    image: purpleVialImage,
    description: "A vial of liquid. Can be used to brew a new Experiment.",
    type: Type.PurpleVial
}

export const YellowVial = {
    name: "Yellow Vial",
    image: yellowVialImage,
    description: "A vial of liquid. Can be used to brew a new Experiment.",
    type: Type.YellowVial
}

export const GreenVial = {
    name: "Green Vial",
    image: greenVialImage,
    description: "A vial of liquid. Can be used to brew a new Experiment.",
    type: Type.GreenVial
}