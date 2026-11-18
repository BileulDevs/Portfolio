/**
 * Names of the feature carousel's 3D items and of the Pokémon that roam beside them: plain string
 * unions with no import, so src/data/types.ts can use them. That file is also type-checked through
 * nuxt.config.ts (its prerender routes read the projects), where the `@` alias and Three.js are absent.
 * blockItems.ts and pokemon.ts re-export them.
 */
export type BlockKind = "grass" | "log" | "diamond" | "gold" | "emerald" | "redstone" | "lapis" | "iron" | "coal" | "spawner" | "command";
/** Balls: Cobblemon draws them all with the Poké Ball's model and animations, each with its texture. */
export type BallKind = "poke_ball" | "safari_ball" | "beast_ball";
/** Flat pixel-art items, extruded like Minecraft's held items. */
export type SpriteKind = "marks_ribbon" | "shiny_charm";
export type ItemKind = BlockKind | BallKind | SpriteKind;
export type Companion = "pikachu" | "chansey" | "kangaskhan" | "tauros" | "poipole";
